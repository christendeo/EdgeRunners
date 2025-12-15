import * as mealCollection from '../../data/mealCollection.js';
import { getCache, setCache } from '../../config/redisConnection.js';
import { validateId, throwGraphQLError } from '../../helpers/graphQLHelpers.js';

const PUBLIC_MEALS_TTL = 600;
const MEAL_TTL = 600;
const USER_MEALS_TTL = 300;

export const resolvers = {
	// Query results are cached and only fetched if needed
	Query: {
		getAllPublicMeals: async () => {
			const cacheKey = 'meals:public';
			try {
				const cached = await getCache(cacheKey);
				if (cached) {
					return cached;
				}

				const meals = await mealCollection.getAllPublicMeals();
				await setCache(cacheKey, meals, PUBLIC_MEALS_TTL);
				return meals;
			} catch (e) {
				throwGraphQLError(e.message, 'INTERNAL_SERVER_ERROR');
			}
		},
		// Authorization checks to ensure private meals are only visible to owner
		getMealById: async (_, args, context) => {
			const mealId = validateId(args.mealId);
			const cacheKey = `meals:${mealId}`;
			let meal;

			try {
				const cached = await getCache(cacheKey);
				if (cached) {
					meal = cached;
				} else {
					meal = await mealCollection.getMealById(mealId);
					await setCache(cacheKey, meal, MEAL_TTL);
				}
			} catch (e) {
				if (e.message.includes('not found')) {
					throwGraphQLError(e.message, 'NOT_FOUND');
				}

				throwGraphQLError(e.message, 'INTERNAL_SERVER_ERROR');
			}

			if (!meal.is_public && meal.user_id.toString() !== context.user?.id) {
				// Don't reveal which IDs are valid
				throwGraphQLError(`Meal ${mealId} not found`, 'NOT_FOUND');
			}

			return meal;
		},
		getMealsByUser: async (_, args, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

			const userId = validateId(args.userId);
			if (context.user.id !== userId) {
				throwGraphQLError("Not authorized to view other users' meals", 'FORBIDDEN');
			}

			const cacheKey = `meals:user:${userId}`;

			try {
				const cached = await getCache(cacheKey);
				if (cached) {
					return cached;
				}

				const meals = await mealCollection.getMealsByUser(userId);
				await setCache(cacheKey, meals, USER_MEALS_TTL);
				return meals;
			} catch (e) {
				throwGraphQLError(e.message, 'INTERNAL_SERVER_ERROR');
			}
		}
	}
};

export default resolvers;
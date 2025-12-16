import * as mealCollection from '../../data/mealCollection.js';
import { getCache, setCache, deleteCache } from '../../config/redisConnection.js';
import { validateId, throwGraphQLError, validateString, validateNumber } from '../../helpers/graphQLHelpers.js';

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

			if (!meal.is_public && (!context.user || meal.user_id.toString() !== context.user.id)) {
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
	},
	Mutation: {
		addMeal: async (_, args, context) => {
			if (!context.user) {
			 	throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

			const userId = validateId(args.userId);
			if (context.user.id !== userId) {
				throwGraphQLError("Not authorized to create meals for other users", 'FORBIDDEN');
			}

			// Validate the meal information
			const mealName = validateString(args.name, 'Meal Name');

			if (!args.foods || !Array.isArray(args.foods) || args.foods.length === 0) {
				throwGraphQLError("Meals must contain at least one food item", 'BAD_USER_INPUT');
			}

			const validatedFoods = args.foods.map(food => {
				// Validate each meal food
				validateId(food.food_id);
				validateNumber(food.quantity, 'Food Quantity', 0.01);

				return {
					food_id: food.food_id,
					quantity: food.quantity,
					serving_unit: food.serving_unit || "serving"
				}
			});

			try {
				const meal = await mealCollection.addMeal(userId, mealName, validatedFoods, args.is_public || false);
				await deleteCache(`meals:user:${userId}`);
				await deleteCache('meals:public');
				return meal;
			} catch (e) {
				throwGraphQLError(e.message, 'INTERNAL_SERVER_ERROR');
			}
		},
		updateMeal: async (_, args, context) => {
			if (!context.user) {
			 	throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

			const mealId = validateId(args.mealId);

			try {
				const meal = await mealCollection.getMealById(mealId);
				if (context.user.id !== meal.user_id.toString()) {
					throwGraphQLError(`Meal ${mealId} not found`, 'NOT_FOUND');
				}

				const updateData = {};

				if (args.name !== undefined) {
					updateData.name = validateString(args.name, 'Meal Name', 1, 100);
				}

				if (args.is_public !== undefined) {
					updateData.is_public = args.is_public;
				}

				if (args.foods !== undefined) {
					// Validate each meal food
					if (!Array.isArray(args.foods) || args.foods.length === 0) {
						throwGraphQLError("Meals must contain at least one food item", 'BAD_USER_INPUT');
					}

					updateData.foods = args.foods.map(food => {
						validateId(food.food_id);
						validateNumber(food.quantity, 'Food Quantity', 0.01);

						return {
							food_id: food.food_id,
							quantity: food.quantity,
							serving_unit: food.serving_unit || "serving"
						}
					});
				}

				if (Object.keys(updateData).length === 0) {
					throwGraphQLError("No fields to update", 'BAD_USER_INPUT');
				}

				// Update meal and delete outdated caches
				const updatedMeal = await mealCollection.updateMeal(mealId, updateData);
				await deleteCache(`meals:${mealId}`);
				await deleteCache(`meals:user:${context.user.id}`);
				await deleteCache('meals:public');
				return updatedMeal;
			} catch (e) {
				if (e.extensions?.code) {
					throw e; // Rethrow GraphQL errors
				}

				if (e.message.includes("not found")) {
					throwGraphQLError(e.message, 'NOT_FOUND');
				}

				throwGraphQLError(e.message, 'INTERNAL_SERVER_ERROR');
			}
		},
		deleteMeal: async (_, args, context) => {
			if (!context.user) {
			 	throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

			const mealId = validateId(args.mealId);

			try {
				const meal = await mealCollection.getMealById(mealId);
				if (context.user.id !== meal.user_id.toString()) {
					throwGraphQLError(`Meal ${mealId} not found`, 'NOT_FOUND');
				}

				// Delete meal and outdated caches
				const deletedMeal = await mealCollection.deleteMeal(mealId);
				await deleteCache(`meals:${mealId}`);
				await deleteCache(`meals:user:${context.user.id}`);
				await deleteCache(`meals:public`);

				return deletedMeal;
			} catch (e) {
				if (e.extensions?.code) {
					throw e; // Rethrow GraphQL errors
				}

				if (e.message.includes("not found")) {
					throwGraphQLError(e.message, 'NOT_FOUND');
				}

				throwGraphQLError(e.message, 'INTERNAL_SERVER_ERROR');
			}
		}
	},
	Meal: {
		_id: (parent) => parent._id.toString(),
		user_id: (parent) => parent.user_id.toString(),
		created_at: (parent) => parent.created_at instanceof Date
			? parent.created_at.toISOString()
			: parent.created_at
	},
	MealFood: {
		food_id: (parent) => parent.food_id.toString()
	}
};

export default resolvers;
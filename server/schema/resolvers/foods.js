import * as foodData from '../../data/foodCollection.js';
import * as userData from '../../data/userCollection.js';
import { searchFoods } from '../../data/foodSearch.js'
import { throwGraphQLError, validateId } from '../../helpers/graphQLHelpers.js';
import { getCache, setCache, deleteCache, } from '../../config/redisConnection.js';

export const resolvers = {
    Query: {
        getFoodById: async (_, args) => {
            const cacheKey = `food:${args._id}`;
            const cached = await getCache(cacheKey);
            if (cached) {
                return cached;
            }

            const food = await foodData.getFoodById(args._id);
            if (!food) {
				throwGraphQLError('Food not found', 'NOT_FOUND');
            }

			await setCache(cacheKey, food);
			return food;
        },
        getFoodsByUser: async(_, args, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

			const userId = validateId(args._id);
			if (context.user.id !== userId) {
				throwGraphQLError("Not authorized to view other users' foods", 'FORBIDDEN');
			}

            const cacheKey = `userFoods:${args._id}`;

			try {
				const cached = await getCache(cacheKey);
				if (cached) {
					return cached;
				}

				const userFoods = await foodData.getFoodsByUser(args._id);
				await setCache(cacheKey, userFoods);
				return userFoods;
			} catch (e) {
				throwGraphQLError(e.message, 'INTERNAL_SERVER_ERROR');
			}
        },
        foods: async () => {
			const cacheKey = 'allFoods';

			try {
				const cached = await getCache(cacheKey);
				if (cached) {
					return cached;
				}
				
				const allFoods = await foodData.getAllFoods();
				await setCache('allFoods', allFoods);
				return allFoods;
			} catch (e) {
				throwGraphQLError(e.message, 'INTERNAL_SERVER_ERROR');
			}
        },
        searchFoods: async (_, args) => {
			const { filters, page = 1, limit = 20 } = args;
			
			try {
				const results = await searchFoods(filters || {}, page, limit);
				return results;
			} catch (error) {
				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}
		},
    },
    Mutation: {
        addFood: async (_, args, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

			if (args.added_by !== context.user.id) {
				throwGraphQLError("Not authorized to create foods for other users", 'FORBIDDEN');
			}

			let newFood;
			try {
				newFood = await foodData.addFood(
					args.name,
					args.serving_size,
					args.serving_unit,
					args.calories,
					args.protein,
					args.carbs,
					args.fat,
					args.fiber,
					args.added_by,
					args.is_public,
				);
			} catch (error) {
				if (error.message.includes("Could not add food")) {
					throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
				}

				throwGraphQLError(error.message, 'BAD_USER_INPUT');
			}

			try {
				await deleteCache('allFoods');
			} catch (error) {
				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}

			return newFood;
        },
        updateFood: async (_, args, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

			const { _id, ...updateData } = args;

			try {
				const food = await foodData.getFoodById(_id);
				if (food.added_by !== context.user.id) {
					// Don't reveal valid food IDs
					throwGraphQLError(`Food ${_id} not found`, 'NOT_FOUND');
				}
			} catch (error) {
				if (error.extensions?.code) { // Rethrow GraphQL errors
					throw error;
				}

				if (error.message.includes('not found')) {
					throwGraphQLError(error.message, 'NOT_FOUND');
				}

				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}

            let updatedFood;
			
			try {
				updatedFood = await foodData.updateFood(_id, updateData);
			} catch (error) {
				throwGraphQLError(error.message, 'BAD_USER_INPUT');
			}
			
            try {
				await deleteCache('allFoods');
				await deleteCache(`food:${_id}`);
			} catch (error) {
				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}

			return updatedFood;
        },

        removeFood: async (_, args, context) => {
            if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

            const { _id } = args;

			try {
				const food = await foodData.getFoodById(_id);
				if (food.added_by !== context.user.id) {
					throwGraphQLError(`Food ${_id} not found`, 'NOT_FOUND');
				}
			} catch (error) {
				if (error.extensions?.code) {
					throw error;
				}

				if (error.message.includes('not found')) {
					throwGraphQLError(error.message, 'NOT_FOUND');
				}

				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}

			try {
				const removedFood = await foodData.removeFood(_id);
				await deleteCache('allFoods');
				await deleteCache(`food:${_id}`);
				return removedFood;
			} catch (error) {
				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}
        }
    },

    Food: {
        added_by: async (parent) => {
			if (!parent.added_by) {
				return null;
			}

			try {
				return await userData.getUserById(parent.added_by);
			} catch {
				return null;
			}
        }
    }
}

export default resolvers;
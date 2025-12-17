import * as foodLogs from '../../data/foodLogCollection.js';
import { throwGraphQLError, validateId } from '../../helpers/graphQLHelpers.js';
import { getCache, setCache, deleteCache, } from '../../config/redisConnection.js';

export const resolvers = {
    Query: {
        getRangedFoodLogs: async (parent, { startDate, endDate }, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

            try {
                //decided no caching for ranged queries - they change frequently with add/update/delete
                return await foodLogs.getRangedFoodlogs(context.user.id, startDate, endDate);
            } catch (e) {
                throwGraphQLError(e.message, 'INTERNAL_SERVER_ERROR');
            }
        },
        getFoodLogById: async (_, args, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

			const logId = validateId(args.logId);
			const cacheKey = `foodLog:${logId}`;

            try {
                const cached = await getCache(cacheKey);
                if (cached) {
					if (cached.user_id.toString() !== context.user.id) {
						throwGraphQLError(`Food log ${logId} not found`, 'NOT_FOUND');
					}
                    return cached;
                }

                const log = await foodLogs.getFoodlogById(context.user.id, logId);
                await setCache(cacheKey, log, 300);
                return log;
            } catch (e) {
				if (e.extensions?.code) {
					throw e;
				}

				if (e.message.includes('No food log found')) {
					throwGraphQLError(e.message, 'NOT_FOUND');
				}

				throwGraphQLError(e.message, 'INTERNAL_SERVER_ERROR');
            }
        },
        getTodayFoodLog: async (_, _args, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

			const now = new Date();
			const today = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;
			const cacheKey = `foodLog:${context.user.id}:today`;

            try {
                const cached = await getCache(cacheKey);
                if (cached) {
                    return cached;
                }

                //get today's log using getRangedFoodlogs
                const logs = await foodLogs.getRangedFoodlogs(context.user.id, today, today);

                const todayLog = logs[0] || null;
                if (todayLog) {
                    await setCache(cacheKey, todayLog, 60);
                }

                return todayLog;
            } catch (e) {
                throwGraphQLError(e.message, 'INTERNAL_SERVER_ERROR');
            }
        },
    },
    Mutation: {
        addFoodLog: async (_, { input }, context) => {
            if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

            try {
                const result = await foodLogs.addFoodLog(context.user.id, input.date, input.meals_logged, input.notes);
                await deleteCache(`foodLog:${context.user.id}:today`);
                return result;
            } catch (e) {
				if (e.message.includes("could not be added")) {
					throwGraphQLError(e.message, 'INTERNAL_SERVER_ERROR');
				}

                throwGraphQLError(e.message, 'BAD_USER_INPUT');
            }
        },
        updateFoodLog: async (_, args, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

			const logId = validateId(args.logId);

            try {
                const result = await foodLogs.updateFoodlog(context.user.id, logId, args.updatedMealsLogged, args.notes);
                await deleteCache(`foodLog:${logId}`);
                await deleteCache(`foodLog:${context.user.id}:today`);
                return result;
            } catch (e) {
				if (e.message.includes("No food log found")) {
					throwGraphQLError(e.message, 'NOT_FOUND');
				}

				if (e.message.includes("Could not delete")) {
					throwGraphQLError(e.message, 'INTERNAL_SERVER_ERROR');
				}

                throwGraphQLError(e.message, 'BAD_USER_INPUT');
            }
        },
        removeFoodLog: async (_, args, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

			const logId = validateId(args.logId);

            try {
                const result = await foodLogs.removeFoodlog(context.user.id, logId);
                await deleteCache(`foodLog:${logId}`);
                await deleteCache(`foodLog:${context.user ? context.user.id : TEST_USER_ID}:today`);
                return result;
            } catch (e) {
				if (e.message.includes("No food log found")) {
					throwGraphQLError(e.message, 'NOT_FOUND');
				}

                if (e.message.includes("Could not delete")) {
					throwGraphQLError(e.message, 'INTERNAL_SERVER_ERROR');
				}

                throwGraphQLError(e.message, 'INTERNAL_SERVER_ERROR');
            }
        },
    },

    //field resolvers (if you need to populate nested data)
    FoodLog: {
        //if you need to transform or populate fields
        _id: (parent) => parent._id.toString(),
        user_id: (parent) => parent.user_id.toString(),
    },

    MealLogged: {
        meal_id: (parent) => parent.meal_id.toString(),
    },

    FoodItem: {
        food_id: (parent) => parent.food_id.toString(),
    },
};

export default resolvers;
import {GraphQLError} from 'graphql';
import * as foodLogs from '../../data/foodLogCollection.js';
import { getCache, setCache, deleteCache, } from '../../config/redisConnection.js';

const TEST_USER_ID = "693e185148537db1fa2c23e9"; //testing without GraphQL context auth system 

export const resolvers = {
    Query: {
        getRangedFoodLogs: async (parent, { startDate, endDate }, context) => {
            // if (!context.user) { //check auth
            //     throw new GraphQLError('Not authenticated', {
            //         extensions: { code: 'UNAUTHENTICATED' }
            //     });
            // }

            try {
                //decided no caching for ranged queries - they change frequently with add/update/delete
                const logs = await foodLogs.getRangedFoodlogs(
                    context.user ? context.user.id : TEST_USER_ID,
                    startDate,
                    endDate
                );

                return logs;

            } catch (e) {
                throw new GraphQLError(e.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
                });
            }
        },

        getFoodLogById: async (parent, { logId }, context) => {
            // if (!context.user) {
            //     throw new GraphQLError('Not authenticated', {
            //         extensions: { code: 'UNAUTHENTICATED' }
            //     });
            // }

            try {
                const cacheKey = `foodLog:${logId}`;
                const cached = await getCache(cacheKey);
                
                if (cached) {
                    return (cached);
                }

                const log = await foodLogs.getFoodlogById(
                    context.user ? context.user.id : TEST_USER_ID,
                    logId
                );

                // Cache for 5 minutes
                await setCache(cacheKey, log, 300);

                return log;
            } catch (e) {
                throw new GraphQLError(e.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
                });
            }
        },

        getTodayFoodLog: async (parent, args, context) => {
            // if (!context.user) {
            //     throw new GraphQLError('Not authenticated', {
            //         extensions: { code: 'UNAUTHENTICATED' }
            //     });
            // }

            try {
                const now = new Date();
                const today = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`
                const cacheKey = `foodLog:${context.user ? context.user.id : TEST_USER_ID}:today`;
                const cached = await getCache(cacheKey);
                
                if (cached) {
                    return cached;
                }

                //get today's log using getRangedFoodlogs
                const logs = await foodLogs.getRangedFoodlogs(
                    context.user ? context.user.id : TEST_USER_ID,
                    today,
                    today
                );

                const todayLog = logs[0] || null;

                //cache for 1 minute (frequently updated)
                if (todayLog) {
                    await setCache(cacheKey, todayLog, 60);
                }

                return todayLog;
            } catch (e) {
                throw new GraphQLError(e.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
                });
            }
        },
    },

    Mutation: {
        addFoodLog: async (parent, { input }, context) => {
            // if (!context.user) {
            //     throw new GraphQLError('Not authenticated', {
            //         extensions: { code: 'UNAUTHENTICATED' }
            //     });
            // }

            try {
                const result = await foodLogs.addFoodLog(
                    context.user ? context.user.id : TEST_USER_ID,
                    input.date,
                    input.meals_logged,
                    input.notes
                );

                //invalidate today's cache only (ranged queries no longer cached)
                await deleteCache(`foodLog:${context.user ? context.user.id : TEST_USER_ID}:today`);

                return result;
            } catch (e) {
                throw new GraphQLError(e.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
                });
            }
        },

        updateFoodLog: async (parent, { logId, updatedMealsLogged, notes }, context) => {
            // if (!context.user) {
            //     throw new GraphQLError('Not authenticated', {
            //         extensions: { code: 'UNAUTHENTICATED' }
            //     });
            // }

            try {
                const result = await foodLogs.updateFoodlog(
                    context.user ? context.user.id : TEST_USER_ID,
                    logId,
                    updatedMealsLogged,
                    notes
                );

                await deleteCache(`foodLog:${logId}`);
                await deleteCache(`foodLog:${context.user ? context.user.id : TEST_USER_ID}:today`);

                return result;
            } catch (e) {
                throw new GraphQLError(e.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
                });
            }
        },

        removeFoodLog: async (parent, { logId }, context) => {
            // if (!context.user) {
            //     throw new GraphQLError('Not authenticated', {
            //         extensions: { code: 'UNAUTHENTICATED' }
            //     });
            // }

            try {
                const result = await foodLogs.removeFoodlog(
                    context.user ? context.user.id : TEST_USER_ID,  // Fixed: was context.user.id
                    logId
                );

                //invalidate caches
                await deleteCache(`foodLog:${logId}`);
                await deleteCache(`foodLog:${context.user ? context.user.id : TEST_USER_ID}:today`);

                return result;
            } catch (e) {
                throw new GraphQLError(e.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
                });
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
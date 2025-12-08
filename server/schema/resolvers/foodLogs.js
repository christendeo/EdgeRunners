import {GraphQLError} from 'graphql';
import * as foodLogs from '../../data/foodLogCollection.js';
import { getCache, setCache, deleteCache, } from '../../config/redisConnection.js';

export const resolvers = {
    Query: {
        getRangedFoodLogs: async (parent, { startDate, endDate }, context) => {
            if (!context.user) { //check auth
                throw new GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }

            try {
                const cacheKey = `foodLogs:${context.user.id}:${startDate}:${endDate}`;
                const cached = await getCache(cacheKey);
                
                if (cached) {
                    return JSON.parse(cached);
                }

                const logs = await foodLogs.getRangedFoodlogs(
                    context.user.id,
                    startDate,
                    endDate
                );

                await setCache(cacheKey, JSON.stringify(logs), 300);

                return logs;
            } catch (e) {
                throw new GraphQLError(e.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
                });
            }
        },

        getFoodLogById: async (parent, { logId }, context) => {
            if (!context.user) {
                throw new GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }

            try {
                const cacheKey = `foodLog:${logId}`;
                const cached = await getCache(cacheKey);
                
                if (cached) {
                    return JSON.parse(cached);
                }

                const log = await foodLogs.getFoodlogById(
                    context.user.id,
                    logId
                );

                // Cache for 5 minutes
                await setCache(cacheKey, JSON.stringify(log), 300);

                return log;
            } catch (e) {
                throw new GraphQLError(e.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
                });
            }
        },

        getTodayFoodLog: async (parent, args, context) => {
            if (!context.user) {
                throw new GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }

            try {
                const today = new Date().toISOString().split('T')[0];
                const cacheKey = `foodLog:${context.user.id}:today`;
                const cached = await getCache(cacheKey);
                
                if (cached) {
                    return JSON.parse(cached);
                }

                //get today's log using getRangedFoodlogs
                const logs = await foodLogs.getRangedFoodlogs(
                    context.user.id,
                    today,
                    today
                );

                const todayLog = logs[0] || null;

                //cache for 1 minute (frequently updated)
                if (todayLog) {
                    await setCache(cacheKey, JSON.stringify(todayLog), 60);
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
            if (!context.user) {
                throw new GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }

            try {
                const result = await foodLogs.addFoodLog(
                    context.user.id,
                    input.date,
                    input.meals_logged,
                    input.notes
                );

                //invalidate relevant caches
                const dateKey = input.date.split('T')[0];
                await deleteCache(`foodLog:${context.user.id}:today`);
                await deleteCache(`foodLogs:${context.user.id}:*`); // Pattern delete if supported

                return result;
            } catch (e) {
                throw new GraphQLError(e.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
                });
            }
        },

        updateFoodLog: async (parent, { logId, updatedMealsLogged }, context) => {
            if (!context.user) {
                throw new GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }

            try {
                const result = await foodLogs.updateFoodlog(
                    context.user.id,
                    logId,
                    updatedMealsLogged
                );

                await deleteCache(`foodLog:${logId}`);
                await deleteCache(`foodLog:${context.user.id}:today`);
                await deleteCache(`foodLogs:${context.user.id}:*`);

                return result;
            } catch (e) {
                throw new GraphQLError(e.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
                });
            }
        },

        removeFoodLog: async (parent, { logId }, context) => {
            if (!context.user) {
                throw new GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }

            try {
                const result = await foodLogs.removeFoodlog(
                    context.user.id,
                    logId
                );

                //invalidate caches
                await deleteCache(`foodLog:${logId}`);
                await deleteCache(`foodLog:${context.user.id}:today`);
                await deleteCache(`foodLogs:${context.user.id}:*`);

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
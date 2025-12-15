import { GraphQLError } from 'graphql';
import * as mealsData from '../../data/mealCollection.js';
import { getCache, setCache, deleteCache } from '../../config/redisConnection.js';

const TEST_USER_ID = "693e185148537db1fa2c23e9"; // Same as food logs

export const mealResolvers = {
    Query: {
        getAllPublicMeals: async () => {
            try {
                const cacheKey = 'meals:public';
                const cached = await getCache(cacheKey);
                
                if (cached) {
                    console.log('Cache hit:', cacheKey);
                    return cached;
                }
                
                console.log('Cache miss:', cacheKey);
                const meals = await mealsData.getAllPublicMeals();
                
                await setCache(cacheKey, meals, 600); // 10 minutes
                
                return meals;
            } catch (e) {
                throw new GraphQLError(e.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
                });
            }
        },

        getMealById: async (_, { _id }) => {
            try {
                const cacheKey = `meal:${_id}`;
                const cached = await getCache(cacheKey);
                
                if (cached) {
                    return cached;
                }
                
                const meal = await mealsData.getMealById(_id);
                
                await setCache(cacheKey, meal, 600);
                
                return meal;
            } catch (e) {
                throw new GraphQLError(e.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
                });
            }
        },

        getUserMeals: async (_, args, context) => {
            // TODO: Use context.user.id when auth is implemented
            const userId = context.user ? context.user.id : TEST_USER_ID;
            
            try {
                const cacheKey = `meals:user:${userId}`;
                const cached = await getCache(cacheKey);
                
                if (cached) {
                    console.log('Cache hit:', cacheKey);
                    return cached;
                }
                
                console.log('Cache miss:', cacheKey);
                const meals = await mealsData.getMealsByUser(userId);
                
                await setCache(cacheKey, meals, 300); // 5 minutes
                
                return meals;
            } catch (e) {
                throw new GraphQLError(e.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
                });
            }
        }
    },

    // Field resolvers to convert ObjectIds to strings
    Meal: {
        _id: (parent) => parent._id.toString(),
        user_id: (parent) => parent.user_id.toString()
    },

    MealFood: {
        food_id: (parent) => parent.food_id.toString()
    }
};

export default mealResolvers;
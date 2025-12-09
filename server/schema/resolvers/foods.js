import * as foodData from '../../data/foodCollection.js';
import { searchFoods } from '../../data/foodSearch.js'
import {GraphQLError} from 'graphql';
import { getCache, setCache, deleteCache, } from '../../config/redisConnection.js';



export const resolvers = {
    Query: {
        
        getFoodById: async (_, args) => {

            const cacheKey = `food:${args._id}`;

            const cached = await getCache(cacheKey);
            if (cached) {
                console.log('Cache hit for:', cacheKey);
                return cached;
            }
            console.log('Cache miss for:', cacheKey);
            
            const food = await foodData.getFoodById(args._id);
            if (!food) {
                throw new GraphQLError('Food Not Found', {
                    extensions: {code: 'NOT_FOUND'}
                });
            
            }
        await setCache(cacheKey, food);
        return food;
        },
        foods: async () => {
             const cacheKey = 'allFoods';

            const cached = await getCache(cacheKey);
            if (cached) {
                console.log('Cache hit for:', cacheKey);
                return cached;
            }
            console.log('Cache miss for:', cacheKey);
            
            const allFoods = await foodData.getAllFoods();
            if (!allFoods) {
                throw new GraphQLError('Internal Server Error', {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }
            await setCache('allFoods', allFoods);
            return allFoods;
        },

        searchFoods: async (_, args) => {
        const { filters, page = 1, limit = 20 } = args;
        
        try {
            const results = await searchFoods(filters || {}, page, limit);
            return results;
        } catch (error) {
            throw new GraphQLError('Search failed', {
                extensions: { code: 'INTERNAL_SERVER_ERROR'}
            });
        }
    },

    },

    

    Mutation: {

        addFood: async (_, args) => {
            
            const newFood = await foodData.addFood (
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

            await deleteCache('allFoods');
            return newFood;


        },

        updateFood: async (_, args) => {
            
            const { _id, ...updateData } = args;
            const updatedFood = await foodData.updateFood (_id, updateData);

            await deleteCache('allFoods');
            await deleteCache(`food:${_id}`);
            return updatedFood;


        },

        removeFood: async (_, args) => {
            
            const { _id } = args;
            const removedFood = await foodData.removeFood (_id);

            await deleteCache('allFoods');
            await deleteCache(`food:${_id}`);
            return removedFood;


        }
    }
}



export default resolvers;


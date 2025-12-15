import { ObjectId } from 'mongodb';

import { foods } from '../config/mongoCollections.js';
import helpers from '../helpers/serverHelpers.js';
const { checkId, validateString, validateNumber, validateBoolean } = helpers;


export const getAllFoods = async () => {
    const foodCollection = await foods();
    const allFoods = await foodCollection.find({}).toArray();
    
    return allFoods;
}

export const getFoodById = async (foodId) => {
    const id = checkId(foodId, 'foodId');

    const foodCollection = await foods();
    const food = await foodCollection.findOne({_id: new ObjectId(id)});
    if (food === null) throw new Error('No food with that ID');
    food._id = food._id.toString();
    return food;
}

export const getFoodsByUser = async (userId) => {
    console.log('Searching for userId:', userId);
    const foodCollection = await foods();

    const userFoods = await foodCollection.find({ added_by: userId }).toArray();

    console.log('Found foods:', userFoods);
    
    return userFoods.map(food => ({
        ...food,
        _id: food._id.toString()
    }));
}

export const removeFood = async (foodId) => {
    const id = checkId(foodId, 'foodId');
    const foodCollection = await foods();
    const deletedFood = await foodCollection.findOneAndDelete({_id: new ObjectId(id)});

    if (!deletedFood) {
        throw new Error(`Could not delete food with ID of ${id}`);
    }
    
    return deletedFood;

}

export const updateFood = async(foodId, updatedFoodData) => {
    if (!foodId || !updatedFoodData) {
        throw new Error('All inputs must have valid values');
    }
    const id = checkId(foodId, 'foodId');
    const foodCollection = await foods();

    let existingFood = await foodCollection.findOne({ _id: new ObjectId(id)});
    let updatedFood = {};
    console.log(existingFood);

    if (!existingFood) {
        throw new Error(`Could not update food with ID of ${id}`);
    }   
    else {    
        if (updatedFoodData.name) {
            updatedFood.name = validateString(updatedFoodData.name, 'name');
        }
        if (updatedFoodData.serving_size) {
            updatedFood.serving_size = validateNumber(updatedFoodData.serving_size, 'serving_size');
        }
        if (updatedFoodData.serving_unit) {
            updatedFood.serving_unit = validateString(updatedFoodData.serving_unit, 'serving_unit');
        }
        if (updatedFoodData.calories !== undefined) {
            updatedFood.calories = validateNumber(updatedFoodData.calories, 'calories');
        }
        if (updatedFoodData.protein) {
            updatedFood.protein = validateNumber(updatedFoodData.protein, 'protein');
        }
        if (updatedFoodData.carbs) {
            updatedFood.carbs = validateNumber(updatedFoodData.carbs, 'carbs');
        }
        if (updatedFoodData.fat) {
            updatedFood.fat = validateNumber(updatedFoodData.fat, 'fat');
        }
        if (updatedFoodData.fiber) {
            updatedFood.fiber = validateNumber(updatedFoodData.fiber, 'fiber');
        }
        if (updatedFoodData.added_by) {
            updatedFood.added_by = checkId(updatedFoodData.added_by, 'added_by');
        }
        if (updatedFoodData.is_public) {
            updatedFood.is_public = validateBoolean(updatedFoodData.is_public, 'is_public');
        }
        await foodCollection.updateOne({"_id": new ObjectId(id)}, {"$set": updatedFood})
        
    }
    const result = await foodCollection.findOne({ _id: new ObjectId(id) });
    return result;
}

export const addFood = async (
    name,
    serving_size,
    serving_unit,
    calories,
    protein,
    carbs,
    fat,
    fiber,
    added_by,
    is_public
) => {
    

    const foodCollection = await foods();

    const newFood = {
        name: validateString(name, 'name'),
        serving_size: validateNumber(serving_size, 'serving_size'),
        serving_unit: validateString(serving_unit, 'serving_unit'),
        calories: validateNumber(calories, 'calories'),
        protein: validateNumber(protein, 'protein'),
        carbs: validateNumber(carbs, 'carbs'),
        fat: validateNumber(fat, 'fat'),
        fiber: validateNumber(fiber, 'fiber'),
        added_by: checkId(added_by, 'added_by'),
        is_public: validateBoolean(is_public, 'is_public'),
        created_at: new Date()
    }

    let insertedFood = await foodCollection.insertOne(newFood);
    if (!insertedFood.acknowledged) {
        throw new Error('Could not add food');
    }
    const addedFood = await foodCollection.findOne({
        _id: insertedFood.insertedId
    });
    return addedFood;
}
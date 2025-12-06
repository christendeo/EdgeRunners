// Food Collection CRUD
import { ObjectId } from 'mongodb';

import { foods } from '../config/mongoCollections.js'



export const getAllFoods = async () => {
    const foodCollection = await foods();
    const allFoods = await foodCollection.find({}).toArray();
    
    return allFoods;
}

export const getFoodById = async (foodId) => {
    const id = (foodId);

    const foodCollection = await foods();
    const food = await foodCollection.findOne({_id: new ObjectId(id)});
    if (food === null) throw new Error('No food with that ID');
    food._id = food._id.toString();
    return food;
}

export const removeFood = async (foodId) => {
    const id = (foodId);
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
    const id = (foodId);
    const foodCollection = await foods();

    let existingFood = await foodCollection.findOne({ _id: new ObjectId(id)});
    let updatedFood = {};
    console.log(existingFood);

    if (!existingFood) {
        throw new Error(`Could not update food with ID of ${id}`);
    }
    else {
        if (updatedFoodData.name) {
            updatedFood.name = updatedFoodData.name;
        }
        if (updatedFoodData.serving_size) {
            updatedFood.serving_size = updatedFoodData.serving_size;
        }
        if (updatedFoodData.serving_unit) {
            updatedFood.serving_unit = updatedFoodData.serving_unit;
        }
        if (updatedFoodData.calories !== undefined) {
            updatedFood.calories = updatedFoodData.calories;
        }
        if (updatedFoodData.protein) {
            updatedFood.protein = updatedFoodData.protein;
        }
        if (updatedFoodData.carbs) {
            updatedFood.carbs = updatedFoodData.carbs;
        }
        if (updatedFoodData.fat) {
            updatedFood.fat = updatedFoodData.fat;
        }
        if (updatedFoodData.fiber) {
            updatedFood.fiber = updatedFoodData.fiber;
        }
        if (updatedFoodData.added_by) {
            updatedFood.added_by = updatedFoodData.added_by;
        }
        if (updatedFoodData.is_public) {
            updatedFood.is_public = updatedFoodData.is_public;
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
    //validation functions for all inputs

    const foodCollection = await foods();

    const newFood = {
        name,
        serving_size,
        serving_unit,
        calories,
        protein,
        carbs,
        fat,
        fiber,
        added_by,
        is_public,
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
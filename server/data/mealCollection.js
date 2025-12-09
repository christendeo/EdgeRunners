import { foods, meals } from '../config/mongoCollections.js';
import helpers from '../helpers/serverHelpers.js';
import { ObjectId } from 'mongodb';

// Validation will be in routes
// What happens if a meal's total calories, protein, etc. change after being stored in the database?

/** Get total calories, protein, carbs, fat, and fiber for all food in an array. */
const calculateMealTotals = async (foodsArray) => {
	let total_calories = 0;
	let total_protein = 0;
	let total_carbs = 0;
	let total_fat = 0;
	let total_fiber = 0;

	const foodCollection = await foods();
	for (const foodItem of foodsArray) {
		const food = await foodCollection.findOne({ _id: new ObjectId(foodItem.food_id) });

		if (!food) {
			throw new Error(`Food ${foodItem.food_id} not found`);
		}

		const multiplier = foodItem.quantity || 1;
		total_calories += (food.calories || 0) * multiplier;
		total_protein += (food.protein || 0) * multiplier;
		total_carbs += (food.carbs || 0) * multiplier;
		total_fat += (food.fat || 0) * multiplier;
		total_fiber += (food.fiber || 0) * multiplier;
	}

	return { total_calories, total_protein, total_carbs, total_fat, total_fiber };
};

const checkFoodArray = async (foodArray) => {
	if (!Array.isArray(foodArray) || foodArray.length === 0)
		throw new Error("Meals must contain at least one food item");

	const foodCollection = await foods();
	for (const foodItem of foodArray) {
		let foodId;
		try {
			foodId = helpers.checkId(foodItem.food_id, 'Food ID');
		} catch (e) {
			throw new Error(e);
		}

		const food = await foodCollection.findOne({ _id: new ObjectId(foodId) });
		if (!food) {
			throw new Error(`Food ${foodId} does not exist`);
		}

		// TODO: Should this be integer? Or should we allow like half a food? This needs more validation
		if (foodItem.quantity === undefined || typeof foodItem.quantity !== 'number' || foodItem.quantity <= 0) {
			throw new Error("Food quantity must be a positive number");
		}

		if (foodItem.serving_unit !== undefined) {
			helpers.validateString(foodItem.serving_unit, "Serving unit", 1, 20);
		}
	}
};

/** Returns all public meals sorted by newest first. */
export const getAllPublicMeals = async () => {
	const mealCollection = await meals();
	const allPublicMeals = await mealCollection.find({ is_public: true }).sort({ created_at: -1 }).toArray();

	if (!allPublicMeals) {
		throw new Error("Error retrieving public meals");
	}

	return allPublicMeals;
};

/** Returns a meal given its meal ID. */
export const getMealById = async (mealId) => {
	try {
		mealId = helpers.checkId(mealId, "Meal ID");
	} catch (e) {
		throw new Error(e);
	}

	const mealCollection = await meals();
	const meal = await mealCollection.findOne({ _id: new ObjectId(mealId) });

	if (!meal) {
		throw new Error(`Meal ${mealId} not found`);
	}

	return meal;
};

/** Returns all meals made by a user given their ID. */
export const getMealsByUser = async (userId) => {
	try {
		userId = helpers.checkId(userId, "User ID");
	} catch (e) {
		throw new Error(e);
	}

	const mealCollection = await meals();
	const userMeals = await mealCollection.find({ user_id: new ObjectId(userId) }).sort({ created_at: -1 }).toArray();
	return userMeals;
};

/** Add a meal to a user given its name, array of foods, and public setting. */
export const addMeal = async (userId, name, foodArray, is_public = false) => {
	// Validate meal inputs
	try {
		userId = helpers.checkId(userId, 'User ID');
		name = helpers.checkString(name, 'Meal Name');
	} catch (e) {
		throw new Error(e);
	}

	await checkFoodArray(foodArray);

	// Construct meal object with meal totals
	const totals = await calculateMealTotals(foodArray);
	const mealCollection = await meals();

	const newMeal = {
		_id: new ObjectId(),
		name: name,
		user_id: new ObjectId(userId),
		foods: foodArray.map(item => ({
			food_id: new ObjectId(item.food_id),
			quantity: item.quantity,
			serving_unit: item.serving_unit || "serving"
		})),
		...totals,
		is_public: Boolean(is_public),
		created_at: new Date()
	};

	const insertInfo = await mealCollection.insertOne(newMeal);
	if (!insertInfo.acknowledged || !insertInfo.insertedId) {
		throw new Error("Error adding meal");
	}

	return newMeal;
};

export const updateMeal = async (mealId, updateData) => {
	// Validate meal
	try {
		mealId = helpers.checkId(mealId, "Meal ID");
	} catch (e) {
		throw new Error(e);
	}

	const mealCollection = await meals();
	const mealObjectId = new ObjectId(mealId);
	const meal = await mealCollection.findOne({ _id: mealObjectId });

	if (!meal) {
		throw new Error(`Meal ${mealId} not found`);
	}

	// Validate and construct the updated meal
	const updatedMeal = {};

	if (updateData.name !== undefined) {
		try {
			updatedMeal.name = helpers.checkString(updateData.name, "Meal Name");
		} catch (e) {
			throw new Error(e);
		}
	}

	if (updateData.is_public !== undefined) {
		updatedMeal.is_public = Boolean(updateData.is_public);
	}

	if (updateData.foods !== undefined) {
		await checkFoodArray(updateData.foods);

		updatedMeal.foods = updateData.foods.map(item => ({
			food_id: new ObjectId(item.food_id),
			quantity: item.quantity,
			serving_unit: item.serving_unit || "serving"
		}));

		const totals = await calculateMealTotals(updatedMeal.foods);
		Object.assign(updatedMeal, totals);
	}

	if (Object.keys(updatedMeal).length === 0) {
		throw new Error("No fields to update");
	}

	const newMeal = await mealCollection.findOneAndUpdate(
		{ _id: mealObjectId },
		{ $set: updatedMeal },
		{ returnDocument: 'after' }
	);

	if (!newMeal) {
		throw new Error(`Could not update meal ${mealId}`);
	}

	return newMeal;
};

export const deleteMeal = async (mealId) => {
	try {
		mealId = helpers.checkId(mealId, "Meal ID");
	} catch (e) {
		throw new Error(e);
	}

	const mealCollection = await meals();
	const mealObjectId = new ObjectId(mealId);
	const meal = await mealCollection.findOne({ _id: mealObjectId });

	if (!meal) {
		throw new Error(`Meal ${mealId} not found`);
	}

	const deletionInfo = await mealCollection.deleteOne({ _id: mealObjectId });
	if (deletionInfo.deletedCount === 0) {
		throw new Error(`Could not delete meal ${mealId}`);
	}

	return meal;
};
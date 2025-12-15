import helpers from "../helpers/serverHelpers.js";
import {foodLogs, foods, meals} from "../config/mongoCollections.js";
import {ObjectId} from "mongodb";

export const getRangedFoodlogs = async (userId, startDate, endDate) => {
    try {
        userId = helpers.checkId(userId, "User ID");
        startDate = helpers.checkDateFormat(startDate, "Start Date");
        endDate = helpers.checkDateFormat(endDate, "End Date");
        const foodLogCollection = await foodLogs();
        
        let query = {user_id: new ObjectId(userId)};

        if (startDate && endDate) {
            // String comparison works because MM/DD/YYYY format is sortable
            query.date = {
                $gte: startDate,
                $lte: endDate
            };
        } else { //default to last 7 days
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 7);
            
            // Format dates as MM/DD/YYYY strings
            const endStr = `${String(end.getMonth() + 1).padStart(2, '0')}/${String(end.getDate()).padStart(2, '0')}/${end.getFullYear()}`;
            const startStr = `${String(start.getMonth() + 1).padStart(2, '0')}/${String(start.getDate()).padStart(2, '0')}/${start.getFullYear()}`;
            
            query.date = {
                $gte: startStr,
                $lte: endStr
            };
        }
        const foodLogList = await foodLogCollection.find(query).sort({date: -1}).toArray();
        return foodLogList;

    } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e); //TODO: refactor all error handling with throwing errors if given approval
        throw new Error(`Error getting ranged food logs: ${errorMsg}`);
    }
}

export const recalculateDailyTotals = async (logId) => {
    try {
        const foodLogCollection = await foodLogs();
        const foodLog = await foodLogCollection.findOne({_id: new ObjectId(logId)});
        if (!foodLog) {
            throw new Error(`No food log found with id of ${logId}`);
        }        
        const mealCollection = await meals();

        let daily_total_calories = 0;
        let daily_total_protein = 0;
        let daily_total_carbs = 0;
        let daily_total_fat = 0; 
        let daily_total_fiber = 0;

        for (const entry of foodLog.meals_logged) {
            if (entry.meal_id) {
                // Convert meal_id string to ObjectId before querying
                const meal = await mealCollection.findOne({ 
                    _id: new ObjectId(entry.meal_id) 
                });
                
                console.log('Found meal:', meal); // Debug log
                
                if (meal) {
                    daily_total_calories += meal.total_calories || 0;
                    daily_total_protein += meal.total_protein || 0;
                    daily_total_carbs += meal.total_carbs || 0;
                    daily_total_fat += meal.total_fat || 0;
                    daily_total_fiber += meal.total_fiber || 0;
                }
            }
        }
        
        console.log('Calculated totals:', { daily_total_calories, daily_total_protein }); // Debug
        
        //update the food log entry
        await foodLogCollection.updateOne(
            { _id: new ObjectId(logId) },
            { $set: {
                daily_total_calories,
                daily_total_protein,
                daily_total_carbs,
                daily_total_fat,
                daily_total_fiber
            }}
        );
    } catch (e) {
        throw new Error(`Error recalculating daily totals: ${e.message}`);
    }
}

export const addFoodLog = async (userId, date, meals_logged, notes) => {
    //first initialization of the specific food log of that day
    try {
        userId = helpers.checkId(userId, "User ID");
        date = helpers.checkDateFormat(date, "Date");

        const foodLogCollection = await foodLogs();
        
        // Check if food log already exists for this date - using string comparison
        const existing = await foodLogCollection.findOne({
            user_id: new ObjectId(userId),
            date: date  // Compare strings directly
        });
        
        if (existing) {
            throw new Error(`Food log for ${date} already exists.`);
        }
        
        const newFoodLog = {
            user_id: new ObjectId(userId),
            date: date,  // Store as string
            meals_logged: meals_logged,
            //rollback in case recalculation fails:
            daily_total_calories: null,  // ← null = "not yet calculated"
            daily_total_protein: null,
            daily_total_carbs: null,
            daily_total_fat: null,
            daily_total_fiber: null,            
            notes: notes || "",
            created_at: new Date()
        };

        const insertInfo = await foodLogCollection.insertOne(newFoodLog);

        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw new Error("Oh no! Food log could not be added :(");
        }

        await recalculateDailyTotals(insertInfo.insertedId);

        return true;
    } catch (e) {
        throw new Error (`Error initializing food log: ${e.message}`);
    }
}

export const updateFoodlog = async (userId, logId, updatedMealsLogged) => {
    try {
        userId = helpers.checkId(userId, "User ID");
        logId = helpers.checkId(logId, "Log ID");
        const foodLogCollection = await foodLogs();
        const foodLog = await foodLogCollection.findOne({ _id: new ObjectId(logId), user_id: new ObjectId(userId)});
        if (!foodLog) {
            throw new Error(`No food log found with id of ${logId} for user with id of ${userId}`);
        }
        const updatedFoodLog = {
            meals_logged: updatedMealsLogged,
        };
        if (updatedMealsLogged.length === 0) {
            return removeFoodlog(userId, logId);
        }

        await foodLogCollection.updateOne({"_id": new ObjectId(logId)}, {"$set": updatedFoodLog});

        await recalculateDailyTotals(logId);
        return true;
    } catch (e) {
        throw new Error (`Error updating food log: ${e.message}`);
    }
}

export const removeFoodlog = async (userId, logId) => {
    try {
        userId = helpers.checkId(userId, "User ID");
        logId = helpers.checkId(logId, "Log ID");
        const foodLogCollection = await foodLogs();
        const foodLog = await foodLogCollection.findOne({ _id: new ObjectId(logId), user_id: new ObjectId(userId)});
        if (!foodLog) {
            throw new Error(`No food log found with id of ${logId} for user with id of ${userId}`);
        }
        const deletionInfo = await foodLogCollection.deleteOne({"_id": new ObjectId(logId), user_id: new ObjectId(userId)});

        if (deletionInfo.deletedCount === 0) {
            throw new Error(`Could not delete food log with id of ${logId} for user with id of ${userId}`);
        } 
        return true;
    } catch (e) {
        throw new Error (`Error removing food log: ${e.message}`);
    }
}

export const getFoodlogById = async (userId, logId) => {
    try {
        userId = helpers.checkId(userId, "User ID");
        logId = helpers.checkId(logId, "Log ID");
        const foodLogCollection = await foodLogs();
        const foodLog = await foodLogCollection.findOne({ _id: new ObjectId(logId), user_id: new ObjectId(userId)});
        if (!foodLog) {
            throw new Error(`No food log found with id of ${logId} for user with id of ${userId}`);
        }
        return foodLog;
    } catch (e) {
        throw new Error (`Error getting food log: ${e.message}`);
    }
}
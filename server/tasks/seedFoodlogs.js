import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {addFoodLog} from '../data/foodLogCollection.js';
import { foodLogs } from '../config/mongoCollections.js';

export async function foodLogSeed() {
    console.log("Starting food logs seeding process...");
    const db = await dbConnection();
    const userCollection = db.collection('users');
    const mealCollection = db.collection('meals');
    const foodLogCollection = await foodLogs();
    
    try {
        // Clear existing food logs first
        await foodLogCollection.deleteMany({});
        console.log('Cleared existing food logs');
        
        console.log("Seeding food logs collection now!");

        // Get user IDs by email
        const userA = await userCollection.findOne({email: "alex.johnson@example.com"});
        const userB = await userCollection.findOne({email: "bianca.lopez@example.com"});
        const userC = await userCollection.findOne({email: "chris.nguyen@example.com"});
        
        // Get some meal IDs (fetch meals created by these users)
        const mealsA = await mealCollection.find({user_id: userA._id}).toArray();
        const mealsB = await mealCollection.find({user_id: userB._id}).toArray();
        const mealsC = await mealCollection.find({user_id: userC._id}).toArray();
        
        console.log("Creating food log for Alex!");
        const logA = await addFoodLog(
            userA._id.toString(),
            "12/15/2025",
            mealsA.map(meal => ({
                meal_id: meal._id.toString(),
                logged_at: new Date().toISOString()
            })),
            "Had a great breakfast!"
        );
        console.log("Created log for:", userA.first_name);

        console.log("Creating food log for Bianca!");
        const logB = await addFoodLog(
            userB._id.toString(),
            "12/15/2025",
            mealsB.map(meal => ({
                meal_id: meal._id.toString(),
                logged_at: new Date().toISOString()
            })),
            "Healthy lunch"
        );
        console.log("Created log for:", userB.first_name);
        console.log("Creating food log for Chris!");
        const logC = await addFoodLog(
            userC._id.toString(),
            "12/15/2025",
            mealsC.map(meal => ({
                meal_id: meal._id.toString(),
                logged_at: new Date().toISOString()
            })),
            "Delicious dinner!"
        );
        console.log("Created log for:", userC.first_name);


    } catch (e) {
        console.log(e);
    } finally {
        console.log("\nFinished seeding food logs collection!");
    }
}
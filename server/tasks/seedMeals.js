import { meals, foods } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { dbConnection, closeConnection } from '../config/mongoConnection.js';

// Hardcoded IDs for predictability
const USER_IDS = {
    ALEX: new ObjectId("693e185148537db1fa2c23e8"),
    BIANCA: new ObjectId("693e185148537db1fa2c23e9")
};

const seedMeals = async () => {
    try {
        const db = await dbConnection();
        const mealCollection = await meals();
        
        // Drop existing meals
        await mealCollection.deleteMany({});
        console.log('Cleared existing meals');

        
        const sampleMeals = [
            {
                _id: new ObjectId(),
                name: "Power Breakfast",
                user_id: USER_IDS.ALEX,
                foods: [
                    {
                        food_id: new ObjectId(), // Replace with real food ID
                        quantity: 2,
                        serving_unit: "eggs"
                    },
                    {
                        food_id: new ObjectId(), // Replace with real food ID
                        quantity: 2,
                        serving_unit: "slices"
                    }
                ],
                total_calories: 450,
                total_protein: 35,
                total_carbs: 40,
                total_fat: 15,
                total_fiber: 5,
                is_public: true,
                created_at: new Date()
            },
            {
                _id: new ObjectId(),
                name: "Protein Lunch",
                user_id: USER_IDS.ALEX,
                foods: [
                    {
                        food_id: new ObjectId(), // Replace with real food ID
                        quantity: 200,
                        serving_unit: "grams"
                    },
                    {
                        food_id: new ObjectId(), // Replace with real food ID
                        quantity: 150,
                        serving_unit: "grams"
                    }
                ],
                total_calories: 550,
                total_protein: 60,
                total_carbs: 45,
                total_fat: 12,
                total_fiber: 6,
                is_public: false,
                created_at: new Date()
            },
            {
                _id: new ObjectId(),
                name: "Quick Snack",
                user_id: USER_IDS.BIANCA,
                foods: [
                    {
                        food_id: new ObjectId(), // Replace with real food ID
                        quantity: 1,
                        serving_unit: "medium"
                    },
                    {
                        food_id: new ObjectId(), // Replace with real food ID
                        quantity: 30,
                        serving_unit: "grams"
                    }
                ],
                total_calories: 250,
                total_protein: 8,
                total_carbs: 35,
                total_fat: 10,
                total_fiber: 4,
                is_public: true,
                created_at: new Date()
            }
        ];
        
        const result = await mealCollection.insertMany(sampleMeals);
        console.log(`✓ Inserted ${result.insertedCount} meals`);
        
        // Display what was inserted
        console.log('\nSeeded meals:');
        sampleMeals.forEach(meal => {
            console.log(`- ${meal.name} (${meal.total_calories} cal) by user ${meal.user_id}`);
        });
        
    } catch (error) {
        console.error('Error seeding meals:', error);
    } finally {
        await closeConnection();
    }
};

seedMeals();
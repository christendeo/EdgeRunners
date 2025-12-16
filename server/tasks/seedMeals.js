import { meals, foods } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { dbConnection, closeConnection } from '../config/mongoConnection.js';

export const seedCustomFoods = async () => {
    const db = await dbConnection();
    const foodCollection = await foods();
    await foodCollection.deleteMany({});
    console.log('Cleared existing foods in MongoDB');
    const customFoods = [
            {
                _id: new ObjectId(),
                name: "Grass-Fed Beef Liver",
                serving_size: 100,
                serving_unit: "grams",
                calories: 135,
                protein: 20.4,
                carbs: 3.9,
                fat: 3.6,
                fiber: 0,
                added_by: null,
                is_public: true,
                created_at: new Date()
            },
            {
                _id: new ObjectId(),
                name: "Black Quinoa",
                serving_size: 100,
                serving_unit: "grams",
                calories: 120,
                protein: 4.4,
                carbs: 21.3,
                fat: 1.9,
                fiber: 2.8,
                added_by: null,
                is_public: true,
                created_at: new Date()
            },
            {
                _id: new ObjectId(),
                name: "Purple Cauliflower",
                serving_size: 100,
                serving_unit: "grams",
                calories: 25,
                protein: 1.9,
                carbs: 5,
                fat: 0.3,
                fiber: 2.1,
                added_by: null,
                is_public: true,
                created_at: new Date()
            },
            {
                _id: new ObjectId(),
                name: "Wild-Caught Mackerel",
                serving_size: 100,
                serving_unit: "grams",
                calories: 205,
                protein: 18.6,
                carbs: 0,
                fat: 13.9,
                fiber: 0,
                added_by: null,
                is_public: true,
                created_at: new Date()
            },
            {
                _id: new ObjectId(),
                name: "Japanese Sweet Potato",
                serving_size: 100,
                serving_unit: "grams",
                calories: 82,
                protein: 1.4,
                carbs: 19.1,
                fat: 0.2,
                fiber: 2.4,
                added_by: null,
                is_public: true,
                created_at: new Date()
            },
            {
                _id: new ObjectId(),
                name: "Sprouted Ezekiel Bread",
                serving_size: 1,
                serving_unit: "slice",
                calories: 80,
                protein: 4,
                carbs: 15,
                fat: 0.5,
                fiber: 3,
                added_by: null,
                is_public: true,
                created_at: new Date()
            },
            {
                _id: new ObjectId(),
                name: "Duck Eggs",
                serving_size: 1,
                serving_unit: "large",
                calories: 130,
                protein: 9,
                carbs: 1,
                fat: 9.6,
                fiber: 0,
                added_by: null,
                is_public: true,
                created_at: new Date()
            },
            {
                _id: new ObjectId(),
                name: "Icelandic Skyr",
                serving_size: 100,
                serving_unit: "grams",
                calories: 63,
                protein: 11,
                carbs: 4,
                fat: 0.2,
                fiber: 0,
                added_by: null,
                is_public: true,
                created_at: new Date()
            },
            {
                _id: new ObjectId(),
                name: "Marcona Almonds",
                serving_size: 30,
                serving_unit: "grams",
                calories: 170,
                protein: 6,
                carbs: 5,
                fat: 15,
                fiber: 3,
                added_by: null,
                is_public: true,
                created_at: new Date()
            },
            {
                _id: new ObjectId(),
                name: "Red Banana",
                serving_size: 1,
                serving_unit: "medium",
                calories: 90,
                protein: 1.1,
                carbs: 23,
                fat: 0.3,
                fiber: 2.6,
                added_by: null,
                is_public: true,
                created_at: new Date()
            },
            {
                _id: new ObjectId(),
                name: "Steel-Cut Oats",
                serving_size: 40,
                serving_unit: "grams",
                calories: 150,
                protein: 5,
                carbs: 27,
                fat: 2.5,
                fiber: 4,
                added_by: null,
                is_public: true,
                created_at: new Date()
            },
            {
                _id: new ObjectId(),
                name: "Grass-Fed Whey Isolate",
                serving_size: 1,
                serving_unit: "scoop",
                calories: 110,
                protein: 25,
                carbs: 1,
                fat: 0.5,
                fiber: 0,
                added_by: null,
                is_public: true,
                created_at: new Date()
            }
        ];
    const result = await foodCollection.insertMany(customFoods);
    console.log(`✓ Inserted ${result.insertedCount} custom foods`);
}
export const mealSeed = async () => {
    try {
        const db = await dbConnection();
        const mealCollection = await meals();
        const userCollection = db.collection('users');
        
        // Fetch user IDs dynamically
        const userA = await userCollection.findOne({email: "alex.johnson@example.com"});
        const userB = await userCollection.findOne({email: "bianca.lopez@example.com"});
        const userC = await userCollection.findOne({email: "chris.nguyen@example.com"});
        
        if (!userA || !userB || !userC) {
            throw new Error("Users not found. Please seed users first!");
        }
        
        // Drop existing meals
        await mealCollection.deleteMany({});
        console.log('Cleared existing meals');

        seedCustomFoods(); //ensure custom mongodb foods are seeded first
        
        const foodCollection = await foods();
        
        const someFoods = await foodCollection.find().limit(9).toArray();
        
        const sampleMeals = [
            {
                _id: new ObjectId(),
                name: "Power Breakfast",
                user_id: userA._id,
                foods: [
                    {
                        food_id: someFoods[0]?._id || new ObjectId(),
                        quantity: 2,
                        serving_unit: "eggs"
                    },
                    {
                        food_id: someFoods[1]?._id || new ObjectId(),
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
                user_id: userA._id,
                foods: [
                    {
                        food_id: someFoods[2]?._id || new ObjectId(),
                        quantity: 200,
                        serving_unit: "grams"
                    },
                    {
                        food_id: someFoods[3]?._id || new ObjectId(),
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
                user_id: userB._id,
                foods: [
                    {
                        food_id: someFoods[4]?._id || new ObjectId(),
                        quantity: 1,
                        serving_unit: "medium"
                    },
                    {
                        food_id: someFoods[5]?._id || new ObjectId(),
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
            },
            {
                _id: new ObjectId(),
                name: "Post-Workout Meal",
                user_id: userC._id,
                foods: [
                    {
                        food_id: someFoods[6]?._id || new ObjectId(),
                        quantity: 250,
                        serving_unit: "grams"
                    },
                    {
                        food_id: someFoods[7]?._id || new ObjectId(),
                        quantity: 1,
                        serving_unit: "scoop"
                    }
                ],
                total_calories: 600,
                total_protein: 55,
                total_carbs: 50,
                total_fat: 18,
                total_fiber: 7,
                is_public: true,
                created_at: new Date()
            },
            {
                _id: new ObjectId(),
                name: "Light Dinner",
                user_id: userC._id,
                foods: [
                    {
                        food_id: someFoods[8]?._id || new ObjectId(),
                        quantity: 150,
                        serving_unit: "grams"
                    }
                ],
                total_calories: 350,
                total_protein: 40,
                total_carbs: 20,
                total_fat: 15,
                total_fiber: 3,
                is_public: false,
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
        
        console.log('✓ Meals seeded successfully');
    } catch (error) {
        console.error('Error seeding meals:', error);
        throw error;
    }
};
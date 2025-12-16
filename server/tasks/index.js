import {seedBlogs} from './seedBlogs.js';
import {seedFoods} from './seedFoods.js';
import {userSeed} from './seedUsers.js';
import {mealSeed} from './seedMeals.js';
import {foodLogSeed} from './seedFoodlogs.js';
import {closeConnection} from '../config/mongoConnection.js';

async function runAllSeeds() {
    try {
        await seedFoods();
        await userSeed();
        await mealSeed();
        await foodLogSeed();
        await seedBlogs();
        console.log('\n✓ All seeds completed successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await closeConnection();
    }
}

runAllSeeds();
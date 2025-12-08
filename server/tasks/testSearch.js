import { searchFoods } from '../data/foodSearch.js';

const test = async () => {
  try {
    // Test 1: Get all foods (first page)
    console.log('--- All foods (page 1) ---');
    const all = await searchFoods({}, 1, 5);
    console.log(`Found ${all.total} total foods`);
    console.log(all.foods.map(f => f.name));

    // Test 2: Search by name
    console.log('\n--- Search for "egg" ---');
    const eggs = await searchFoods({ name: 'egg' });
    console.log(eggs.foods.map(f => f.name));

    // Test 3: High protein, low calorie
    console.log('\n--- High protein (>20g), low cal (<200) ---');
    const highProtein = await searchFoods({ minProtein: 20, maxCalories: 200 });
    console.log(highProtein.foods.map(f => `${f.name}: ${f.protein}g protein, ${f.calories} cal`));

  } catch (error) {
    console.error('Test failed:', error);
  }
};

test();
import { client } from '../config/elasticConnection.js'
import { readFileSync } from 'fs';

const createIndex = async () => {
    const indexExists = await client.indices.exists({ index: 'foods' });

    if (!indexExists) {
        await client.indices.create({
            index: 'foods',
            body: {
                mappings: {
                    properties: {
                        fdcId: { type: 'keyword' },
                        name: { type: 'text' },
                        calories: { type: 'float' },
                        protein: { type: 'float' },
                        carbs: { type: 'float' },
                        fat: { type: 'float' },
                        fiber: { type: 'float' }
                    }
                }
            }
        });
        console.log('Created foods index');
    } else {
        console.log('Foods index already exists')
    }
};

const transformFood = (usdaFood) => {
    const getNutrient = (name) => {
        const nutrient = usdaFood.foodNutrients.find(n => n.nutrient.name === name);
        return nutrient ? nutrient.amount : null;
    };
    return {
        fdcId: usdaFood.fdcId.toString(),
        name: usdaFood.description,
        calories: usdaFood.foodNutrients.find(
            n => n.nutrient.name === 'Energy' && n.nutrient.unitName === 'kcal'
        )?.amount || null,
        protein: getNutrient('Protein'),
        carbs: getNutrient('Carbohydrate, by difference'),
        fat: getNutrient('Total lipid (fat)'),
        fiber: getNutrient('Fiber, total dietary')
    };
};

const seedFoods = async () => {
    try {
        await createIndex();

        const rawData = readFileSync('./tasks/data/foundationFoods.json', 'utf-8');
        const foods = JSON.parse(rawData).FoundationFoods;

        console.log(`Transforming ${foods.length} foods...`);

        const transformed = foods.map(transformFood);

        const operations = transformed.flatMap(doc => [
            { index: {_index: 'foods', _id: doc.fdcId } },
            doc
        ]);

        const result = await client.bulk({ body: operations });
        console.log(`Indexed ${transformed.length} foods`);

        if (result.errors) {
            console.log('Some documents had errors');
        }
    } catch (error) {
        console.error('Seed failed:', error);
    } finally {
        await client.close();
    }
};

seedFoods();
import { client } from '../config/elasticConnection.js';

export const searchFoods = async (filters = {}, page = 1, limit = 20) => {
    const {
        name,
        minCalories, maxCalories,
        minProtein, maxProtein,
        minCarbs, maxCarbs,
        minFat, maxFat,
        minFiber, maxFiber
    } = filters;

    const must = [];

    if (name) {
        must.push({
            match: {
                name: {
                    query: name,
                    fuzziness: 'AUTO'
                }
            }
        });
    }

    if (minCalories !== undefined || maxCalories !== undefined) {
        must.push({
            range: {
                calories: {
                    ...(minCalories !== undefined && { gte: minCalories }),
                    ...(maxCalories !== undefined && { lte: maxCalories })
                }
            }
        });
    }

    if (minProtein !== undefined || maxProtein !== undefined) {
        must.push({
            range: {
                protein: {
                    ...(minProtein !== undefined && { gte: minProtein }),
                    ...(maxProtein !== undefined && { lte: maxProtein })
                }
            }
        });
    }

    if (minCarbs !== undefined || maxCarbs !== undefined) {
        must.push({
            range: {
                carbs: {
                    ...(minCarbs !== undefined && { gte: minCarbs }),
                    ...(maxCarbs !== undefined && { lte: maxCarbs })
                }
            }
        });
    }

    if (minFat !== undefined || maxFat !== undefined) {
        must.push({
            range: {
                fat: {
                    ...(minFat !== undefined && { gte: minFat }),
                    ...(maxFat !== undefined && { lte: maxFat })
                }
            }
        });
    }

    if (minFiber !== undefined || maxFiber !== undefined) {
        must.push({
            range: {
                fiber: {
                    ...(minFiber !== undefined && { gte: minFiber }),
                    ...(maxFiber !== undefined && { lte: maxFiber })
                }
            }
        });
    }

    const from = (page - 1) * limit;

    const query = must.length > 0
        ? { bool: { must } }
        : { match_all: {} };

    const result = await client.search({
        index: 'foods',
        body: {
            query,
            from,
            size: limit
        }
    });
    
    const foods = result.hits.hits.map(hit => ({
        _id: hit._id,
        ...hit._source
    }));

    const totalHits = typeof result.hits.total === 'number'
  ? result.hits.total
  : result.hits.total.value;

    return {
        foods,
        total: totalHits,
        page,
        limit,
        totalPages: Math.ceil(totalHits / limit)
    };
};
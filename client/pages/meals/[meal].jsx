import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { AuthContext } from '@/lib/userAuthContext';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MEAL_BY_ID, DELETE_MEAL } from '@/queries/mealQueries';
import { GET_FOOD_BY_ID } from '@/queries/foodQueries';
import EditMealModal from '@/components/meals/EditMealModal';
import localFont from 'next/font/local';

const NimbusFont = localFont({ 
  src: '../../public/NimbuDemo-Regular.otf',
  variable: '--font-nimbus' 
});

export default function MealDetailPage() {
    const router = useRouter();
    const userAuth = useContext(AuthContext);
    const [editingMeal, setEditingMeal] = useState(null);
	
    const { meal: mealId } = router.query;
    const { data: mealData, loading: mealLoading, refetch } = useQuery(GET_MEAL_BY_ID, {
        variables: { mealId },
        skip: !mealId
    });

    const [deleteMeal] = useMutation(DELETE_MEAL);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete this meal?`)) {
			return;
		}

		try {
			await deleteMeal({ variables: { mealId } });
			router.push('/meals');
		} catch (e) {
			alert('Failed to delete meal: ' + e.message);
		}
    };

    if (mealLoading) {
        return <p>Loading meal...</p>;
    }

    if (!mealData?.getMealById) {
        return <p>Meal not found</p>;
    }

    const meal = mealData.getMealById;
    const isOwner = userAuth.user?._id === meal.user_id;

    return (
        <div>
            <div className="mx-4 mt-8 max-w-4xl">
                <div className="mb-6">
                    <button onClick={() => router.back()} className="text-sm mb-4 hover:underline">
                        ← Back to Meals
                    </button>
                    
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className={`text-4xl mb-2 ${NimbusFont.className}`}>{meal.name}</h1>
                            {meal.is_public && (
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                    Public Meal
                                </span>
                            )}
                        </div>
                        
                        {isOwner && (
                            <div className="flex gap-2">
                                <button onClick={() => setEditingMeal(meal)} className="px-4 py-2 bg-gradient-to-b from-[#73AF6F] to-[#007E6E] text-white rounded-lg hover:opacity-90">
                                    Edit
                                </button>

                                <button onClick={handleDelete} className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:opacity-80">
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="mb-6" />

                <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Nutrition Summary</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold">{Math.round(meal.total_calories)}</div>
                            <div className="text-sm text-gray-600">Calories</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{Math.round(meal.total_protein)}g</div>
                            <div className="text-sm text-gray-600">Protein</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{Math.round(meal.total_carbs)}g</div>
                            <div className="text-sm text-gray-600">Carbs</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{Math.round(meal.total_fat)}g</div>
                            <div className="text-sm text-gray-600">Fat</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{Math.round(meal.total_fiber)}g</div>
                            <div className="text-sm text-gray-600">Fiber</div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4">Foods in This Meal</h2>
                    <div className="space-y-3">
                        {meal.foods.map((food, index) => (
                            <FoodItemDetail key={index} foodItem={food} />
                        ))}
                    </div>
                </div>
            </div>

            {editingMeal && (
                <EditMealModal
                    meal={editingMeal}
                    onClose={() => setEditingMeal(null)}
                    refetch={refetch}
                />
            )}
        </div>
    );
}

function FoodItemDetail({ foodItem }) {
    const { data, loading } = useQuery(GET_FOOD_BY_ID, {
        variables: { _id: foodItem.food_id }
    });

    if (loading) {
        return (
            <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600">Loading...</p>
            </div>
        );
    }

	console.log(data);

    if (!data?.getFoodById) {
        return (
            <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600">
                    {foodItem.quantity} {foodItem.serving_unit} (Food ID: {foodItem.food_id})
                </p>
            </div>
        );
    }

    const food = data.getFoodById;
    const multiplier = foodItem.quantity;

    return (
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-lg">{food.name}</h3>
                    <p className="text-sm text-gray-600">
                        {foodItem.quantity} {foodItem.serving_unit}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-xl font-bold">
                        {Math.round(food.calories * multiplier)}
                    </div>
                    <div className="text-xs text-gray-600">calories</div>
                </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                    <div className="font-semibold">{Math.round(food.protein * multiplier)}g</div>
                    <div className="text-gray-600">Protein</div>
                </div>
                <div>
                    <div className="font-semibold">{Math.round(food.carbs * multiplier)}g</div>
                    <div className="text-gray-600">Carbs</div>
                </div>
                <div>
                    <div className="font-semibold">{Math.round(food.fat * multiplier)}g</div>
                    <div className="text-gray-600">Fat</div>
                </div>
                <div>
                    <div className="font-semibold">{Math.round(food.fiber * multiplier)}g</div>
                    <div className="text-gray-600">Fiber</div>
                </div>
            </div>
        </div>
    );
}
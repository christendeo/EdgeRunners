import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { ADD_FOOD_LOG } from '../queries/foodLogQueries';

export default function AddMealToLogModal({ meals, onClose, refetch }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const [addFoodLog, { loading }] = useMutation(ADD_FOOD_LOG, {
        onCompleted: () => {
            refetch();
            onClose();
        },
        onError: (error) => {
            console.error('Error adding meal:', error);
        }
    });

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${month}/${day}/${year}`;
    };

    const onSubmit = (data) => {
        addFoodLog({
            variables: {
                input: {
                    date: formatDate(data.date), // Convert date format here
                    meals_logged: [{
                        meal_id: data.mealId,
                        logged_at: new Date().toISOString()
                    }],
                    notes: data.notes || ''
                }
            }
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto border">
                <h2 className="text-2xl font-bold mb-4">Add Meal to Log</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                            type="date"
                            {...register('date', { required: 'Date is required' })}
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                        {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Select Meal</label>
                        <select
                            {...register('mealId', { required: 'Please select a meal' })}
                            className="w-full px-3 py-2 border rounded-lg"
                        >
                            <option value="">-- Choose a meal --</option>
                            {meals?.map((meal) => (
                                <option key={meal._id} value={meal._id}>
                                    {meal.name} ({meal.total_calories} cal)
                                </option>
                            ))}
                        </select>
                        {errors.mealId && <p className="text-red-500 text-sm">{errors.mealId.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                        <textarea
                            {...register('notes')}
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Add any notes..."
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg hover:opacity-80"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-gradient-to-b from-[#73AF6F] to-[#007E6E] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Meal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
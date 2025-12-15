import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { UPDATE_FOOD_LOG } from '../queries/foodLogQueries';

export default function EditFoodLogModal({ log, meals, onClose, refetch }) {
    const { register, handleSubmit, control, formState: { errors }, setError } = useForm({
        defaultValues: {
            selectedMeals: log.meals_logged.map(meal => ({ mealId: meal.meal_id }))
        }
    });
    
    const { fields, append, remove } = useFieldArray({
        control,
        name: "selectedMeals"
    });
    
    const [updateFoodLog, { loading }] = useMutation(UPDATE_FOOD_LOG, {
        onCompleted: () => {
            refetch();
            onClose();
        },
        onError: (error) => {
            console.error('Error updating log:', error);
            setError('root', { 
                type: 'manual',
                message: error.message 
            });
        }
    });

    const onSubmit = (data) => {
        //filter out empty selections and map to meals_logged format
        const mealsLogged = data.selectedMeals
            .filter(item => item.mealId)
            .map(item => ({
                meal_id: item.mealId,
                logged_at: new Date().toISOString()
            }));

        if (mealsLogged.length === 0) {
            setError('selectedMeals', { 
                type: 'manual',
                message: 'Please select at least one meal'
            });
            return;
        }

        updateFoodLog({
            variables: {
                logId: log._id,
                updatedMealsLogged: mealsLogged
            }
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto border">
                <h2 className="text-2xl font-bold mb-4">Edit Log for {log.date}</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium">Select Meals</label>
                            <button
                                type="button"
                                onClick={() => append({ mealId: '' })}
                                className="text-sm px-2 py-1 rounded border hover:opacity-80"
                            >
                                + Add Another
                            </button>
                        </div>
                        
                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id}>
                                    <div className="flex gap-2">
                                        <select
                                            {...register(`selectedMeals.${index}.mealId`, {
                                                required: 'Please select a meal or remove this field'
                                            })}
                                            className="flex-1 px-3 py-2 border rounded-lg"
                                        >
                                            <option value="">-- Choose a meal --</option>
                                            {meals?.map((meal) => (
                                                <option key={meal._id} value={meal._id}>
                                                    {meal.name} ({meal.total_calories} cal)
                                                </option>
                                            ))}
                                        </select>
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="px-3 py-2 border rounded-lg hover:opacity-80 text-red-500"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    {errors.selectedMeals?.[index]?.mealId && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.selectedMeals[index].mealId.message}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.selectedMeals && typeof errors.selectedMeals.message === 'string' && (
                            <p className="text-red-500 text-sm mt-1">{errors.selectedMeals.message}</p>
                        )}
                    </div>

                    {errors.root && (
                        <p className="text-red-500 text-sm">{errors.root.message}</p>
                    )}

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
                            {loading ? 'Updating...' : 'Update Log'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
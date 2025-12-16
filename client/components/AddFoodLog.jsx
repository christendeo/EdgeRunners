import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { ADD_FOOD_LOG } from '../queries/foodLogQueries';

export default function AddMealToLogModal({ meals, onClose, refetch }) {
    const { register, handleSubmit, control, formState: { errors }, setError } = useForm({
        defaultValues: {
            selectedMeals: [{ mealId: '' }]
        }
    });
    
    const { fields, append, remove } = useFieldArray({
        control,
        name: "selectedMeals"
    });
    
    const [addFoodLog, { loading }] = useMutation(ADD_FOOD_LOG, {
        onCompleted: () => {
            refetch();
            onClose();
        },
        onError: (error) => {
            console.error('Error adding meal:', error);
            setError('root', { 
                type: 'manual',
                message: error.message 
            });
        }
    });

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${month}/${day}/${year}`;
    };

    const onSubmit = (data) => {
        // Filter out empty selections and map to meals_logged format
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

        addFoodLog({
            variables: {
                input: {
                    date: formatDate(data.date),
                    meals_logged: mealsLogged,
                    notes: data.notes || ''
                }
            }
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center ">
            <div className="p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto border bg-[var(--color-background)] text-[var(--color-foreground)]">
                <h2 className="text-2xl font-bold mb-4">Add Meals to Log</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="log-date" className="block text-sm font-medium mb-1">Date</label>
                        <input
                            id="log-date"
                            type="date"
                            {...register('date', { required: 'Date is required' })}
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border rounded-lg bg-[var(--color-background)] text-[var(--color-foreground)] [color-scheme:light] dark:[color-scheme:dark]"
                        />
                        {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                    </div>

                    <fieldset>
                        <legend className="flex items-center justify-between mb-1 w-full">
                            <span className="block text-sm font-medium">Select Meals</span>
                            <button
                                type="button"
                                onClick={() => append({ mealId: '' })}
                                className="text-sm px-2 py-1 rounded border hover:opacity-80"
                            >
                                + Add Another
                            </button>
                        </legend>
                        
                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <label htmlFor={`meal-select-${index}`} className="sr-only">
                                        Meal {index + 1}
                                    </label>
                                    <select
                                        id={`meal-select-${index}`}
                                        {...register(`selectedMeals.${index}.mealId`)}
                                        className="flex-1 px-3 py-2 border rounded-lg bg-[var(--color-background)] text-[var(--color-foreground)]"
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
                                            aria-label={`Remove meal ${index + 1}`}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.selectedMeals && (
                            <p className="text-red-500 text-sm mt-1">{errors.selectedMeals.message}</p>
                        )}
                    </fieldset>

                    <div>
                        <label htmlFor="log-notes" className="block text-sm font-medium mb-1">Notes (optional)</label>
                        <textarea
                            id="log-notes"
                            {...register('notes')}
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg bg-[var(--color-background)] text-[var(--color-foreground)]"
                            placeholder="Add any notes..."
                        />
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
                            {loading ? 'Adding...' : 'Add Meals'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
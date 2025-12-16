import { useForm, useFieldArray } from 'react-hook-form';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { SEARCH_FOODS } from '@/queries/foodQueries';
import { ADD_MEAL } from '@/queries/mealQueries';
import { useState } from 'react';

export default function AddMealModal({ userId, onClose, refetch }) {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchFoods, { data: foodsData, loading: foodsLoading }] = useLazyQuery(SEARCH_FOODS);

	const { register, handleSubmit, control, formState: { errors }, setError } = useForm({
		defaultValues: {
			name: '',
			is_public: false,
			foods: [{ food_id: '', quantity: 1, serving_unit: 'serving' }]
		}
	});

	const { fields, append, remove } = useFieldArray({ control, name: 'foods' });

	const [addMeal, { loading }] = useMutation(ADD_MEAL, {
		onCompleted: () => {
			refetch();
			onClose();
		},
		onError: (error) => {
			setError('root', {
				type: 'manual',
				message: error.message
			});
		}
	});

	const handleSearch = () => {
		if (searchTerm.trim()) {
			searchFoods({
				variables: {
					filters: { name: searchTerm },
					page: 1,
					limit: 20
				}
			});
		}
	};

	const onSubmit = (data) => {
		const validFoods = data.foods.filter(food => food.food_id);

		if (validFoods.length === 0) {
			setError('foods', {
				type: 'manual',
				message: 'Please select at least one food'
			});
			return;
		}

		addMeal({
			variables: {
				userId: userId,
				name: data.name,
				foods: validFoods.map(food => ({
					food_id: food.food_id,
					quantity: parseFloat(food.quantity),
					serving_unit: food.serving_unit
				})),
				is_public: data.is_public
			}
		});
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto border backdrop-blue-md bg-white/90 dark:bg-black/90">
				<h2 className="text-2xl font-bold mb-4">Create New Meal</h2>
				
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Meal Name</label>
						<input
							type="text"
							{...register('name', { required: 'Meal name is required' })}
							placeholder="e.g., Breakfast Bowl"
							className="w-full px-3 py-2 border rounded-lg"
						/>
						{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
					</div>

					<div className="flex items-center gap-2">
						<input type="checkbox" {...register('is_public')} id="is_public" />
						<label htmlFor="is_public" className="text-sm">Make this meal public</label>
					</div>

					<div className="border-t pt-4">
						<label className="block text-sm font-medium mb-1">Search Foods</label>
						<div className="flex gap-2 mb-3">
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
								placeholder="Search for foods..."
								className="flex-1 px-3 py-2 border rounded-lg"
							/>

							<button type="button" onClick={handleSearch} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:opacity-80">
								Search
							</button>
						</div>

						{foodsLoading && <p className="text-sm">Searching...</p>}
						
						{foodsData?.searchFoods?.foods && (
							<div className="max-h-40 overflow-y-auto border rounded-lg p-2 mb-3">
								{foodsData.searchFoods.foods.map((food) => (
									<div
										key={food._id}
										onClick={() => append({ food_id: food._id, quantity: 1, serving_unit: 'serving' })}
										className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded text-sm"
									>
										<div className="font-medium">{food.name}</div>
										<div className="text-xs text-gray-600">
											{Math.round(food.calories)} cal | {Math.round(food.protein)}g protein
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					<div>
						<div className="flex items-center justify-between mb-1">
							<label className="block text-sm font-medium">Foods in Meal</label>
							<button
								type="button"
								onClick={() => append({ food_id: '', quantity: 1, serving_unit: 'serving' })}
								className="text-sm px-2 py-1 rounded border hover:opacity-80"
							>
								+ Add Food Manually
							</button>
						</div>
						
						<div className="space-y-2">
							{fields.map((field, index) => (
								<div key={field.id} className="flex gap-2 items-start">
									<input
										{...register(`foods.${index}.food_id`)}
										placeholder="Food ID"
										className="flex-1 px-3 py-2 border rounded-lg text-sm"
									/>
									<input
										type="number"
										step="0.1"
										{...register(`foods.${index}.quantity`)}
										placeholder="Qty"
										className="w-20 px-3 py-2 border rounded-lg text-sm"
									/>
									<input
										{...register(`foods.${index}.serving_unit`)}
										placeholder="Unit"
										className="w-24 px-3 py-2 border rounded-lg text-sm"
									/>
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
							))}
						</div>
						
						{errors.foods && <p className="text-red-500 text-sm mt-1">{errors.foods.message}</p>}
					</div>

					{errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}

					<div className="flex gap-2 justify-end pt-4 border-t">
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
							{loading ? 'Creating...' : 'Create Meal'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
export default function MealCard({ meal, onEdit, onDelete, showActions=true }) {
    return (
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-1">
						{meal.is_public && (
							<span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Public</span>
						)}
						<h3 className="text-xl font-bold">{meal.name}</h3>
					</div>

					<div className="text-sm text-gray-500">
						{meal.foods?.length || 0} food item{meal.foods?.length !== 1 ? 's' : ''}
					</div>
				</div>

				<div className="text-right">
					<div className="text-xl font-bold">{Math.round(meal.total_calories)}</div>
					<div className="text-sm text-gray-500">calories</div>
				</div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                    <div className="font-semibold">{Math.round(meal.total_protein)}g</div>
                    <div className="text-gray-500">Protein</div>
                </div>
                <div>
                    <div className="font-semibold">{Math.round(meal.total_carbs)}g</div>
                    <div className="text-gray-500">Carbs</div>
                </div>
                <div>
                    <div className="font-semibold">{Math.round(meal.total_fat)}g</div>
                    <div className="text-gray-500">Fat</div>
                </div>
                <div>
                    <div className="font-semibold">{Math.round(meal.total_fiber)}g</div>
                    <div className="text-gray-500">Fiber</div>
                </div>
            </div>

            {showActions && (
                <div className="flex gap-2 mt-3">
                    <button
						onClick={() => onEdit(meal)}
						className="flex-1 px-2 py-1.5 bg-gradient-to-b from-[#73AF6F] to-[#007E6E] text-white rounded-lg hover:opacity-90 transition-all">
						Edit
					</button>
                    <button
						onClick={() => onDelete(meal)}
						className="flex-1 px-2 py-1.5 text-sm border border-red-500 text-red-500 rounded-lg hover:opacity-80 transition-all">
						Delete
					</button>
                </div>
            )}
        </div>
    );
}
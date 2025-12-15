export default function MealCard({ meal, onEdit, onDelete, showActions=true }) {
    return (
        <div>
            <div>
                <div>
                    <h3>{meal.name}</h3>
                    {meal.is_public && (
                        <span>Public</span>
                    )}
                </div>
                <p>{Math.round(meal.total_calories)} calories</p>
            </div>

            <div className="grid grid-cols-4">
                <div>
                    <div>{Math.round(meal.total_protein)}g</div>
                    <div>Protein</div>
                </div>
                <div>
                    <div>{Math.round(meal.total_carbs)}g</div>
                    <div>Carbs</div>
                </div>
                <div>
                    <div>{Math.round(meal.total_fat)}g</div>
                    <div>Fat</div>
                </div>
                <div>
                    <div>{Math.round(meal.total_fiber)}g</div>
                    <div>Fiber</div>
                </div>
            </div>

            <div>
                {meal.foods?.length || 0} food item{meal.foods?.length !== 1 ? 's' : ''}
            </div>

            {showActions && (
                <div className="flex gap-2">
                    <button onClick={() => onEdit(meal)}>Edit</button>
                    <button onClick={() => onDelete(meal)}>Delete</button>
                </div>
            )}
        </div>
    );
}
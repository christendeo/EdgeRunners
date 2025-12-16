export default function FoodCard({ food }) {
    return (
        <li className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-slate-50 p-6 shadow-lg border-4 border-teal-500">
            <strong className="text-lg font-mono text-black">{food.name}</strong>
            <div className="text-sm text-gray-600">
            Calories: {food.calories} |
            Protein: {food.protein}g |
            Carbs: {food.carbs}g |
            Fat: {food.fat}g |
            Fiber: {food.fiber}g
            </div>
        </li>
    );
}
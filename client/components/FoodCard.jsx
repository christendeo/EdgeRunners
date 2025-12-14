export default function FoodCard({ food }) {
    return (
        <li>
            <strong>{food.name}</strong> -
            Calories: {food.calories} |
            Protein: {food.protein}g |
            Carbs: {food.carbs}g |
            Fat: {food.fat}g |
            Fiber: {food.fiber}g
        </li>
    );
}
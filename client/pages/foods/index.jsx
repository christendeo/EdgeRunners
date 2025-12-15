import FoodSearch from '../../components/FoodSearch';
import CreateFood from '../../components/CreateFood.jsx';
import MyFoods from '../../components/MyFoods.jsx';

export default function FoodsPage() {
    return (
        <div>
            <h1>Food Search</h1>
            <FoodSearch />
            <CreateFood />
            <MyFoods />
            <p>Search and filter foods here, or add your own!</p>
        </div>
    );
}
import FoodSearch from '../../components/FoodSearch';
import CreateFood from '../../components/CreateFood.jsx';
import MyFoods from '../../components/MyFoods.jsx';

export default function FoodsPage() {
    return (
        <div>
            <p className="text-4xl font-style: italic">Search and filter foods here, or add your own!</p>
            <FoodSearch />
            <CreateFood />
            <MyFoods />
            
        </div>
    );
}
import FoodSearch from '../../components/FoodSearch';
import CreateFood from '../../components/CreateFood.jsx';
import MyFoods from '../../components/MyFoods.jsx';
import localFont from 'next/font/local';
const NimbusFont = localFont({ 
  src: '../../public/NimbuDemo-Regular.otf',
  variable: '--font-nimbus' 
});
export default function FoodsPage() {
    return (
        <div>
            <h1 className={`text-4xl font-style: mt-4 ${NimbusFont.className} text-center`}>Search and filter foods here, or add your own!</h1>
            <hr className="mb-4 mx-4" />
            <FoodSearch />
            <CreateFood />
            <MyFoods />
        </div>
    );
}
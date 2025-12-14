import {useState, useEffect} from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery, } from '@apollo/client/react';
import SearchInput from './SearchInput.jsx';
import FilterInputs from './FilterInputs.jsx'
import FoodCard from './FoodCard';





const SEARCH_FOODS = gql`
    query SearchFoods($filters: FoodSearchInput, $page: Int, $limit: Int) {
        searchFoods(filters: $filters, page: $page, limit: $limit) {
            foods {
                _id
            name
            serving_size
            serving_unit
            calories
            protein
            carbs
            fat 
            fiber 
            is_public 
            created_at
            }
            total
            page 
            limit 
            totalPages
        }
    }
`;





export default function FoodSearch() {

    const [page, setPage] = useState(1);
    const [name, setName] = useState('');
    const [filters, setFilters] = useState({
        minCalories: '',
        maxCalories: '',
        minProtein: '',
        maxProtein: '',
        minCarbs: '',
        maxCarbs: '',
        minFat: '',
        maxFat: '',
        minFiber: '',
        maxFiber: ''
    });

   

    
    const [searchFoods, { loading, error, data }] = useLazyQuery(SEARCH_FOODS);

    const buildVariables = (pageNum) => ({
    filters: {
        name: name || null,
        minCalories: filters.minCalories ? parseFloat(filters.minCalories) : null,
        maxCalories: filters.maxCalories ? parseFloat(filters.maxCalories) : null,
        minProtein: filters.minProtein ? parseFloat(filters.minProtein) : null,
        maxProtein: filters.maxProtein ? parseFloat(filters.maxProtein) : null,
        minCarbs: filters.minCarbs ? parseFloat(filters.minCarbs) : null,
        maxCarbs: filters.maxCarbs ? parseFloat(filters.maxCarbs) : null,
        minFat: filters.minFat ? parseFloat(filters.minFat) : null,
        maxFat: filters.maxFat ? parseFloat(filters.maxFat) : null,
        minFiber: filters.minFiber ? parseFloat(filters.minFiber) : null,
        maxFiber: filters.maxFiber ? parseFloat(filters.maxFiber) : null
    },
    page: pageNum,
    limit: 10
    });


    const handleSearch = () => {
        setPage(1);
        searchFoods({ variables: buildVariables(1) });
    };

    useEffect(() => {
        if (data) {
            searchFoods({ variables: buildVariables(page) });
        }
    }, [page]);

   

    return (
        <div>
            <h2>Food Search Component Under Construction</h2>
            <SearchInput value={name} onChange={setName} />
            <FilterInputs filters={filters} onFilterChange={setFilters} />
            
            <button onClick={handleSearch}>Search</button>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && (
                <div>
                    <p>Found {data.searchFoods.total} foods</p>
                    <ul>
                        {data.searchFoods.foods.map((food) => (
                            <FoodCard key={food._id} food={food} />
                        ))}
                    </ul>
                    <div>
                        <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        >
                            Previous
                        </button>

                        <span> Page {page} of {data.searchFoods.totalPages} </span>
                        <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= data.searchFoods.totalPages}
                        >
                            Next
                        </button>
                    </div>

                </div>    
            )}
            
            
            
        </div>

    );
}
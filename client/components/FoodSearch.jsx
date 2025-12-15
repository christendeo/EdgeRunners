import {useState, useEffect} from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';
import SearchInput from './SearchInput.jsx';
import FilterInputs from './FilterInputs.jsx'
import FoodCard from './FoodCard.jsx';





const SEARCH_FOODS = gql`
    query SearchFoods($filters: FoodSearchInput, $page: Int, $limit: Int) {
        searchFoods(filters: $filters, page: $page, limit: $limit) {
            foods {
                _id
            name
            calories
            protein
            carbs
            fat 
            fiber 
            
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

    const buildVariables = (pageNum) => {
    const builtFilters = {};
    
    if (name) builtFilters.name = name;
    if (filters.minCalories) builtFilters.minCalories = parseFloat(filters.minCalories);
    if (filters.maxCalories) builtFilters.maxCalories = parseFloat(filters.maxCalories);
    if (filters.minProtein) builtFilters.minProtein = parseFloat(filters.minProtein);
    if (filters.maxProtein) builtFilters.maxProtein = parseFloat(filters.maxProtein);
    if (filters.minCarbs) builtFilters.minCarbs = parseFloat(filters.minCarbs);
    if (filters.maxCarbs) builtFilters.maxCarbs = parseFloat(filters.maxCarbs);
    if (filters.minFat) builtFilters.minFat = parseFloat(filters.minFat);
    if (filters.maxFat) builtFilters.maxFat = parseFloat(filters.maxFat);
    if (filters.minFiber) builtFilters.minFiber = parseFloat(filters.minFiber);
    if (filters.maxFiber) builtFilters.maxFiber = parseFloat(filters.maxFiber);

    return {
        filters: builtFilters,
        page: pageNum,
        limit: 10
    };
};


    const handleSearch = () => {
        const vars = buildVariables(1);
    console.log('Sending variables:', vars);
    setPage(1);
    searchFoods({ variables: vars });
    };

    useEffect(() => {
        if (data) {
            searchFoods({ variables: buildVariables(page) });
        }
    }, [page]);

   console.log('Response data:', data);

    return (
        <div>
            <h2>Food Search</h2>
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
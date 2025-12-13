import {useState} from 'react';
import SearchInput from './SearchInput.jsx';
import FilterInputs from './FilterInputs.jsx'



export default function FoodSearch() {

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

    const [results, setResults] = useState(null);

    return (
        <div>
            <h2>Food Search Component Under Construction</h2>
            <SearchInput value={name} onChange={setName} />
            <FilterInputs filters={filters} onFilterChange={setFilters} />
            <p>Name state: {name}</p>

            
        </div>

    )
}
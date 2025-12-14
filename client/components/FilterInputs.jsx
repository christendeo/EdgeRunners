export default function FilterInputs ({ filters, onFilterChange }) {

    const handleChange = (e) => {
        onFilterChange({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            Minimum Calories:{' '}  
            <input
                type="number"
                name="minCalories"
                placeholder="Min Calories"
                value={filters.minCalories}
                onChange={handleChange}
            />
            Maximum Calories:{' '}
            <input
                type="number"
                name="maxCalories"
                placeholder="Max Calories"
                value={filters.maxCalories}
                onChange={handleChange}
            />
            Minimum Protein:{' '}  
            <input
                type="number"
                name="minProtein"
                placeholder="Min Protein (g)"
                value={filters.minProtein}
                onChange={handleChange}
            />
            Maximum Protein:{' '}
            <input
                type="number"
                name="maxProtein"
                placeholder="Max Protein (g)"
                value={filters.maxProtein}
                onChange={handleChange}
            />
            Minimum Carbs:{' '}
            <input
                type="number"
                name="minCarbs"
                placeholder="Min Carbs (g)"
                value={filters.minCarbs}
                onChange={handleChange}
            />
            Maximum Carbs:{' '}
            <input
                type="number"
                name="maxCarbs"
                placeholder="Max Carbs (g)"
                value={filters.maxCarbs}
                onChange={handleChange}
            />
            <input
                type="number"
                name="minFat"
                placeholder="Min Fat (g)"
                value={filters.minFat}
                onChange={handleChange}
            />
            Maximum Fat:{' '}
            <input
                type="number"
                name="maxFat"
                placeholder="Max Fat (g)"
                value={filters.maxFat}
                onChange={handleChange}
            />
            <input
                type="number"
                name="minFiber"
                placeholder="Min Fiber (g)"
                value={filters.minFiber}
                onChange={handleChange}
            />
            Maximum Fiber:{' '}
            <input
                type="number"
                name="maxFiber"
                placeholder="Max Fiber (g)"
                value={filters.maxFiber}
                onChange={handleChange}
            />
        </div>
    )
}
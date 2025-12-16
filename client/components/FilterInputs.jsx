export default function FilterInputs ({ filters, onFilterChange }) {

    const handleChange = (e) => {
        onFilterChange({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const inputStyle = "w-48 p-2 border-2 border-gray-300 rounded focus:border-teal-500 focus:outline-none";
    const labelStyle = "text-xl font-bold";
    const rowStyle = "flex gap-x-4 items-center my-2";

    return (
        <div className="my-4">
            <div className={rowStyle}>
                <label className={labelStyle}>Calories:</label>
              
            <input
                type="number"
                name="minCalories"
                placeholder="Min Calories"
                value={filters.minCalories}
                onChange={handleChange}
                className={inputStyle}
            />
            
            <input
                type="number"
                name="maxCalories"
                placeholder="Max Calories"
                value={filters.maxCalories}
                onChange={handleChange}
                className={inputStyle}
            />
            </div>
            <div className={rowStyle}>
                <label className={labelStyle}>Protein:</label>
            <input
                type="number"
                name="minProtein"
                placeholder="Min Protein (g)"
                value={filters.minProtein}
                onChange={handleChange}
                className={inputStyle}
            />
            
            <input
                type="number"
                name="maxProtein"
                placeholder="Max Protein (g)"
                value={filters.maxProtein}
                onChange={handleChange}
                className={inputStyle}
            />
            </div>
            <div className={rowStyle}>
                <label className={labelStyle}>Carbs:</label>
            <input
                type="number"
                name="minCarbs"
                placeholder="Min Carbs (g)"
                value={filters.minCarbs}
                onChange={handleChange}
                className={inputStyle}
            />
            
            <input
                type="number"
                name="maxCarbs"
                placeholder="Max Carbs (g)"
                value={filters.maxCarbs}
                onChange={handleChange}
                className={inputStyle}
            />
            </div>
            <div className={rowStyle}>
                <label className={labelStyle}>Fat:</label>
            <input
                type="number"
                name="minFat"
                placeholder="Min Fat (g)"
                value={filters.minFat}
                onChange={handleChange}
                className={inputStyle}
            />
            
            <input
                type="number"
                name="maxFat"
                placeholder="Max Fat (g)"
                value={filters.maxFat}
                onChange={handleChange}
                className={inputStyle}
            />
            <div className={rowStyle}>
                <label className={labelStyle}>Fiber:</label>
            <input
                type="number"
                name="minFiber"
                placeholder="Min Fiber (g)"
                value={filters.minFiber}
                onChange={handleChange}
                className={inputStyle}
            />
            </div>
            
            <input
                type="number"
                name="maxFiber"
                placeholder="Max Fiber (g)"
                value={filters.maxFiber}
                onChange={handleChange}
                className={inputStyle}
            />
            </div>
        
        </div>
    )
}
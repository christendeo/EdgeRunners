export default function SearchInput({ value, onChange }) {
    return (
        <input
            type="text"
            placeholder="Search by name..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border-2 border-gray-300 rounded focus:border-teal-500 focus:outline-none"
        />
    
    )
}
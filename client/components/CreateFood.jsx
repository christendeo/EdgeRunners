import { useState, useContext } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { AuthContext } from '../lib/userAuthContext';

const ADD_FOOD = gql`
    mutation AddFood(
        $name: String!,
        $serving_size: Float!,
        $serving_unit: String!,
        $calories: Float!,
        $protein: Float!,
        $carbs: Float!,
        $fat: Float!,
        $fiber: Float!,
        $added_by: String!,
        $is_public: Boolean!
    
    ) {
        addFood(
        name: $name,
        serving_size: $serving_size,
        serving_unit: $serving_unit,
        calories: $calories,
        protein: $protein,
        carbs: $carbs,
        fat: $fat,
        fiber: $fiber,
        added_by: $added_by,
        is_public: $is_public
    ) {
        _id
        name 
        
      }
    }

`;

export default function CreateFood() {
    const userAuth = useContext(AuthContext);
    const currentUser = userAuth.user;

    const [formData, setFormData] = useState({
        name: '',
        serving_size: '',
        serving_unit: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: '',
        is_public: false
    });

    const [addFood, { loading, error, data }] = useMutation(ADD_FOOD);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

         console.log('Current user:', currentUser);
    console.log('User ID:', currentUser._id);

        addFood({
            variables: {
                name: formData.name,
                serving_size: parseFloat(formData.serving_size),
                serving_unit: formData.serving_unit,
                calories: parseFloat(formData.calories),
                protein: parseFloat(formData.protein),
                carbs: parseFloat(formData.carbs),
                fat: parseFloat(formData.fat),
                fiber: parseFloat(formData.fiber),
                added_by: currentUser._id,
                is_public: formData.is_public
                

            }
        });
    };

    if (!currentUser) {
        return <p>Please log in to create foods.</p>
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-sans mb-4">Create a Custom Food</h2>
            {error && <p className="text-red-500">Error: {error.message}</p>}
            {data && <p className="text-green-500">Food created: {data.addFood.name}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
                <div className="flex items-center gap-x-2">
                    <label className="w-32 text-sm font-medium">Name:{' '}</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="flex-1 p-2 border-2 border-gray-300 rounded focus:border-teal-500 focus:outline-none"
                    />    
                </div>

                <div className="flex items-center gap-x-2">
                    <label className="w-32 text-sm font-medium">Serving Size:{' '}</label>
                    <input
                        type="number"
                        name="serving_size"
                        value={formData.serving_size}
                        onChange={handleChange}
                        required
                        className="w-24 p-2 border-2 border-gray-300 rounded focus:border-teal-500 focus:outline-none"
                    />    
                </div>

                <div className="flex items-center gap-x-2">
                    <label className="w-32 text-sm font-medium">Serving Unit:{' '}</label>
                    <input
                        type="text"
                        name="serving_unit"
                        value={formData.serving_unit}
                        onChange={handleChange}
                        required
                        className="w-24 p-2 border-2 border-gray-300 rounded focus:border-teal-500 focus:outline-none"
                    />    
                </div>

                <div className="flex items-center gap-x-2">
                    <label className="w-32 text-sm font-medium">Calories:{' '}</label>
                    <input
                        type="number"
                        name="calories"
                        value={formData.calories}
                        onChange={handleChange}
                        required
                        className="w-24 p-2 border-2 border-gray-300 rounded focus:border-teal-500 focus:outline-none"
                    />    
                </div>

                <div className="flex items-center gap-x-2">
                    <label className="w-32 text-sm font-medium">Protein (g):{' '}</label>
                    <input
                        type="number"
                        name="protein"
                        value={formData.protein}
                        onChange={handleChange}
                        required
                        className="w-24 p-2 border-2 border-gray-300 rounded focus:border-teal-500 focus:outline-none"
                    />    
                </div>

                <div className="flex items-center gap-x-2">
                    <label className="w-32 text-sm font-medium">Carbs (g):{' '}</label>
                    <input
                        type="number"
                        name="carbs"
                        value={formData.carbs}
                        onChange={handleChange}
                        required
                        className="w-24 p-2 border-2 border-gray-300 rounded focus:border-teal-500 focus:outline-none"
                    />    
                </div>

                <div className="flex items-center gap-x-2">
                    <label className="w-32 text-sm font-medium">Fat (g):{' '}</label>
                    <input
                        type="number"
                        name="fat"
                        value={formData.fat}
                        onChange={handleChange}
                        required
                        className="w-24 p-2 border-2 border-gray-300 rounded focus:border-teal-500 focus:outline-none"
                    />    
                </div>

                <div className="flex items-center gap-x-2">
                    <label className="w-32 text-sm font-medium">Fiber(g):{' '}</label>
                    <input
                        type="number"
                        name="fiber"
                        value={formData.fiber}
                        onChange={handleChange}
                        required
                        className="w-24 p-2 border-2 border-gray-300 rounded focus:border-teal-500 focus:outline-none"
                    />    
                </div>

                <div className="flex items-center gap-x-2">
                    <label className="text-sm font-medium">
                    <input
                        type="checkbox"
                        name="is_public"
                        checked={formData.is_public}
                        onChange={handleChange}
                        className="mr-2"
                        
                    />    
                    {' '}Make this food public
                    </label>
                </div>

                <button type="submit" disabled={loading}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 disabled:bg-gray-300 disabled:opacity-50 w-fit">
                    {loading ? 'Creating...' : 'Create Food'}
                </button>
            </form>
        </div>
    )
}
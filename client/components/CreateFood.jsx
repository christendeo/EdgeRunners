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
        <div>
            <h2>Create a Custom Food</h2>
            {error && <p>Error: {error.message}</p>}
            {data && <p>Food created: {data.addFood.name}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:{' '}</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />    
                </div>

                <div>
                    <label>Serving Size:{' '}</label>
                    <input
                        type="number"
                        name="serving_size"
                        value={formData.serving_size}
                        onChange={handleChange}
                        required
                    />    
                </div>

                <div>
                    <label>Serving Unit:{' '}</label>
                    <input
                        type="text"
                        name="serving_unit"
                        value={formData.serving_unit}
                        onChange={handleChange}
                        required
                    />    
                </div>

                <div>
                    <label>Calories:{' '}</label>
                    <input
                        type="number"
                        name="calories"
                        value={formData.calories}
                        onChange={handleChange}
                        required
                    />    
                </div>

                <div>
                    <label>Protein (g):{' '}</label>
                    <input
                        type="number"
                        name="protein"
                        value={formData.protein}
                        onChange={handleChange}
                        required
                    />    
                </div>

                <div>
                    <label>Carbs (g):{' '}</label>
                    <input
                        type="number"
                        name="carbs"
                        value={formData.carbs}
                        onChange={handleChange}
                        required
                    />    
                </div>

                <div>
                    <label>Fat (g):{' '}</label>
                    <input
                        type="number"
                        name="fat"
                        value={formData.fat}
                        onChange={handleChange}
                        required
                    />    
                </div>

                <div>
                    <label>Fiber(g):{' '}</label>
                    <input
                        type="number"
                        name="fiber"
                        value={formData.fiber}
                        onChange={handleChange}
                        required
                    />    
                </div>

                <div>
                    <label>
                    <input
                        type="checkbox"
                        name="is_public"
                        checked={formData.is_public}
                        onChange={handleChange}
                        
                    />    
                    {' '}Make this food public
                    </label>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Food'}
                </button>
            </form>
        </div>
    )
}
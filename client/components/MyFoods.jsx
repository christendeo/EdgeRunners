import { useState, useContext, } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { AuthContext } from '../lib/userAuthContext';
import FoodCard from './FoodCard.jsx';

const GET_FOODS_BY_USER = gql`
    query GetFoodsByUser($_id: String!) {
        getFoodsByUser(_id: $_id) {
            _id
            name
            calories
            protein
            carbs
            fat 
            fiber 
            
            
        }
    }
`;

export default function MyFoods() {
    const userAuth = useContext(AuthContext);
    const currentUser = userAuth.user;

    const [getFoodsByUser, { loading, error, data }] = useLazyQuery(GET_FOODS_BY_USER);

    const handleShowMyFoods = () => {
        console.log('User ID:', currentUser._id);
        getFoodsByUser({
            variables: {
                _id: currentUser._id
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-4">

            <button onClick={handleShowMyFoods} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 disabled:bg-gray-300 disabled:opacity-50 w-fit">My Foods</button>

            {loading && <p>Loading...</p>}
                        {error && <p>Error: {error.message}</p>}
                        {data && (
                            <div>
                                {console.log('Data received:', data)}
                                <p className="text-2xl font-sans mb-4">My Saved Foods</p>
                                <ul className="flex flex-col gap-y-4">
                                    {data.getFoodsByUser.map((food) => (
                                        <FoodCard key={food._id} food={food} />
                                    ))}
                                </ul>
                                </div>
                        )}

                                
        </div>
                                
    )

}
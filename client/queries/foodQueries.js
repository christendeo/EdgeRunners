import { gql } from '@apollo/client';

const GET_FOODS = gql`
    query GetAllFoods {
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
            added_by 
            is_public 
            created_at

        }
    }


`;
export const GET_FOOD_BY_ID = gql`
    query GetFoodById($_id: String!) {
        getFoodById(_id: $_id) {
            _id
            name
            serving_size
            serving_unit
            calories
            protein
            carbs
            fat 
            fiber 
            added_by 
            is_public 
            created_at

        }
    }
`;

export const SEARCH_FOODS = gql`
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
				added_by
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

export const GET_FOODS_BY_USER = gql`
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
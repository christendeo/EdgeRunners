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
    query GetFoodById($id: String!) {
        GetFoodById(_id: $id) {
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
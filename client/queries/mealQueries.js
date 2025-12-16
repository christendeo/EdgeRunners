import { gql } from '@apollo/client';

export const GET_ALL_PUBLIC_MEALS = gql`
	query GetAllPublicMeals {
		getAllPublicMeals {
			_id
			name
			user_id
			total_calories
			total_protein
			total_carbs
			total_fat
			total_fiber
			foods {
				food_id
				quantity
				serving_unit
			}
			is_public
			created_at
		}
	}
`;

export const GET_MEAL_BY_ID = gql`
	query GetMealById($mealId: ID!) {
		getMealById(mealId: $mealId) {
			_id
			name
			user_id
			total_calories
			total_protein
			total_carbs
			total_fat
			total_fiber
			foods {
				food_id
				quantity
				serving_unit
			}
			is_public
			created_at
		}
	}
`;

export const GET_MEALS_BY_USER = gql`
	query getMealsByUser($userId: ID!) {
		getMealsByUser(userId: $userId) {
			_id
			name
			total_calories
			total_protein
			total_carbs
			total_fat
			total_fiber
			foods {
				food_id
				quantity
				serving_unit
			}
			is_public
			created_at
		}
	}
`;

export const ADD_MEAL = gql`
  mutation AddMeal(
    $userId: ID!
    $name: String!
    $foods: [MealFoodInput!]!
    $is_public: Boolean
  ) {
    addMeal(
      userId: $userId
      name: $name
      foods: $foods
      is_public: $is_public
    ) {
      _id
      name
      total_calories
      total_protein
      total_carbs
      total_fat
      total_fiber
      foods {
        food_id
        quantity
        serving_unit
      }
      is_public
      created_at
    }
  }
`;

export const UPDATE_MEAL = gql`
  mutation UpdateMeal(
    $mealId: ID!
    $name: String
    $foods: [MealFoodInput!]
    $is_public: Boolean
  ) {
    updateMeal(
      mealId: $mealId
      name: $name
      foods: $foods
      is_public: $is_public
    ) {
      _id
      name
      total_calories
      total_protein
      total_carbs
      total_fat
      total_fiber
      foods {
        food_id
        quantity
        serving_unit
      }
      is_public
      created_at
    }
  }
`;

export const DELETE_MEAL = gql`
  mutation DeleteMeal($mealId: ID!) {
    deleteMeal(mealId: $mealId) {
      _id
      name
    }
  }
`;
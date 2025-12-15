//TODO: add all other meal queries and mutations as needed
import { gql } from '@apollo/client';

export const GET_MEALS_BY_USER = gql`
  query getMealsByUser {
    getMealsByUser {
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
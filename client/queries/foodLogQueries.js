import { gql } from '@apollo/client';

export const GET_RANGED_FOOD_LOGS = gql`
    query GetRangedFoodLogs($_id: String!, $startDate: String!, $endDate: String!) {
        getRangedFoodLogs(_id: $_id, startDate: $startDate, endDate: $endDate) {
            _id
            date
            daily_total_calories
            daily_total_protein
            daily_total_carbs
            daily_total_fat
            daily_total_fiber
            meals_logged {
                meal_id
                logged_at
            }
            notes
        }
    }
`;

export const GET_TODAY_FOOD_LOG = gql`
    query GetTodayFoodLog($_id: String!) {
        getTodayFoodLog(_id: $_id) {
            _id
            date
            daily_total_calories
            daily_total_protein
            daily_total_carbs
            daily_total_fat
            meals_logged {
                meal_id
                logged_at
            }
            notes
        }
    }
`;

export const ADD_FOOD_LOG = gql`
    mutation AddFoodLog($_id: String, $input: AddFoodLogInput!) {
        addFoodLog(_id: $_id, input: $input)
    }
`;

export const UPDATE_FOOD_LOG = gql`
    mutation UpdateFoodLog($_id: String, $logId: ID!, $updatedMealsLogged: [MealLoggedInput!]!, $notes: String) {
        updateFoodLog(_id: $_id, logId: $logId, updatedMealsLogged: $updatedMealsLogged, notes: $notes)
    }
`;

export const REMOVE_FOOD_LOG = gql`
    mutation RemoveFoodLog($_id: String, $logId: ID!) {
        removeFoodLog(_id: $_id, logId: $logId)
    }
`;
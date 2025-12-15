import { gql } from '@apollo/client';

export const GET_RANGED_FOOD_LOGS = gql`
    query GetRangedFoodLogs($startDate: String!, $endDate: String!) {
        getRangedFoodLogs(startDate: $startDate, endDate: $endDate) {
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
    query GetTodayFoodLog {
        getTodayFoodLog {
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
    mutation AddFoodLog($input: AddFoodLogInput!) {
        addFoodLog(input: $input)
    }
`;

export const UPDATE_FOOD_LOG = gql`
    mutation UpdateFoodLog($logId: ID!, $updatedMealsLogged: [MealLoggedInput!]!) {
        updateFoodLog(logId: $logId, updatedMealsLogged: $updatedMealsLogged)
    }
`;

export const REMOVE_FOOD_LOG = gql`
    mutation RemoveFoodLog($logId: ID!) {
        removeFoodLog(logId: $logId)
    }
`;
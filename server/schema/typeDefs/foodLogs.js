export const foodLogTypeDefs = `#graphql
    type FoodLog {
        _id: ID!
        user_id: ID!
        date: String!
        meals_logged: [MealLogged!]!
        daily_total_calories: Float
        daily_total_protein: Float
        daily_total_carbs: Float
        daily_total_fat: Float
        daily_total_fiber: Float
        notes: String
        created_at: String!
    }
    
    type MealLogged {
        meal_id: ID!
        foods: [FoodItem]
        logged_at: String!
    }
    
    type FoodItem {
        food_id: ID!
        quantity: Float!
        serving_unit: String!
    }
    
    type Query {
        #get food logs in date range
        getRangedFoodLogs(_id: String, startDate: String!, endDate: String!): [FoodLog!]!
        
        #get specific food log by ID
        getFoodLogById(_id: String, logId: ID!): FoodLog
        
        #get today's food log
        getTodayFoodLog(_id: String): FoodLog
    }
    
    type Mutation {
        #create new food log
        addFoodLog(_id: String, input: AddFoodLogInput!): Boolean!
        
        #update existing food log
        updateFoodLog(_id: String, logId: ID!, updatedMealsLogged: [MealLoggedInput!]!, notes: String): String!
        
        #remove food log
        removeFoodLog(_id: String, logId: ID!): Boolean!
    }
    
    input AddFoodLogInput {
        date: String!
        meals_logged: [MealLoggedInput!]!
        notes: String
    }
    
    input MealLoggedInput {
        meal_id: ID!
        foods: [FoodItemInput]
        logged_at: String
    }
    
    input FoodItemInput {
        food_id: ID!
        quantity: Float!
        serving_unit: String!
    }
`;

export default foodLogTypeDefs;
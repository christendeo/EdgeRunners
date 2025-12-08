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
        getRangedFoodLogs(startDate: String!, endDate: String!): [FoodLog!]!
        
        #get specific food log by ID
        getFoodLogById(logId: ID!): FoodLog
        
        #get today's food log
        getTodayFoodLog: FoodLog
    }
    
    type Mutation {
        #create new food log
        addFoodLog(input: AddFoodLogInput!): Boolean!
        
        #update existing food log
        updateFoodLog(logId: ID!, updatedMealsLogged: [MealLoggedInput!]!): Boolean!
        
        #remove food log
        removeFoodLog(logId: ID!): Boolean!
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
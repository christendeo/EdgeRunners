export const mealTypeDefs = `#graphql
    type Meal {
        _id: ID!
        name: String!
        user_id: ID!
        foods: [MealFood!]!
        total_calories: Float!
        total_protein: Float!
        total_carbs: Float!
        total_fat: Float!
        total_fiber: Float!
        is_public: Boolean!
        created_at: String!
    }
    
    type MealFood {
        food_id: ID!
        quantity: Float!
        serving_unit: String!
    }
    
    type Query {
        #get all public meals
        getAllPublicMeals: [Meal!]!
        
        #get meal by ID
        getMealById(_id: ID!): Meal
        
        #get current user's meals
        getUserMeals: [Meal!]!
    }
`;

export default mealTypeDefs;
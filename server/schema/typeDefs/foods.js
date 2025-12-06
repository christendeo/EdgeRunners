//GraphQL type definitions
//Define our collections: (User, Food, Foodlog, Query, Mutation...)
export const foodTypeDefs = `#graphql

    type Food {
        _id: String!
        name: String!
        serving_size: Float
        serving_unit: String
        calories: Float
        protein: Float
        carbs: Float
        fat: Float
        fiber: Float
        added_by: User
        is_public: Boolean
        created_at: String
    } 

    extend type Query {
        foods: [Food]
        getFoodById(_id: String!): Food
    }

    extend type Mutation {
        addFood(
            name: String!,
            serving_size: Float!,
            serving_unit: String!, 
            calories: Float!, 
            protein: Float!, 
            carbs: Float!, 
            fat: Float!, 
            fiber: Float!, 
            added_by: String!, 
            is_public: Boolean!
            ): Food

        updateFood(
            _id: String!, 
            name: String, 
            serving_size: Float, 
            serving_unit: String, 
            alories: Float, 
            protein: Float, 
            carbs: Float, 
            fat: Float, 
            fiber: Float, 
            is_public: Boolean
            ): Food  

        removeFood(
            _id: String!
        ): Food      
    
    }

    

`;
export default foodTypeDefs;
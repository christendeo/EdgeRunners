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

    

`;
export default foodTypeDefs;
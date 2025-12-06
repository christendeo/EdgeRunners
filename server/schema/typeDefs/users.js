// To add more queries and mutations later
// server/schema/typeDefs/users.js

const userTypeDefs = `#graphql
    type User {
        _id: String,
        first_name: String,
        last_name: String,
        email: String,
        date_of_birth: String,
        height: Float,
        weight: Float,
        activity_level: String,
        diet_goal: String,
        target_calories: Int,
        createdAt: String,
        updatedAt: String
    }
    
    extend type Query {
        users: [User]
        getUserById(_id: String!): User
    }
    
    extend type Mutation {
        addUser(
            first_name: String!,
            last_name: String!,
            email: String!,
            date_of_birth: String!,
            height: Float!,
            weight: Float!,
            activity_level: String!,
            diet_goal: String!,
            target_calories: Int!
        ): User
    
        editUser(
            _id: String!,
            first_name: String,
            last_name: String,
            email: String,
            date_of_birth: String,
            height: Float,
            weight: Float,
            activity_level: String,
            diet_goal: String,
            target_calories: Int
        ): User
    }
`;

export default userTypeDefs;
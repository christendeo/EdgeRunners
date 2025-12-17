// User queries and mutations
const userTypeDefs = `#graphql
type User {
    _id: String,
    first_name: String,
    last_name: String,
    email: String,
    sex: String,
    date_of_birth: String,
    height: Float,
    weight: Float,
    activity_level: String,
    diet_goal: String,
    target_calories: Int,
    createdAt: String,
    updatedAt: String,
    use_custom_target: Boolean,
    custom_target_calories: Float,
    current_target_calories: Float,
	token: String
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
        password: String!,
        sex: String!,
        date_of_birth: String!,
        height: Float!,
        weight: Float!,
        activity_level: String!,
        diet_goal: String!,
        use_custom_target: Boolean,
        custom_target_calories: Float
    ): User

    editUser(
        _id: String!,
        first_name: String,
        last_name: String,
        email: String,
        password: String,
        sex: String,
        date_of_birth: String,
        height: Float,
        weight: Float,
        activity_level: String,
        diet_goal: String
        use_custom_target: Boolean,
        custom_target_calories: Float
    ): User

    loginUser(
        email: String!,
        password: String!
    ): User

    changePassword(
        _id: String!,
        oldPassword: String!,
        newPassword: String!
    ): User
}
`;

export default userTypeDefs;
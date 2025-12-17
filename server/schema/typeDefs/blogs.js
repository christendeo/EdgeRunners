export const blogTypeDefs = `#graphql
    type Query {
        blogs: [Blog]
        getBlogById(_id: String!): Blog
        getBlogsByUser(user_id: String!): [Blog]
    }
    type Blog {
        _id: String!
        user_id: String
        user: User
        title: String
        content: String
        post_type: String
        current_weight: Float
        created_at: String
        updated_at: String
    }
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
        updatedAt: String
    }
    type Mutation {
        addBlog(user_id: String!, title: String!, content: String!, post_type: String!): Blog
        editBlog(_id: String!, title: String, content: String, post_type: String): Blog
        removeBlog(_id: String!): Blog
    }
`;
export default blogTypeDefs;
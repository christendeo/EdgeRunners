export const blogTypeDefs = `#graphql
    type Query {
        blogs: [Blog]
        getBlogById(_id: String!): Blog
        getBlogsByUser(user_id: String!): [Blog]
    }
    type Blog {
        _id: String!
        user_id: String
        title: String
        content: String
        post_type:
        stats_current
        created_at:
        updated_at:
    }
    type Mutation {
        addBlog(user_id: String!, title: String!, content: String!, post_type: String!): Blog
        editBlog(_id: String!, user_id: String!, title: String, content: String, post_type: String): Blog
        removeBlog(_id: String!): Blog
    }
`;
export default blogTypeDefs;
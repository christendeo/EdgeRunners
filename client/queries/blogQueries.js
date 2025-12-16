import {gql} from '@apollo/client';
//graphql queries for the Blogs data collection

const GET_BLOGS = gql`
    query {
        blogs {
            _id
            user_id
            user {
                first_name
                last_name
            }
            title
            content
            post_type
            current_weight
            created_at
            updated_at
        }
    }
`;

const GET_BLOG = gql`
    query getBlog($_id: String!) {
        getBlogById (_id: $_id) {
            _id
            user_id
            user {
                first_name
                last_name
            }
            title
            content
            post_type
            current_weight
            created_at
            updated_at
        }
    }
`;

const GET_USER_BLOGS = gql`
    query getUserBlogs($user_id: String!) {
        getBlogsByUser(user_id: $user_id) {
            _id
            user_id
            title
            content
            post_type
            current_weight
            created_at
            updated_at
        }
    }
`;

const CREATE_BLOG = gql`
    mutation createBlog($user_id: String!, $title: String!, $content: String!, $post_type: String!) {
        addBlog(user_id: $user_id, title: $title, content: $content, post_type: $post_type){
            _id
            user_id
            title
            content
            post_type
            current_weight
            created_at
            updated_at
        }
    }
`;

const UPDATE_BLOG = gql`
    mutation updateBlog($_id: String!, $user_id: String!, $title: String, $content: String, $post_type: String) {
        editBlog(_id: $_id, user_id: $user_id, title: $title, content: $content, post_type: $post_type) {
            _id
            user_id
            title
            content
            post_type
            current_weight
            created_at
            updated_at
        }
    }
`;

const DELETE_BLOG = gql`
    mutation deleteBlog($_id: String!, $user_id: String!) {
        removeBlog(_id: $_id, user_id: $user_id) {
            _id
            user_id
            title
            content
            post_type
            current_weight
            created_at
            updated_at
        }
    }
`;

let exported = {
    GET_BLOGS,
    GET_BLOG,
    GET_USER_BLOGS,
    CREATE_BLOG,
    UPDATE_BLOG,
    DELETE_BLOG
};

export default exported;
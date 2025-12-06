import {GraphQLError} from 'graphql';
import * as blogs from '../data/blogCollection.js';

export const resolvers = {
    Query: {
        blogs: async () => {
            let blogPosts;
            try {
                blogPosts = await blogs.getAllBlogs();
            } catch (e) {
                throw new GraphQLError('Blog Posts Not Found', {
                    extensions: {code: 'NOT_FOUND'}
                });
            }
            return blogPosts;
        },
        getBlogById: async (_, args) => {
            let blogPost;
            try {
                blogPost = await blogs.getBlogById(args._id);
            } catch (e) {
                if(e.message === 'Blog Post Not Found'){
                    throw new GraphQLError(e.message, {
                        extensions: {code: 'NOT_FOUND'}
                    });
                } else {
                    throw new GraphQLError(`Invalid Input: ${e.message}`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }
            }
            return blogPost;
        },
        getBlogsByUser: async (_, args) => {
            let blogPosts;
            try {
                blogPosts = await blogs.getBlogsByUser(args.user_id);
            } catch (e) {
                if(e.message === 'posts could not be found'){
                    throw new GraphQLError(e.message, {
                        extensions: {code: 'NOT_FOUND'}
                    });
                } else {
                    throw new GraphQLError(`Invalid Input: ${e.message}`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }
            }
            return blogPosts;
        }
    },
    Blog: {
        current_weight: async (parentValue) => {
            const usersCollection = await users();
            const user = await usersCollection.getUserById(parentValue.user_id);
            return user.weight;
        }
        //add calories_today
    },
    Mutation: {
        addBlog: async (_, args) => {
            let blogPost;
            try {
                blogPost = await blogs.createBlog(args.user_id, args.title, args.content, args.post_type);
            } catch (e) {
                if(e.message === 'Could not add new blog post'){
                    throw new GraphQLError(e.message, {
                        extensions: {code: 'INTERNAL_SERVER_ERROR'}
                    });
                } else {
                    throw new GraphQLError(`Invalid Input: ${e.message}`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }
            }
            return blogPost;
        },
        removeBlog: async (_, args) => {
            let blogPost;
            try {
                blogPost = await blogs.deleteBlog(args._id, args.user_id);
            } catch (e) {
                if(e.message === 'Could not delete blog post'){
                    throw new GraphQLError(e.message, {
                        extensions: {code: 'INTERNAL_SERVER_ERROR'}
                    });
                } else {
                    throw new GraphQLError(`Invalid Input: ${e.message}`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }
            }
            return blogPost;
        },
        editBlog: async (_, args) => {
            let blogPost;
            let updateInfo = {};
        
            if(args.title){
                updateInfo.title = args.title;
            }
            if(args.content){
                updateInfo.content = args.content;
            }
            if(args.post_type){
                updateInfo.post_type = args.post_type;
            }

            try {
                blogPost = await blogs.updateBlog(args._id, args.user_id, updateInfo);
            } catch (e) {
                if(e.message === 'Could not find blog post'){
                    throw new GraphQLError(e.message, {
                        extensions: {code: 'INTERNAL_SERVER_ERROR'}
                    });
                } else {
                    throw new GraphQLError(`Invalid Input: ${e.message}`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }
            }
            return blogPost;
        }
    }
};

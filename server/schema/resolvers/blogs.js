import * as blogs from '../../data/blogCollection.js';
import * as users from "../../data/userCollection.js";
import { throwGraphQLError, validateId, validateString } from '../../helpers/graphQLHelpers.js';
import { getCache, setCache, deleteCache, } from '../../config/redisConnection.js';

export const resolvers = {
    Query: {
        blogs: async () => {
			try {
				const cached = await getCache('allBlogs');
				if (cached) {
					return cached;
				}

				const blogPosts = await blogs.getAllBlogs();
				await setCache('allBlogs', blogPosts);
            	return blogPosts;
			} catch (error) {
				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}
        },
        getBlogById: async (_, args) => {
			const blogId = validateId(args._id);
			const cacheKey = `blog${blogId}`;
			let blogPost;

			try {
				const cached = await getCache(cacheKey);
				if (cached) {
					blogPost = cached;
				} else {
					blogPost = await blogs.getBlogById(blogId);
					await setCache(cacheKey, blogPost);
				}
			} catch (error) {
				if (error.message.includes('Not Found')) {
					throwGraphQLError(error.message, 'NOT_FOUND');
				}

				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}

            return blogPost;
        },
        getBlogsByUser: async (_, args) => {
			const userId = validateId(args.user_id);
			const cacheKey = `UserBlog${userId}`;

			try {
				const cached = await getCache(cacheKey);
				if (cached) {
					return cached;
				}

				const blogPosts = await blogs.getBlogsByUserId(userId);
				await setCache(cacheKey, blogPosts);
				return blogPosts;
			} catch (error) {
				if (error.message.includes('could not be found')) {
					throwGraphQLError(error.message, 'NOT_FOUND');
				}

				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}
        }
    },
    Blog: {
        current_weight: async (parentValue) => {
			const userId = validateId(parentValue.user_id);

			try {
				const user = await users.getUserById(userId);
            	return user.weight;
			} catch (error) {
				if (error.message.includes('There is no user with that ID')) {
					throwGraphQLError(error.message, 'NOT_FOUND');
				}

				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}
        },
        user: async (parentValue) => {
			const userId = validateId(parentValue.user_id);

			try {
				const user = await users.getUserById(userId);
				return user;
			} catch (error) {
				if (error.message.includes('There is no user with that ID')) {
					throwGraphQLError(error.message, 'NOT_FOUND');
				}

				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}
        }
    },
    Mutation: {
        addBlog: async (_, args, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

			const userId = validateId(args.user_id);
			if (context.user.id !== userId) {
				throwGraphQLError("Not authorized to create blog posts for other users", 'FORBIDDEN');
			}

			let blogPost;
            try {
                blogPost = await blogs.createBlog(userId, args.title, args.content, args.post_type);
            } catch (error) {
				if (error.message.includes("user with this ID does not exist")) {
					throwGraphQLError(error.message, 'NOT_FOUND');
				}
				
				if (error.message.includes("Could not add new blog post")) {
					throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
				}

				throwGraphQLError(error.message, 'BAD_USER_INPUT');
            }

			try {
				await deleteCache('allBlogs');
				await deleteCache(`UserBlog${userId}`);
			} catch (error) {
				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}

			return blogPost;
        },
        removeBlog: async (_, args, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

			const blogId = validateId(args._id);

			try {
				const blogPost = await blogs.getBlogById(blogId);
				if (context.user.id !== blogPost.user_id) {
					throwGraphQLError("Not authorized to delete other users' blog posts", 'FORBIDDEN');
				}

				const deletedBlog = blogs.deleteBlog(blogId);
				await deleteCache('allBlogs');
				await deleteCache(`blog${blogId}`);
				await deleteCache(`UserBlog${context.user.id}`);
				return deletedBlog;
			} catch (error) {
				if (error.extensions?.code) {
					throw error;
				}

				if (error.message.includes("Not Found")) {
					throwGraphQLError(error.message, 'NOT_FOUND');
				}

				if (error.message.includes("Could not delete")) {
					throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
				}

				throwGraphQLError(error.message, 'BAD_USER_INPUT');
			}
        },
        editBlog: async (_, args, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

			const blogId = validateId(args._id);

			try {
				const blogPost = await blogs.getBlogById(blogId);
				if (context.user.id !== blogPost.user_id) {
					throwGraphQLError("Not authorized to edit other users' blog posts", 'FORBIDDEN');
				}
			} catch (error) {
				if (error.extensions?.code) {
					throw error;
				}

				if (error.message.includes("Not Found")) {
					throwGraphQLError(error.message, 'NOT_FOUND');
				}

				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}

            const updateInfo = {};

            if (args.title) {
                updateInfo.title = validateString(args.title, 'Title');
            }

            if (args.content) {
                updateInfo.content = validateString(args.content, 'Content');
            }

            if (args.post_type) {
                updateInfo.post_type = validateString(args.post_type, 'Post Type');
            }

            try {
                const blogPost = await blogs.updateBlog(blogId, updateInfo);
				await deleteCache('allBlogs');
				await deleteCache(`blog${blogId}`);
				await deleteCache(`UserBlog${context.user.id}`);
				return blogPost;
            } catch (error) {
				if (error.message.includes("Could not find blog post")) {
					throwGraphQLError(error.message, 'NOT_FOUND');
				}

				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
            }
        }
    }
};

export default resolvers;
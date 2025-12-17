import {
    addUser,
    getUserById,
    getAllUsers,
    editUser,
    loginUser as loginUserData,
    changePassword as resetPasswordData
} from "../../data/userCollection.js";
import { generateToken } from '../../helpers/jwtHelpers.js';
import { throwGraphQLError, validateId } from '../../helpers/graphQLHelpers.js';

const userResolvers = {
    Query: {
        getUserById: async (_, args, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

            const userId = validateId(args._id);

			if (context.user.id !== userId) {
				throwGraphQLError("Not authorized to view other users' profiles", 'FORBIDDEN');
			}

			try {
				return await getUserById(userId);
			} catch (error) {
				if (error.message.includes("no user with that ID")) {
					throwGraphQLError(error.message, 'NOT_FOUND');
				}

				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}
        },
        users: async (_, _, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

            try {
				return await getAllUsers();
			} catch (error) {
				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}
        }
    },
    Mutation: {
        addUser: async (_, args) => {
			try {
				const createdUser = await addUser(
					args.first_name,
					args.last_name,
					args.email,
					args.password,
					args.sex,
					args.date_of_birth,
					args.height,
					args.weight,
					args.activity_level,
					args.diet_goal,
					args.use_custom_target,
					args.custom_target_calories
            	);

				const token = generateToken(createdUser);
				return { ...createdUser, token };
			} catch (error) {
				if (error.message.includes("User could not be added")) {
					throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
				}

				throwGraphQLError(error.message, 'BAD_USER_INPUT');
			}
        },

        // Update user profile
        editUser: async (_, args, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

            const userId = validateId(args._id);

			if (context.user.id !== userId) {
				throwGraphQLError("Not authorized to edit other users' profiles", 'FORBIDDEN');
			}

            const userInput = {};

            if (args.first_name !== undefined) {
                userInput.first_name = args.first_name;
            }

            if (args.last_name !== undefined) {
                userInput.last_name = args.last_name;
            }

            if (args.email !== undefined) {
                userInput.email = args.email;
            }

            if (args.password !== undefined) {
                userInput.password = args.password;
            }

            if (args.sex !== undefined) {
                userInput.sex = args.sex;
            }

            if (args.date_of_birth !== undefined) {
                userInput.date_of_birth = args.date_of_birth;
            }

            if (args.height !== undefined) {
                userInput.height = args.height;
            }

            if (args.weight !== undefined) {
                userInput.weight = args.weight;
            }

            if (args.activity_level !== undefined) {
                userInput.activity_level = args.activity_level;
            }

            if (args.diet_goal !== undefined) {
                userInput.diet_goal = args.diet_goal;
            }

            // Check if custom is enabled
            if (args.use_custom_target !== undefined) {
                userInput.use_custom_target = args.use_custom_target;
            }

            if (args.custom_target_calories !== undefined) {
                userInput.custom_target_calories = args.custom_target_calories;
            }

			try {
				return await editUser(userId, userInput);
			} catch (error) {
				if (error.message.includes("User could not be found")) {
					throwGraphQLError(error.message, 'NOT_FOUND');
				}

				if (error.message.includes("User could not be updated")) {
					throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
				}

				throwGraphQLError(error.message, 'BAD_USER_INPUT');
			}
        },
        loginUser: async (_, args) => {
			try {
				const loggedInUser = await loginUserData(
					args.email,
					args.password
				);

				const token = generateToken(loggedInUser);
				return { ...loggedInUser, token };
			} catch (error) {
				if (error.message.includes("Either the email or password is incorrect")) {
					throwGraphQLError(error.message, 'BAD_USER_INPUT');
				}

				throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
			}
        },
        changePassword: async (_, args, context) => {
			if (!context.user) {
				throwGraphQLError("Not authenticated", 'UNAUTHENTICATED');
			}

			const userId = validateId(args._id);

			if (context.user.id !== userId) {
				throwGraphQLError("Not authorized to change other users' passwords", 'FORBIDDEN');
			}

			try {
				return await resetPasswordData(
					userId,
					args.oldPassword,
					args.newPassword
				);
			} catch (error) {
				if (error.message.includes("User does not exist")) {
					throwGraphQLError(error.message, 'NOT_FOUND');
				}

				if (error.message.includes("Password could not be updated")) {
					throwGraphQLError(error.message, 'INTERNAL_SERVER_ERROR');
				}

				throwGraphQLError(error.message, 'BAD_USER_INPUT');
			}
        }
    },
    User: {
        current_target_calories: (parent) => {
            if (parent.use_custom_target === true) {
                if (parent.custom_target_calories !== undefined && parent.custom_target_calories !== null) {
                    return parent.custom_target_calories;
                }
            }

            return parent.target_calories;
        }
    },

};

export default userResolvers;
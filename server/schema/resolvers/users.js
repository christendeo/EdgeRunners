// Import functions
import {
    addUser,
    getUserById,
    getAllUsers,
    editUser
} from "../../data/userCollection.js";
import redis from "../../config/redisConnection.js"

const userResolvers = {

    // The queries
    Query: {

        // Get user by ID
        getUserById: async (_, args) => {
            const userId = args._id;
            const getUser = await getUserById(userId);

            return {
                _id: getUser._id,
                first_name: getUser.first_name,
                last_name: getUser.last_name,
                email: getUser.email,
                sex: getUser.sex,
                date_of_birth: getUser.date_of_birth,
                height: getUser.height,
                weight: getUser.weight,
                activity_level: getUser.activity_level,
                diet_goal: getUser.diet_goal,
                target_calories: getUser.target_calories,
                createdAt: getUser.createdAt,
                updatedAt: getUser.updatedAt
            };
        },

        // Get all users
        users: async () => {
            const allUsers = await getAllUsers();

            return allUsers.map((currentUser) => {
                return {
                    _id: currentUser._id,
                    first_name: currentUser.first_name,
                    last_name: currentUser.last_name,
                    email: currentUser.email,
                    sex: currentUser.sex,
                    date_of_birth: currentUser.date_of_birth,
                    height: currentUser.height,
                    weight: currentUser.weight,
                    activity_level: currentUser.activity_level,
                    diet_goal: currentUser.diet_goal,
                    target_calories: currentUser.target_calories,
                    createdAt: currentUser.createdAt,
                    updatedAt: currentUser.updatedAt
                };
            });
        }
    },

    // The mutations
    Mutation: {

        // Create the user
        addUser: async (_, args) => {
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
                args.target_calories
            );

            return {
                _id: createdUser._id,
                first_name: createdUser.first_name,
                last_name: createdUser.last_name,
                email: createdUser.email,
                sex: createdUser.sex,
                date_of_birth: createdUser.date_of_birth,
                height: createdUser.height,
                weight: createdUser.weight,
                activity_level: createdUser.activity_level,
                diet_goal: createdUser.diet_goal,
                target_calories: createdUser.target_calories,
                createdAt: createdUser.createdAt,
                updatedAt: createdUser.updatedAt
            };
        },

        // Update user profile
        editUser: async (_, args) => {
            const userId = args._id;

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

            if (args.target_calories !== undefined) {
                userInput.target_calories = args.target_calories;
            }

            const updatedUser = await editUser(userId, userInput);

            return {
                _id: updatedUser._id,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                email: updatedUser.email,
                sex: updatedUser.sex,
                date_of_birth: updatedUser.date_of_birth,
                height: updatedUser.height,
                weight: updatedUser.weight,
                activity_level: updatedUser.activity_level,
                diet_goal: updatedUser.diet_goal,
                target_calories: updatedUser.target_calories,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            };
        }
    }
};

export default userResolvers;
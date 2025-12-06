// User Collection CRUD
import helpers from "../helpers/serverHelpers.js";
import {users} from "../config/mongoCollections.js";
import {ObjectId} from "mongodb";

// Create user function
export const addUser = async (
    first_name,
    last_name,
    email,
    date_of_birth,
    height,
    weight,
    activity_level,
    diet_goal,
    target_calories
) => {

    // Validation checks
    first_name = helpers.checkName(first_name, "First Name");
    last_name = helpers.checkName(last_name, "Last Name");
    email = helpers.checkEmailAddress(email, "Email");
    date_of_birth = helpers.checkDateFormat(date_of_birth, "Date of Birth");
    activity_level = helpers.checkActivityLevel(activity_level, "Activity Level");
    diet_goal = helpers.checkDietGoal(diet_goal, "Diet Goal");

    const userCollection = await users();

    // Store fields
    const newUser = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        date_of_birth: date_of_birth,
        height: height,
        weight: weight,
        activity_level: activity_level,
        diet_goal: diet_goal,
        target_calories: target_calories,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const insertUserInfo = await userCollection.insertOne(newUser);

    if (!insertUserInfo.acknowledged || !insertUserInfo.insertedId) {
        throw "Oh no! User could not be added :(";
    }

    const newUserId = insertUserInfo.insertedId.toString();
    const theUser = await getUserById(newUserId);

    return theUser;
};

// Get user by id
export const getUserById = async (userId) => {

    // Validation check
    userId = helpers.checkId(userId, "User ID");

    const userCollection = await users();

    const currentUser = await userCollection.findOne(
        { _id: new ObjectId(userId) }
    );

    if (!currentUser) {
        throw "Oh no! There is no user with that ID :(";
    }

    currentUser._id = currentUser._id.toString();
    return currentUser;
};

// Edit user (partial update)
// Edit user (partial update)
export const editUser = async (userId, updatedUser) => {

    // Validation check
    userId = helpers.checkId(userId, "User ID");

    if (!updatedUser || typeof updatedUser !== "object" || Object.keys(updatedUser).length === 0) {
        throw "Oh no! You need to provide at least one field to update :(";
    }

    const updatedUserData = {};

    if (updatedUser.first_name !== undefined) {
        updatedUserData.first_name = helpers.checkName(updatedUser.first_name, "First Name");
    }

    if (updatedUser.last_name !== undefined) {
        updatedUserData.last_name = helpers.checkName(updatedUser.last_name, "Last Name");
    }

    if (updatedUser.email !== undefined) {
        updatedUserData.email = helpers.checkEmailAddress(updatedUser.email, "Email");
    }

    if (updatedUser.date_of_birth !== undefined) {
        updatedUserData.date_of_birth = helpers.checkDateFormat(updatedUser.date_of_birth, "Date of Birth");
    }

    if (updatedUser.height !== undefined) {
        updatedUserData.height = updatedUser.height;
    }

    if (updatedUser.weight !== undefined) {
        updatedUserData.weight = updatedUser.weight;
    }

    if (updatedUser.activity_level !== undefined) {
        updatedUserData.activity_level = helpers.checkActivityLevel(updatedUser.activity_level, "Activity Level");
    }

    if (updatedUser.diet_goal !== undefined) {
        updatedUserData.diet_goal = helpers.checkDietGoal(updatedUser.diet_goal, "Diet Goal");
    }

    if (updatedUser.target_calories !== undefined) {
        updatedUserData.target_calories = updatedUser.target_calories;
    }

    updatedUserData.updatedAt = new Date();

    const userCollection = await users();

    // Store updated info
    const updateResult = await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updatedUserData }
    );

    if (!updateResult.matchedCount || updateResult.matchedCount === 0) {
        throw "Oh no! User could not be updated or does not exist :(";
    }

    const updatedDoc = await getUserById(userId);
    return updatedDoc;
};

// Get all users
export const getAllUsers = async () => {
    const userCollection = await users();

    let allUsers = await userCollection.find({}).toArray();

    if (allUsers.length === 0) {
        return [];
    }

    // List all of our users
    allUsers = allUsers.map((user) => {
        user._id = user._id.toString();
        return user;
    });

    return allUsers;
};
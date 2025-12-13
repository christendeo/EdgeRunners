// User Collection CRUD
import helpers from "../helpers/serverHelpers.js";

// Function to auto compute target calories based on user profile
import {computeTargetCaloriesFromProfile} from "../helpers/targetHelpers.js";
import {users} from "../config/mongoCollections.js";
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";

// Create user function
export const addUser = async (
    userFirstName,
    userLastName,
    userEmail,
    userPassword,
    userSex,
    userDOB,
    userHeight,
    userWeight,
    userActivityLevel,
    userDietGoal
) => {

    // Validation checks
    userFirstName = helpers.checkName(userFirstName, "First Name");
    userLastName = helpers.checkName(userLastName, "Last Name");
    userEmail = helpers.checkEmailAddress(userEmail, "Email");
    userPassword = helpers.checkPassword(userPassword, "Password");
    userSex = helpers.checkSex(userSex, "Sex");
    userDOB = helpers.checkDateFormat(userDOB, "Date of Birth");
    userHeight = helpers.checkHeight(userHeight, "Height");
    userWeight = helpers.checkWeight(userWeight, "Weight");
    userActivityLevel = helpers.checkActivityLevel(userActivityLevel, "Activity Level");
    userDietGoal = helpers.checkDietGoal(userDietGoal, "Diet Goal");

    // Build profile for calculation
    const profileForCalculation = {
        sex: userSex,
        date_of_birth: userDOB,
        height: userHeight,
        weight: userWeight,
        activity_level: userActivityLevel,
        diet_goal: userDietGoal
    };

    let autoTargetCalories = computeTargetCaloriesFromProfile(profileForCalculation);

    if (autoTargetCalories === null) {
        throw new Error ("Oh no! Not enough information to compute target calories :(");
    }

    const userCollection = await users();

    // For password hashing
    let saltRounds = 10;
    let passwordHash = await bcrypt.hash(userPassword, saltRounds);

    // Store fields
    const newUser = {
        first_name: userFirstName,
        last_name: userLastName,
        email: userEmail,
        password_hash: passwordHash,
        sex: userSex,
        date_of_birth: userDOB,
        height: userHeight,
        weight: userWeight,
        activity_level: userActivityLevel,
        diet_goal: userDietGoal,
        target_calories: autoTargetCalories,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const insertUserInfo = await userCollection.insertOne(newUser);

    if (!insertUserInfo.acknowledged || !insertUserInfo.insertedId) {
        throw new Error ("Oh no! User could not be added :(");
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
        throw new Error ("Oh no! There is no user with that ID :(");
    }

    currentUser._id = currentUser._id.toString();
    return currentUser;
};

// Edit user profile (partial update)
export const editUser = async (userId, updatedUser) => {

    // Validation check
    userId = helpers.checkId(userId, "User ID");

    if (!updatedUser || typeof updatedUser !== "object" || Object.keys(updatedUser).length === 0) {
        throw new Error ("Oh no! You need to provide at least one field to update :(");
    }

    const userCollection = await users();
    const currentUser = await userCollection.findOne(
        { _id: new ObjectId(userId) }
    );

    if (!currentUser) {
        throw new Error ("Oh no! User could not be updated or does not exist :(");
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

    // For changing passwords
    if (updatedUser.password !== undefined) {
        const checkedPassword = helpers.checkPassword(updatedUser.password, "Password");
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(checkedPassword, saltRounds);
        updatedUserData.password_hash = passwordHash;
    }

    if (updatedUser.sex !== undefined) {
        updatedUserData.sex = helpers.checkSex(updatedUser.sex, "Sex");
    }

    if (updatedUser.date_of_birth !== undefined) {
        updatedUserData.date_of_birth = helpers.checkDateFormat(updatedUser.date_of_birth, "Date of Birth");
    }

    if (updatedUser.height !== undefined) {
        updatedUserData.height = helpers.checkHeight(updatedUser.height, "Height");
    }

    if (updatedUser.weight !== undefined) {
        updatedUserData.weight = helpers.checkWeight(updatedUser.weight);
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

    // Build merged profile for auto target calculation
    const mergedProfile = {};

    // sex
    if (updatedUserData.sex !== undefined) {
        mergedProfile.sex = updatedUserData.sex;
    } else {
        mergedProfile.sex = currentUser.sex;
    }

    // date_of_birth
    if (updatedUserData.date_of_birth !== undefined) {
        mergedProfile.date_of_birth = updatedUserData.date_of_birth;
    } else {
        mergedProfile.date_of_birth = currentUser.date_of_birth;
    }

    // height
    if (updatedUserData.height !== undefined) {
        mergedProfile.height = updatedUserData.height;
    } else {
        mergedProfile.height = currentUser.height;
    }

    // weight
    if (updatedUserData.weight !== undefined) {
        mergedProfile.weight = updatedUserData.weight;
    } else {
        mergedProfile.weight = currentUser.weight;
    }

    // activity_level
    if (updatedUserData.activity_level !== undefined) {
        mergedProfile.activity_level = updatedUserData.activity_level;
    } else {
        mergedProfile.activity_level = currentUser.activity_level;
    }

    // diet_goal
    if (updatedUserData.diet_goal !== undefined) {
        mergedProfile.diet_goal = updatedUserData.diet_goal;
    } else {
        mergedProfile.diet_goal = currentUser.diet_goal;
    }

    let autoTargetCalories = computeTargetCaloriesFromProfile(mergedProfile);

    if (autoTargetCalories !== null) {
        updatedUserData.target_calories = autoTargetCalories;
    }

    // Store updated info
    const updateResult = await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updatedUserData }
    );

    if (!updateResult.matchedCount || updateResult.matchedCount === 0) {
        throw new Error ("Oh no! User could not be updated or does not exist :(");
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

// Authenticate user for login purposes
export const loginUser = async (email, password) => {

    // Validate inputs
    email = helpers.checkEmailAddress(email, "Email");
    password = helpers.checkPassword(password, "Password");

    const userCollection = await users();

    // Find user by email (case-insensitive)
    const existingUser = await userCollection.findOne({
        email: email.toLowerCase()
    });

    if (!existingUser) {
        throw new Error("Oh no! Either the email or password is incorrect :(");
    }

    const passwordsMatch = await bcrypt.compare(password, existingUser.password_hash);

    if (!passwordsMatch) {
        throw new Error("Oh no! Either the email or password is incorrect :(");
    }

    // Convert _id to string for GraphQL
    existingUser._id = existingUser._id.toString();

    return existingUser;
};

// Reset password by email
export const resetPassword = async (email, newPassword) => {

    // Validation checks
    email = helpers.checkEmailAddress(email, "Email");
    newPassword = helpers.checkPassword(newPassword, "New Password");

    const userCollection = await users();

    // Find the user by email
    const existingUser = await userCollection.findOne(
        { email: email }
    );

    if (!existingUser) {
        throw new Error("Oh no! There is no account with that email :(");
    }

    // Prevent using the same password again
    const isSameAsOld = await bcrypt.compare(newPassword, existingUser.password_hash);

    if (isSameAsOld) {
        throw new Error("Oh no! New password must be different from your old password :(");
    }

    const saltRounds = 10;
    const newHash = await bcrypt.hash(newPassword, saltRounds);

    // Use updateOne and check matchedCount / modifiedCount
    const updateResult = await userCollection.updateOne(
        { _id: existingUser._id },
        {
            $set: {
                password_hash: newHash,
                updatedAt: new Date()
            }
        }
    );

    if (!updateResult.matchedCount || updateResult.matchedCount === 0) {
        throw new Error("Oh no! Password could not be reset :(");
    }

    // It matched, but if modifiedCount is 0, it means the hash was the same
    if (!updateResult.modifiedCount || updateResult.modifiedCount === 0) {
        throw new Error("Oh no! Password could not be reset, please try a different password :(");
    }

    return true;
};
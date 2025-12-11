// Helpers for calculating the user's personalized target calories based on their info like activity level, age, sex, etc.

// Factor values based on Harris-Benedict Standard Activity Factor (SAF) scores range from GymGeek
function getActivityFactor(getActivityLevel) {
    if (getActivityLevel === "sedentary") {
        return 1.2;
    } else if (getActivityLevel === "light") {
        return 1.375;
    } else if (getActivityLevel === "moderate") {
        return 1.55;
    } else if (getActivityLevel === "active") {
        return 1.725;
    } else if (getActivityLevel === "very_active") {
        return 1.9;
    } else {
        return 1.2;
    }
}

function getAgeFromDateOfBirth(dobString) {

    // Ensure it is a date object
    let dobUser = new Date(dobString);
    if (isNaN(dobUser.getTime())) {
        return null;
    }

    // Get date values
    let todayDate = new Date();
    let userAge = todayDate.getFullYear() - dobUser.getFullYear();
    let monthDate = todayDate.getMonth() - dobUser.getMonth();

    if (monthDate < 0 || (monthDate === 0 && todayDate.getDate() < dobUser.getDate())) {
        userAge--;
    }

    return userAge;
}

// Main function for computing the target calories
export function computeTargetCaloriesFromProfile(userProfile) {
    let userSex = userProfile.sex;
    let userHeight = userProfile.height;
    let userWeight = userProfile.weight;
    let userActivityLevel = userProfile.activity_level;
    let userDietGoal = userProfile.diet_goal;
    let userDOB = userProfile.date_of_birth;

    let userAge = getAgeFromDateOfBirth(userDOB);

    // Validations and if there is not enough to compute
    if (!userSex || userHeight === undefined || userWeight === undefined || !userActivityLevel || !userDietGoal || userAge === null) {
        return null;
    }

    // Mifflin–St Jeor BMR formula:
    // male:   10*kg + 6.25*cm - 5*age + 5
    // female: 10*kg + 6.25*cm - 5*age - 161
    let userBMR;
    if (userSex === "male") {
        userBMR = 10 * userWeight + 6.25 * userHeight - 5 * userAge + 5;
    } else {
        userBMR = 10 * userWeight + 6.25 * userHeight - 5 * userAge - 161;
    }

    let activityFactor = getActivityFactor(userActivityLevel);

    // TDEE meaning Total Daily Energy Expenditure, which is the total number of calories your body burns in a day
    let userTDEE = userBMR * activityFactor;
    let goalFactor;

    if (userDietGoal === "lose") {

        // 15% deficit
        goalFactor = 0.85;
    } else if (userDietGoal === "gain") {

        // 10% surplus
        goalFactor = 1.1;
    } else {
        goalFactor = 1.0;
    }

    let userTargetCalories = Math.round(userTDEE * goalFactor);
    if (userTargetCalories < 800) {
        userTargetCalories = 800;
    }

    if (userTargetCalories > 6000) {
        userTargetCalories = 6000;
    }

    return userTargetCalories;
}
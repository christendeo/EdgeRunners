// Helpers for unit conversions and progress macro tracker
const exportedMethods = {

    // Helpers for unit conversions on frontend
    checkHeightFeetInches(userFeet, userInches, varName) {

        // Validations
        if (userFeet === undefined || userFeet === null) {
            throw new Error(`Error: ${varName} feet is required`);
        }

        if (userInches === undefined || userInches === null) {
            throw new Error(`Error: ${varName} inches is required`);
        }

        // Allow strings from forms
        if (typeof userFeet === "string") {
            userFeet = userFeet.trim();
            if (userFeet.length === 0) {
                throw new Error(`Error: ${varName} feet cannot be empty`);
            }
            userFeet = Number(userFeet);
        }

        if (typeof userInches === "string") {
            userInches = userInches.trim();
            if (userInches.length === 0) {
                throw new Error(`Error: ${varName} inches cannot be empty`);
            }
            userInches = Number(userInches);
        }

        if (typeof userFeet !== "number" || isNaN(userFeet)) {
            throw new Error(`Error: ${varName} feet must be a number`);
        }

        if (typeof userInches !== "number" || isNaN(userInches)) {
            throw new Error(`Error: ${varName} inches must be a number`);
        }

        if (!Number.isInteger(userFeet) || !Number.isInteger(userInches)) {
            throw new Error(`Error: ${varName} feet and inches must be whole numbers`);
        }

        // Reasonable adult ranges
        if (userFeet < 3 || userFeet > 8) {
            throw new Error(`Error: ${varName} feet must be between 3 and 8`);
        }

        if (userInches < 0 || userInches > 11) {
            throw new Error(`Error: ${varName} inches must be between 0 and 11`);
        }

        return {
            feet: userFeet,
            inches: userInches
        };
    },

    checkWeightLbs(userWeightLbs, varName) {

        if (userWeightLbs === undefined || userWeightLbs === null) {
            throw new Error(`Error: ${varName} is required`);
        }

        // Allow strings from forms
        if (typeof userWeightLbs === "string") {
            userWeightLbs = userWeightLbs.trim();
            if (userWeightLbs.length === 0) {
                throw new Error(`Error: ${varName} cannot be empty`);
            }
            userWeightLbs = Number(userWeightLbs);
        }

        if (typeof userWeightLbs !== "number" || isNaN(userWeightLbs)) {
            throw new Error(`Error: ${varName} must be a number`);
        }

        // Reasonable adult range
        if (userWeightLbs < 70 || userWeightLbs > 600) {
            throw new Error(`Error: ${varName} must be between 70 and 600 lbs`);
        }

        return userWeightLbs;
    },

    // Conversion helpers
    feetInchesToCm(userFeet, userInches) {
        const totalInches = (userFeet * 12) + userInches;
        const cmTotal = totalInches * 2.54;

        let convertedValue = Number(cmTotal.toFixed(2))
        return convertedValue;
    },

    cmToFeetInches(cmUser) {

        // Validations
        if (cmUser === undefined || cmUser === null) {
            return {
                feet: "",
                inches: ""
            };
        }

        if (typeof cmUser !== "number" || isNaN(cmUser)) {
            return {
                feet: "",
                inches: ""
            };
        }

        const totalInches = cmUser / 2.54;
        let userFeet = Math.floor(totalInches / 12);
        let userInches = Math.round(totalInches - (userFeet * 12));

        if (userInches === 12) {
            userFeet = userFeet + 1;
            userInches = 0;
        }

        return {
            feet: userFeet,
            inches: userInches
        };
    },

    lbsToKg(userPounds) {
        const kgUser = userPounds * 0.45359237;
        return Number(kgUser.toFixed(2));
    },

    kgToLbs(kgUser) {

        if (kgUser === undefined || kgUser === null) {
            return "";
        }

        if (typeof kgUser !== "number" || isNaN(kgUser)) {
            return "";
        }

        const lbsUser = kgUser / 0.45359237;
        let lbsConverted = Number(lbsUser.toFixed(1));
        return lbsConverted;
    },

    checkCustomTargetCalories(customCalories, varName) {

        if (customCalories === undefined || customCalories === null) {
            return null;
        }

        if (typeof customCalories !== "number" || isNaN(customCalories)) {
            throw new Error(`Error: ${varName} must be a number`);
        }

        // Safe range for adults
        if (customCalories < 800 || customCalories > 6000) {
            throw new Error(`Error: ${varName} must be between 800 and 6000`);
        }

        return Math.round(customCalories);
    },

    // Helpers for UserTodaysProgress
    formatDateForQuery(dateObj) {

        // Check date format
        if (!(dateObj instanceof Date)) {
            throw new Error("Error: dateObj must be a Date object");
        }

        let currentMonth = String(dateObj.getMonth() + 1).padStart(2, "0");
        let currentDay = String(dateObj.getDate()).padStart(2, "0");
        let currentYear = String(dateObj.getFullYear());

        return `${currentMonth}/${currentDay}/${currentYear}`;
    },

    getTodaysQueryDate() {
        let todayDate = new Date();
        return this.formatDateForQuery(todayDate);
    },

    safeNumber(valueNumber) {
        if (typeof valueNumber !== "number" || isNaN(valueNumber)) {
            return 0;
        }
        return valueNumber;
    },

    clampNumber(valueNumber, valueMin, valueMax) {
        if (typeof valueNumber !== "number" || isNaN(valueNumber)) {
            return valueMin;
        }

        if (valueNumber < valueMin) {
            return valueMin;
        }

        if (valueNumber > valueMax) {
            return valueMax;
        }

        return valueNumber;
    },

    // Get percentage report
    calcPercent(getConsumed, getTarget) {
        getConsumed = this.safeNumber(getConsumed);
        getTarget = this.safeNumber(getTarget);

        if (getTarget <= 0) {
            return 0;
        }

        // Calculate percentage
        let getPercentage = (getConsumed / getTarget) * 100;
        return this.clampNumber(getPercentage, 0, 100);
    },

    getUserDisplayedTargetCalories(currentUser) {
        if (!currentUser) {
            return null;
        }

        if (currentUser.current_target_calories !== undefined && currentUser.current_target_calories !== null) {
            return this.safeNumber(currentUser.current_target_calories);
        }

        if (currentUser.target_calories !== undefined && currentUser.target_calories !== null) {
            return this.safeNumber(currentUser.target_calories);
        }

        return null;
    },

    // Get macros value
    macroCaloriesFromGrams(proteinG, carbsG, fatG) {

        // Validations
        proteinG = this.safeNumber(proteinG);
        carbsG = this.safeNumber(carbsG);
        fatG = this.safeNumber(fatG);

        let proteinCals = proteinG * 4;
        let carbsCals = carbsG * 4;
        let fatCals = fatG * 9;

        return {
            proteinCals,
            carbsCals,
            fatCals,
            totalMacroCals: proteinCals + carbsCals + fatCals
        };
    },

    // Build date for weekly summary on dashboard
    parseMMDDYYYY(dateString) {
        if (typeof dateString !== "string") {
            return new Date(0);
        }

        const splitDate = dateString.split("/");
        if (splitDate.length !== 3) {
            return new Date(0);
        }

        let getMonth = Number(splitDate[0]);
        let getDay = Number(splitDate[1]);
        let getYear = Number(splitDate[2]);

        // Validations
        if (!Number.isInteger(getMonth) || !Number.isInteger(getDay) || !Number.isInteger(getYear)) {
            return new Date(0);
        }

        // Return new parsed date
        let newDate = new Date(getYear, getMonth - 1, getDay);
        return newDate;
    }
};

export default exportedMethods;
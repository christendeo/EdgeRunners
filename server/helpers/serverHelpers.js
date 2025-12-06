// Helpers for server side
import {ObjectId} from "mongodb";

const exportedMethods = {
    checkId(id, varName) {

        // Check if an id is provided
        if (!id) {
            throw `Error: You must provide a ${varName}`;
        }

        // Check if id is a string
        if (typeof id !== 'string') {
            throw `Error: ${varName} must be a string`;
        }

        id = id.trim();

        // Check if id is empty or only contains empty spaces
        if (id.length === 0) {
            throw `Error: ${varName} cannot be an empty string or just spaces`;
        }

        // Check if id is a valid ObjectID
        if (!ObjectId.isValid(id)) {
            throw `Error: ${varName} invalid object ID`;
        }

        return id;
    },

    checkName(strVal, varName) {

        // Check if a string is provided
        if (!strVal) {
            throw `Error: You must supply a ${varName}!`;
        }

        // Check if it is a string type
        if (typeof strVal !== 'string') {
            throw `Error: ${varName} must be a string!`;
        }

        strVal = strVal.trim();

        // Check if string is empty or only has spaces
        if (strVal.length === 0) {
            throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        }

        // Check if the string has any digits
        if (/\d/.test(strVal)) {
            throw `Error: ${strVal} is not a valid value for ${varName} as it contains digits`;
        }

        // Ensure the name allows only letters, spaces, period, apostrophe, and hyphen
        if (!/^[A-Za-z .'-]+$/.test(strVal)) {
            throw `Error: ${strVal} is not a valid value for ${varName} as it should only contain letters, spaces, periods, apostrophes, and hyphens`;
        }

        return strVal;
    },

    checkString(strVal, varName) {

        // Check if a string is provided
        if (!strVal) {
            throw `Error: You must supply a ${varName}!`;
        }

        // Check if it is a string type
        if (typeof strVal !== 'string') {
            throw `Error: ${varName} must be a string!`;
        }

        strVal = strVal.trim();

        // Check if string is empty or only has spaces
        if (strVal.length === 0) {
            throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        }

        return strVal;
    },

    checkEmailAddress(email, varName) {

        // Check if the email was even provided and is a String
        email = this.checkString(email, "Email Address");

        // Check if email address is valid using Regex
        let emailRegexValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegexValid.test(email)) {
            throw `Error: The ${varName} you provided: ${email} is not valid :(`;
        }

        return email;
    },

    checkDateFormat(dateFormat, varName) {

        // Check if the date was even provided and is a String
        dateFormat = this.checkString(dateFormat, varName);

        // Check if date is valid using Regex
        let dateRegexValid = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegexValid.test(dateFormat)) {
            throw `Error: The date format you provided: ${dateFormat} is not valid :(`;
        }

        // Split date into three parts
        let splitDate = dateFormat.split("/");
        if (splitDate.length !== 3) {
            throw "Oh no! The date must be in mm/dd/yyyy format :(";
        }

        let [dateMonth, dateDay, dateYear] = splitDate;

        // Ensure the month and day only contain 2 chars, and year only contains 4
        if (dateMonth.length !== 2 || dateDay.length !== 2 || dateYear.length !== 4) {
            throw "Oh no! The month, day, and/or year is not valid format :(";
        }

        // Use parseInt to convert to int nums
        let numMonth = parseInt(dateMonth);
        let numDay = parseInt(dateDay);
        let numYear = parseInt(dateYear);

        // Ensure each is a number
        if (typeof numMonth !== "number"
            || isNaN(numMonth)
            || typeof numDay !== "number"
            || isNaN(numDay)
            || typeof numYear !== "number"
            || isNaN(numYear)) {
            throw "Oh no! The date contains invalid numbers :(";
        }

        // Ensure the range of the month is between 1-12
        if (numMonth < 1 || numMonth > 12) {
            throw "Oh no! The month must be valid :(";
        }

        // Find the max date day of each month
        let monthMaxDay;
        let isLeapYear = (numYear % 4 === 0) && ((numYear % 100 !== 0) || (numYear % 400 === 0));

        // February, check for leap years
        if (numMonth === 2) {
            if (isLeapYear) {
                monthMaxDay = 29;
            } else {
                monthMaxDay = 28;
            }

            // Check for April, June, Sept, and Nov
        } else if (numMonth === 4
            || numMonth === 6
            || numMonth === 9
            || numMonth === 11) {
            monthMaxDay = 30;

            // Otherwise, set max day to 31 for other months
        } else {
            monthMaxDay = 31;
        }

        // Ensure the day falls within the appropriate month
        if (numDay < 1 || numDay > monthMaxDay) {
            throw "Oh no! The day must be valid and fall within the appropriate month :(";
        }

        // Ensure the year is within the range 1900 and current year + 2
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let theLatestYear = currentYear + 2;
        if (numYear < 1900 || numYear > theLatestYear) {
            throw "Oh no! The year falls out of range :(";
        }

        return dateFormat;
    },

    checkActivityLevel(activityLevel, varName) {

        // Validations
        if (!activityLevel) {
            throw `Error: ${varName} is required`;
        }

        if (typeof activityLevel !== "string") {
            throw `Error: ${varName} must be a string`;
        }

        activityLevel = activityLevel.trim().toLowerCase();

        const allowedLevels = ["sedentary", "light", "moderate", "active", "very_active"];

        if (!allowedLevels.includes(activityLevel)) {
            throw `Error: ${varName} must be one of: ${allowedLevels.join(", ")}`;
        }

        return activityLevel;
    },

    checkDietGoal(dietGoal, varName) {
        if (!dietGoal) {
            throw `Error: ${varName} is required`;
        }

        if (typeof dietGoal !== "string") {
            throw `Error: ${varName} must be a string`;
        }

        dietGoal = dietGoal.trim().toLowerCase();

        const allowedGoals = ["lose", "maintain", "gain"];

        if (!allowedGoals.includes(dietGoal)) {
            throw `Error: ${varName} must be one of: ${allowedGoals.join(", ")}`;
        }

        return dietGoal;
    },
    validateString(str) {
        if(! str || typeof str !== 'string' || str.length < 0){
            throw "Input must be a non-empty string.";
        }
        return str.trim();
    },

    //function to validate user inputed appropriate post type for blogs
    validatePostType(str) {
        const PostType = {
            COMMENT: 'comment',
            REVIEW: 'review',
            PROGRESS: 'progress'
        };
        str = validateString(str);
        switch (str){
            case 'COMMENT':
                return PostType.COMMENT;
            case 'REVIEW':
                return PostType.REVIEW;
            case 'PROGRESS':
                return PostType.PROGRESS;
            default:
                throw new Error ('Enter a valid post type.');
        }
    }
};

export default exportedMethods;
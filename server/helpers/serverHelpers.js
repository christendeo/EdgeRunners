// Helpers for server side
import {ObjectId} from "mongodb";

const exportedMethods = {
    checkId(id, varName) {

        // Check if an id is provided
        if (!id) {
            throw new Error (`Error: You must provide a ${varName}`);
        }

        // Check if id is a string
        if (typeof id !== 'string') {
            throw new Error (`Error: ${varName} must be a string`);
        }

        id = id.trim();

        // Check if id is empty or only contains empty spaces
        if (id.length === 0) {
            throw new Error (`Error: ${varName} cannot be an empty string or just spaces`);
        }

        // Check if id is a valid ObjectID
        if (!ObjectId.isValid(id)) {
            throw new Error (`Error: ${varName} invalid object ID`);
        }

        return id;
    },

    checkName(strVal, varName) {

        // Check if a string is provided
        if (!strVal) {
            throw new Error (`Error: You must supply a ${varName}!`);
        }

        // Check if it is a string type
        if (typeof strVal !== 'string') {
            throw new Error (`Error: ${varName} must be a string!`);
        }

        strVal = strVal.trim();

        // Check if string is empty or only has spaces
        if (strVal.length === 0) {
            throw new Error (`Error: ${varName} cannot be an empty string or string with just spaces`);
        }

        // Check if the string has any digits
        if (/\d/.test(strVal)) {
            throw new Error (`Error: ${strVal} is not a valid value for ${varName} as it contains digits`);
        }

        // Ensure the name allows only letters, spaces, period, apostrophe, and hyphen
        if (!/^[A-Za-z .'-]+$/.test(strVal)) {
            throw new Error (`Error: ${strVal} is not a valid value for ${varName} as it should only contain letters, spaces, periods, apostrophes, and hyphens`);
        }

        return strVal;
    },

    checkString(strVal, varName) {
        // Check if a string is provided
        if (!strVal) {
            throw new Error (`Error: You must supply a ${varName}!`);
        }

        // Check if it is a string type
        if (typeof strVal !== 'string') {
            throw new Error (`Error: ${varName} must be a string!`);
        }

        strVal = strVal.trim();

        // Check if string is empty or only has spaces
        if (strVal.length === 0) {
            throw new Error (`Error: ${varName} cannot be an empty string or string with just spaces`);
        }

        return strVal;
    },

    checkPassword(password, varName) {
        if (!password) {
            throw new Error(`Error: ${varName} is required`);
        }

        if (typeof password !== "string") {
            throw new Error(`Error: ${varName} must be a string`);
        }

        password = password.trim();

        // Validations
        if (password.length < 8) {
            throw new Error(`Error: ${varName} must be at least 8 characters long`);
        }

        // No spaces allowed
        if (password.indexOf(" ") !== -1) {
            throw new Error(`Error: ${varName} cannot contain spaces`);
        }

        // At least one lowercase
        let hasLower = /[a-z]/.test(password);

        // At least one uppercase
        let hasUpper = /[A-Z]/.test(password);

        // At least one digit
        let hasDigit = /[0-9]/.test(password);

        // At least one special character
        let hasSpecial = /[^A-Za-z0-9]/.test(password);

        if (!hasLower || !hasUpper || !hasDigit || !hasSpecial) {
            throw new Error(
                `Error: ${varName} must contain at least one lowercase letter, one uppercase letter, one number, and one special character`
            );
        }

        return password;
    },

    validateString (str, name, minLength = 1, maxLength = 100) {
        if (!str || typeof str !== 'string' || str.trim().length === 0) {
            throw new Error(`${name} must be a non-empty string`);
        }
        if (str.trim().length < minLength) {
            throw new Error(`${name} must be at least ${minLength} characters long`);
        }
        if (maxLength && str.trim().length > maxLength) {
            throw new Error(`${name} must be at most ${maxLength} characters long`);
        }

        if (name === 'name' && !/^[a-zA-Z .'-]+$/.test(str)) {

            throw new Error('Name can only contain letters, hyphens, apostrophes and periods.')

        }
        if (name === 'username' && !/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(str)) {

            throw new Error('Username can only contain letters and numbers.')

        }

        return str.trim();
    },

    validateNumber (value, fieldName, min = 0, max = null) {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error(`${fieldName} must be a valid number`);
        }
        if (value < min) {
            throw new Error(`${fieldName} must be at least ${min}`);
        }
        if (max !== null && value > max) {
            throw new Error(`${fieldName} must be no more than ${max}`);
        }
        return value;
    },

    validateBoolean (value, fieldName) {
        if (typeof value !== 'boolean') {
            throw new Error(`${fieldName} must be true or false`);
        }

        return value;
    },

    checkEmailAddress(email, varName) {

        // Check if the email was even provided and is a String
        email = this.checkString(email, "Email Address");

        // Check if email address is valid using Regex
        let emailRegexValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegexValid.test(email)) {
            throw new Error (`Error: The ${varName} you provided: ${email} is not valid :(`);
        }

        return email;
    },

    checkDateFormat(dateFormat, varName) {

        // Check if the date was even provided and is a String
        dateFormat = this.checkString(dateFormat, varName);

        // Check if date is valid using Regex
        let dateRegexValid = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegexValid.test(dateFormat)) {
            throw new Error (`Error: The date format you provided: ${dateFormat} is not valid :(`);
        }

        // Split date into three parts
        let splitDate = dateFormat.split("/");
        if (splitDate.length !== 3) {
            throw new Error ("Oh no! The date must be in mm/dd/yyyy format :(");
        }

        let [dateMonth, dateDay, dateYear] = splitDate;

        // Ensure the month and day only contain 2 chars, and year only contains 4
        if (dateMonth.length !== 2 || dateDay.length !== 2 || dateYear.length !== 4) {
            throw new Error ("Oh no! The month, day, and/or year is not valid format :(");
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
            throw new Error ("Oh no! The date contains invalid numbers :(");
        }

        // Ensure the range of the month is between 1-12
        if (numMonth < 1 || numMonth > 12) {
            throw new Error ("Oh no! The month must be valid :(");
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
            throw new Error ("Oh no! The day must be valid and fall within the appropriate month :(");
        }

        // Ensure the year is within the range 1900 and current year + 2
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let theLatestYear = currentYear + 2;
        if (numYear < 1900 || numYear > theLatestYear) {
            throw new Error ("Oh no! The year falls out of range :(");
        }

        return dateFormat;
    },

    checkHeight(heightValue, varName) {

        // Validations
        if (heightValue === undefined || heightValue === null) {
            throw new Error (`Error: ${varName} is required`);
        }

        if (typeof heightValue !== "number") {
            throw new Error (`Error: ${varName} must be a number`);
        }

        // Typical adult range height, between 3' 11" and 8' 11" - can be changed later
        if (heightValue < 120 || heightValue > 250) {
            throw new Error (`Error: ${varName} must be between 120 and 250 centimeters`);
        }

        return heightValue;
    },

    // Weight in KG
    checkWeight(weightValue, varName) {

        // Validations
        if (weightValue === undefined || weightValue === null) {
            throw new Error (`Error: ${varName} is required`);
        }

        if (typeof weightValue !== "number") {
            throw new Error (`Error: ${varName} must be a number`);
        }

        // Reasonable adult range in kg - can be changed later
        if (weightValue < 30 || weightValue > 400) {
            throw new Error (`Error: ${varName} must be between 30 and 400 kilograms`);
        }

        return weightValue;
    },

    checkActivityLevel(activityLevel, varName) {

        // Validations
        if (!activityLevel) {
            throw new Error (`Error: ${varName} is required`);
        }

        if (typeof activityLevel !== "string") {
            throw new Error (`Error: ${varName} must be a string`);
        }

        activityLevel = activityLevel.trim().toLowerCase();

        const allowedLevels = ["sedentary", "light", "moderate", "active", "very_active"];

        if (!allowedLevels.includes(activityLevel)) {
            throw new Error (`Error: ${varName} must be one of: ${allowedLevels.join(", ")}`);
        }

        return activityLevel;
    },

    checkDietGoal(dietGoal, varName) {
        if (!dietGoal) {
            throw new Error (`Error: ${varName} is required`);
        }

        if (typeof dietGoal !== "string") {
            throw new Error (`Error: ${varName} must be a string`);
        }

        dietGoal = dietGoal.trim().toLowerCase();

        const allowedGoals = ["lose", "maintain", "gain"];

        if (!allowedGoals.includes(dietGoal)) {
            throw new Error (`Error: ${varName} must be one of: ${allowedGoals.join(", ")}`);
        }

        return dietGoal;
    },

    // Check for the user's sex and use it for caclulating BMR with the
    // Mifflin–St Jeor BMR formula:
    // male: 10*kg + 6.25*cm - 5*age + 5
    // female: 10*kg + 6.25*cm - 5*age - 161

    checkSex(sexCheck, varName) {
        if (!sexCheck) {
            throw new Error (`Error: ${varName} is required`);
        }

        if (typeof sexCheck !== "string") {
            throw new Error (`Error: ${varName} must be a string`);
        }

        const normalizedSex = sexCheck.trim().toLowerCase();
        const allowedSex = ["male", "female"];

        if (!allowedSex.includes(normalizedSex)) {
            throw new Error (`Error: ${varName} must be one of: ${allowedSex.join(", ")}`);
        }

        return normalizedSex;
    },

    //function to validate user inputed appropriate post type for blogs
    validatePostType(str) {
        const PostType = {
            COMMENT: 'Comment',
            REVIEW: 'Review',
            PROGRESS: 'Progress Update'
        };
        str = checkString(str, 'Post Type');
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
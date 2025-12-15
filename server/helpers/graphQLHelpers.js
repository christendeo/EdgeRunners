import {GraphQLError} from 'graphql';
import {ObjectId} from 'mongodb';

export const throwGraphQLError = (message, code) => {
	throw new GraphQLError(message, {
		extensions: { code: code }
	});
};

export const validateString = (str, fieldName, minLength = 2, maxLength = 100) => {
    if (!str || typeof str !== 'string') {
		throwGraphQLError(`${fieldName} must be a string`, 'BAD_USER_INPUT');
	}
	
	str = str.trim();
	if (str.length < minLength) {
        throwGraphQLError(`${fieldName} must be at least ${minLength} characters long`, 'BAD_USER_INPUT');
    }
	
	if (str.length > maxLength) {
		throwGraphQLError(`${fieldName} must be no more than ${maxLength} characters long`, 'BAD_USER_INPUT');
    }
	
    const nameFields = ['first_name', 'last_name', 'department', 'major'];
    if (nameFields.includes(fieldName) && !/^[a-zA-Z ]+$/.test(str)) {
		throwGraphQLError(`${fieldName} can only contain letters`, 'BAD_USER_INPUT');
    }

    const nameFieldsWithNums = ['course_name', 'office'];
    if (nameFieldsWithNums.includes(fieldName) && !/^[a-zA-Z0-9 ]+$/.test(str)) {
		throwGraphQLError(`${fieldName} can only contain letters or numbers`, 'BAD_USER_INPUT');
    }
    
    return str;
};

export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        throwGraphQLError('Email must be a non-empty string', 'BAD_USER_INPUT');
    }

    const trimmed = email.trim();
    if (!trimmed) {
        throwGraphQLError(`${email} must be a non-empty string`, 'BAD_USER_INPUT');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
        throwGraphQLError(`Email must be a valid email address.`, 'BAD_USER_INPUT');
    }

    return trimmed;
};

export const validateDate = (date, fieldName) => {
    if (!date || typeof date !== 'string' || date.trim().length === 0) {
		throwGraphQLError(`${fieldName} must be a non-empty string`, 'BAD_USER_INPUT');
    }

    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/;
    if (!dateRegex.test(date.trim())) {
		throwGraphQLError('Date must be in the proper MM/DD/YYYY format', 'BAD_USER_INPUT');
	}

	const [month, day, year] = date.split('/').map(Number);
	const dateObj = new Date(year, month - 1, day);
	if (dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day || dateObj.getFullYear() !== year) {
		throwGraphQLError('not a valid date', 'BAD_USER_INPUT');
	}

	return date.trim(); 
};

export const validateNumber = (value, fieldName, min = 0, max = null) => {
    if (typeof value !== 'number' || isNaN(value)) {
        throwGraphQLError(`${fieldName} must be a valid number`, 'BAD_USER_INPUT');
    }

    if (value < min) {
        throwGraphQLError(`${fieldName} must be at least ${min}`, 'BAD_USER_INPUT');
    }

    if (max !== null && value > max) {
        throwGraphQLError(`${fieldName} must be no more than ${max}`, 'BAD_USER_INPUT');
    }

    return value;
};

export const validateId = (id) => {
	if (!id || typeof id !== 'string') {
		throwGraphQLError("You must provide an ID string", 'BAD_USER_INPUT');
	}

	id = id.trim();
	if (id.length === 0) {
		throwGraphQLError("ID string must not be empty", 'BAD_USER_INPUT');
	}

	if (!ObjectId.isValid(id)) {
		throwGraphQLError(`Invalid object ID ${id}`, 'BAD_USER_INPUT');
	}

	return id;
};

const graphQLHelpers = { throwGraphQLError, validateString, validateNumber, validateDate, validateEmail, validateId }

export default graphQLHelpers;

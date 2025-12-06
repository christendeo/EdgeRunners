import {GraphQLError} from 'graphql';

export const validateString = (str, fieldName, minLength = 2, maxLength = 100) => {
    if (!str || typeof str !== 'string') throw new GraphQLError(`${fieldName} must be a string`);
    
    if (str.trim().length < minLength) {
        throw new GraphQLError(`${fieldName} must be at least ${minLength} characters long`);
    }
    if (str.trim().length > maxLength) {
        throw new GraphQLError(`${fieldName} must be no more than ${maxLength} characters long`);
    }
    const nameFields = ['first_name', 'last_name', 'department', 'major'];
    if (nameFields.includes(fieldName) && !/^[a-zA-Z ]+$/.test(str)) {
      throw new GraphQLError(`${fieldName} can only contain letters`,
        {
            extensions: { code: 'BAD_USER_INPUT' }
        }
      );
    }
    const nameFieldsWithNums = ['course_name', 'office'];
    if (nameFieldsWithNums.includes(fieldName) && !/^[a-zA-Z0-9 ]+$/.test(str)) {
      throw new GraphQLError(`${fieldName} can only contain letters or numbers`,
        {
            extensions: { code: 'BAD_USER_INPUT' }
        }
      );
    }
    
    
    return str.trim();
};

export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        throw new GraphQLError('Email must be a non-empty string',
            {
                extensions: {code: 'BAD_USER_INPUT'}
            }
        )
    }
    const trimmed = email.trim();
    if (!trimmed) {
        throw new GraphQLError(`${email} must be a non-empty string`,
            {
                extensions: {code: 'BAD_USER_INPUT'}
            }
        );
    }
    
    
    

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
        throw new GraphQLError(`Email must be a valid email address.`,
            {
                extensions: {code: 'BAD_USER_INPUT'}
            }
        );

    }
    return trimmed;
};



export const validateDate = (date, fieldName) => {
    
    if (!date || typeof date !== 'string' || date.trim().length === 0) {
        throw new GraphQLError(`${fieldName} must be a non-empty string`,
            {
                extensions: {code: 'BAD_USER_INPUT'}
            }
        );
    }

    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/;
    if (!dateRegex.test(date.trim())) {
        throw new GraphQLError('Date must be in the proper MM/DD/YYYY format',
            {
                extensions: {code: 'BAD_USER_INPUT'}
            }
        );
      }
      const [month, day, year] = date.split('/').map(Number);
      
      const dateObj = new Date(year, month - 1, day);
      if (dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day || dateObj.getFullYear() !== year) {
        throw new GraphQLError('not a valid date',
            {
                extensions: {code: 'BAD_USER_INPUT'}
            }
        );
      }

      return date.trim(); 
};

export const validateNumber = (value, fieldName, min = 0, max = null) => {
    if (typeof value !== 'number' || isNaN(value)) {
        throw new GraphQLError(`${fieldName} must be a valid number`, {
            extensions: { code: 'BAD_USER_INPUT' }
        });
    }
    if (value < min) {
        throw new GraphQLError(`${fieldName} must be at least ${min}`, {
            extensions: { code: 'BAD_USER_INPUT' }
        });
    }
    if (max !== null && value > max) {
        throw new GraphQLError(`${fieldName} must be no more than ${max}`, {
            extensions: { code: 'BAD_USER_INPUT' }
        });
    }
    return value;
};


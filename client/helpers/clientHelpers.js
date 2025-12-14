// Helpers for client side
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
};
export default exportedMethods;
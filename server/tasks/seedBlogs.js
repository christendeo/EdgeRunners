import dbConnection from '../config/mongoConnection.js';
import {users, blogs} from '../config/mongoCollections.js';
import {ObjectId} from "mongodb";

export const seedBlogs = async () => {
    const db = await dbConnection();
    const usersCollection = await users();
    const blogsCollection = await blogs();

    //add a user
    let user;
    try {
        user = await usersCollection.insertOne('Jane', 'Doe', 'janedoe@gmail.com', '01/01/1999', 65, 140, 'light', 'maintain', 2000);
    } catch (error) {
        console.log("Error running user creation in seedBlogs.js: " + error.message);
    }

    try {
        await blogsCollection.insertMany([
            {
                user_id: user._id.toString(),
                title: 'Progress Update',
                content: 'My progress has come a long way!', 
                post_type: 'PROGRESS',
                created_at: '12/09/2025',
                updated_at: '12/09/2025'
            },
            {
                user_id: user._id.toString(),
                title: 'Review',
                content: 'I give this site a 10 out of 10!', 
                post_type: 'REVIEW',
                created_at: '01/25/2025',
                updated_at: '01/25/2025'
            },
            {
                user_id: user._id.toString(),
                title: 'Any Insights?',
                content: 'Has anyone tried this meal idea?', 
                post_type: 'COMMENT',
                created_at: '03/10/2025',
                updated_at: '04/09/2025'
            },

        ]);
    } catch (error) {
        console.log("Error running blog creation in seedBlogs.js: " + error.message);
    } 
}

seedBlogs();
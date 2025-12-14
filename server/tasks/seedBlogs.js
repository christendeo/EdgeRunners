import {dbConnection} from '../config/mongoConnection.js';
import {blogs} from '../config/mongoCollections.js';
import { addUser } from '../data/userCollection.js';


export const seedBlogs = async () => {
    const db = await dbConnection();
    const blogsCollection = await blogs();

    //add a user
    let user;
    try {
            user = await addUser('Jane', 'Doe', 'janedoe@gmail.com', 'JaneDoe1!', 'female', '01/01/1999', 200, 200, 'light', 'maintain');
    } catch (error) {
            if(!user) throw new Error("Error running user creation in seedBlogs.js: " + error.message);
    }

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
}

seedBlogs();
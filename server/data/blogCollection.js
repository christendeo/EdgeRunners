// Blog Collection CRUD
import {ObjectId} from 'mongodb';
import { blogs } from '../config/mongoCollections.js';
import { users } from '../config/mongoCollections.js';
import * as helpers from '../helpers/serverHelpers.js'

export const getAllBlogs = async () => {
    const blogsCollection = await blogs();
    const blogList = await blogsCollection.find({}).toArray();
    if(!blogList){
        throw new Error ("Blogs could not be found");
    }
    return blogList;
}

export const getBlogById = async (id) => {
    try {
        id = helpers.checkId(id, 'Blog post ID');
    } catch (e) {
        throw new Error (e);
    }
    const blogsCollection = await blogs();
    const blog = await blogsCollection.find({_id: new ObjectId(id)});
    if(!blog){
        throw new Error ('Blog Post Not Found');
    }
    return blog;
}

export const getBlogsByUserId = async (userId) => {
    try {
        userId = helpers.checkId(userId, "User ID");
    } catch (e) {
        throw new Error (e);
    }
    const blogsCollection = await blogs();
    const userBlogs = await blogsCollection.find({user_id: new ObjectId(userId)}).toArray();
    if(!userBlogs){
        throw new Error("posts could not be found");
    }
    return userBlogs;
}

export const createBlog = async (userId, title, content, postType) => {
    //user_id, title, content, post_type
    try {
        userId = helpers.checkId(userId, "User ID");
        title = helpers.checkString(title, 'Title');
        content = helpers.checkString(content, 'Content');
        postType = helpers.validatePostType(postType);
    } catch (e) {
        throw new Error (e);
    }

    const usersCollection = await users();
    let user = await usersCollection.getUserById(userId);
    if(!user) throw new Error ('A user with this ID does not exist.');

    //create the date and format it as MM/DD/YYYY
    let date = new Date(); 
    let dateStr = `${date.toLocaleString('default', {month: '2-digit'})}/${date.toLocaleString('default', {day: '2-digit'})}/${date.getFullYear()}`;
    const newBlog = {
        user_id: userId,
        title: title,
        content: content, 
        post_type: postType,
        created_at: dateStr,
        updated_at: dateStr
    };

    const blogsCollection = await blogs();
    const blog = await blogsCollection.insertOne(newBlog);

    if (!blog.acknowledged || !blog.insertedId) {
        throw new Error ('Could not add new blog post');
    }

    return await blogsCollection.findOne({_id: blog.insertedId});
}

//takes in the objectID of the blog post and an object updateInfo containing any fields that may be updated
export const updateBlog = async (id, userId, updateInfo) => {
    let blog;

    try {
       id = helpers.checkId(id, 'Blog post ID');
       userId = helpers.checkId(userId, "User ID");
    } catch (e) {
        throw new Error (e);
    }

    const blogsCollection = await blogs();
    blog = await blogsCollection.findOne({_id: new ObjectId(id)});     

    if(blog){
        if(blog.user_id.toString() !== userId) throw new Error ("Edits can only be made by the user who created this post.");
        //updateable fields: title, content, post_type, updated_at
        try {
            if(updateInfo.title){
                blog.title = helpers.checkString(updateInfo.title, 'Title');
            }
            if(updateInfo.content){
                blog.content = helpers.checkString(updateInfo.content, 'Content');
            }
            if(updateInfo.post_type){
                blog.post_type = helpers.validatePostType(updateInfo.post_type);
            }
        } catch (e) {
            throw new Error (e);
        }
    } else {
        throw new Error (`Could not find blog post`);
    }

    //create the date and format it as MM/DD/YYYY
    let date = new Date(); 
    let dateStr = `${date.toLocaleString('default', {month: '2-digit'})}/${date.toLocaleString('default', {day: '2-digit'})}/${date.getFullYear()}`;
    blog.updated_at = dateStr;

    await blogsCollection.updateOne({_id: new ObjectId(id)}, {"$set": blog});
    const update = await blogsCollection.findOne({_id: new ObjectId(id)});

    return update;
}

export const deleteBlog = async (id, userId) => {
    try {
       id = helpers.checkId(id, 'Blog post ID');
       userId = helpers.checkId(userId, "User ID");
    } catch (e) {
        throw new Error (e);
    }

    const blogsCollection = await blogs();
    let blog = await blogsCollection.findOne({_id: new ObjectId(id)});
    if(blog.user_id.toString() !== userId) throw new Error ("Only the user who created this post can delete it.");

    blog = await blogsCollection.findOneAndDelete({_id: new ObjectId(id)});

    if(!blog){
        throw new Error (`Could not delete blog post`);
    }
    return blog;
}
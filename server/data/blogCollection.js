// Blog Collection CRUD
import {ObjectId} from 'mongodb';
import blogs from '../config/mongoCollections.js';
import users from '../config/mongoCollections.js';
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
        id = helpers.validateString(id);
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
        userId = helpers.validateString(userId);
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
        userId = helpers.validateString(userId);
        title = helpers.validateString(title);
        content = helpers.validateString(content);
        postType = helpers.validatePostType(postType);
    } catch (e) {
        throw new Error (e);
    }

    try {
        const usersCollection = await users();
        let user = await usersCollection.getUserById(userId);
        if(!user) throw 'A user with this ID does not exist.';
    } catch (e) {
        throw new Error (e);
    }

    let date = new Date().toISOString();
    const newBlog = {
        user_id: userId,
        title: title,
        content: content, 
        post_type: postType,
        created_at: date,
        updated_at: date
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
       id = helpers.validateString(id);
       userId = helpers.validateString(userId); 
    } catch (e) {
        throw new Error (e);
    }

    const blogsCollection = await blogs();
    blog = await blogsCollection.findOne({_id: new ObjectId(id)});     

    if(blog){
        if(blog.user_id.toString() !== userId) throw "Edits can only be made by the user who created this post.";
        //updateable fields: title, content, post_type, updated_at
        try {
            if(updateInfo.title){
                blog.title = helpers.validateString(updateInfo.title);
            }
            if(updateInfo.content){
                blog.content = helpers.validateString(updateInfo.content);
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

    blog.updated_at = new Date().toISOString();

    await blogsCollection.updateOne({_id: new ObjectId(id)}, {"$set": blog});
    const update = await blogsCollection.findOne({_id: new ObjectId(id)});

    return update;
}

export const deleteBlog = async (id, userId) => {
    try {
       id = helpers.validateString(id); 
       userId = helpers.validateString(userId); 
    } catch (e) {
        throw new Error (e);
    }

    const blogsCollection = await blogs();
    let blog = await blogsCollection.findOne({_id: new ObjectId(id)});
    if(blog.user_id.toString() !== userId) throw "Only the user who created this post can delete it.";

    blog = await blogsCollection.findOneAndDelete({_id: new ObjectId(id)});

    if(!blog){
        throw new Error (`Could not delete blog post`);
    }
    return blog;
}
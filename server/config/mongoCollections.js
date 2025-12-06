//Import connection from mongoDB
//Define collection schema

import {dbConnection} from './mongoConnection.js';


const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};


export const users = getCollectionFn('users');
export const foods = getCollectionFn('foods');
export const meals = getCollectionFn('meals');
export const foodLogs = getCollectionFn('foodLogs');
export const blogs = getCollectionFn('blogs');

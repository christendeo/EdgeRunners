import foodResolvers from './foods.js';
import userResolvers from './users.js';
import mealResolvers from './meals.js';
import foodLogResolvers from './foodLogs.js';
import blogResolvers from './blogs.js';
import lodash from 'lodash';

const { merge } = lodash;

export default merge({}, foodResolvers, userResolvers, mealResolvers, foodLogResolvers, blogResolvers);
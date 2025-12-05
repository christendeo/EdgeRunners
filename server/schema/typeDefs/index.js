import foodTypeDefs from './foods.js';
import userTypeDefs from './users.js';
import mealTypeDefs from './meals.js';
import foodLogTypeDefs from './foodLogs.js';
import blogTypeDefs from './blogs.js';

const rootTypeDefs = `#graphql
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

export default [rootTypeDefs, foodTypeDefs, userTypeDefs, mealTypeDefs, foodLogTypeDefs, blogTypeDefs];
//Create and run server
//Import all backend functions and middleware
//Run application
import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';

import typeDefs from './schema/typeDefs/index.js';
import resolvers from './schema/resolvers/index.js';

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const {url} = await startStandaloneServer(server, {
  listen: {port: 4000}
});

console.log(`🚀  Server ready at: ${url}`);
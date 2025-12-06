//Create and run server
//Import all backend functions and middleware
//Run application
import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';

import typeDefs from './schema/typeDefs/index.js';
import resolvers from './schema/resolvers/index.js';
import redisClient, {connectRedis} from "./config/redisConnection.js";

async function start() {

    // Connect to Redis
    await connectRedis();

    let redisStatus = "Not Connected";
    if (redisClient && redisClient.isOpen) {
        redisStatus = "Connected";
    }

    // Then create Apollo server
    let apolloServer = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers
    });

    // Start server
    let serverResult = await startStandaloneServer(apolloServer, {
        listen: {port: 4000},
        context: async function () {
            return {
                redis: redisClient
            };
        }
    });

    let pageUrl = serverResult.url;

    console.log("🚀 Redis Client Status: " + redisStatus);
    console.log("🚀 GraphQL server ready at: " + pageUrl);
}

// In case it fails to start
start().catch(function (e) {
    console.error("Could not start Apollo server", e);
});
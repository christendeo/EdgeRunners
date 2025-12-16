//Create and run server
//Import all backend functions and middleware
//Run application
import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';

import typeDefs from './schema/typeDefs/index.js';
import resolvers from './schema/resolvers/index.js';
import redisClient, {connectRedis} from "./config/redisConnection.js";
import {users} from "./config/mongoCollections.js";
import { getAuthenticatedUser } from './helpers/authContext.js';

// Create user indexes once at startup
const ensureUserIndexes = async () => {
    const userCollection = await users();
    await userCollection.createIndex(
        { email: 1 },
        { unique: true }
    );
};

async function start() {

    // Connect to Redis
    await connectRedis();

    // Ensure user indexes (Mongo)
    await ensureUserIndexes();

    const redisStatus = redisClient && redisClient.isOpen ? 'Connected' : 'Not Connected';

    // Then create Apollo server
    const apolloServer = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers
    });

    // Start server
    const serverResult = await startStandaloneServer(apolloServer, {
        listen: {port: 4000},
        context: async function ({ req }) {
            const user = getAuthenticatedUser(req);
			return {
				redis: redisClient,
				user: user
			}
        }
    });

    console.log("🚀 Redis Client Status: " + redisStatus);
    console.log("🚀 GraphQL server ready at: " + serverResult.url);
}

// In case it fails to start
start().catch(function (e) {
    console.error("Could not start Apollo server", e);
});
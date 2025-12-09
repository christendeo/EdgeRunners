//Create redis client connection
//import redis library
//Connect to Redis instance onn loacalhost
//Export redis client
// Handle connection errors
import {createClient} from "redis";

// Similar to Lab 3, create our client
let redisClient = createClient();

// Console logs to check that Redis is actually working
redisClient.on("connect", () => {
    console.log("Yay! Redis connect event is successful :D");
});

redisClient.on("ready", () => {
    console.log("Yay! Redis ready event is successful :D");
});

redisClient.on("error", (e) => {
    console.log("Oh no! Redis could not connect :(", e);
});

export async function connectRedis() {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (e) {
        console.error("Oh no! Redis could not connect :(", e);
    }
}

export async function getCache(redisKey) {
    let redisData = await redisClient.get(redisKey);
    if (!redisData) {
        return null;
    }

    // Display JSON
    try {
        return JSON.parse(redisData);
    } catch (e) {
        return null;
    }
}

export async function setCache(redisKey, redisValue, ttl = 3600) {
    let redisString = JSON.stringify(redisValue);
    if (ttl) {
        await redisClient.set(redisKey, redisString, 'EX', ttl); 
    } else {
        await redisClient.set(redisKey, redisString);
    }
}

export async function flushCache() {
    await client.flushAll();
}

export async function deleteCache(redisKey) {
    await redisClient.del(redisKey);
}

export default redisClient;
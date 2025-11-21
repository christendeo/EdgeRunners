//Create instances of mongo, redis, and elasticSearch to be imported and called as needed

export const mongoConfig = {
  serverUrl: 'mongodb://localhost:27017/',
  database: 'graphql'
};

export const redisConfig = {
  host: 'localhost',
  port: 6379
};

export const elasticConfig = {
  node: 'http://localhost:9200',
  // Optional: index names to be added later
  
  
};
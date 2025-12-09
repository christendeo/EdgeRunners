//Create instances of mongo, redis, and elasticSearch to be imported and called as needed

export const mongoConfig = {
  serverUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/',
  database: 'edgerunners'
};

export const redisConfig = {
  host: 'localhost',
  port: 6379
};

export const elasticConfig = {
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  // Optional: index names to be added later
  
  
};
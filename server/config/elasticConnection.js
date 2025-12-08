//Establish connection to elasticSearch
//Import elasticSearch Client
// Export client
import { Client } from '@elastic/elasticsearch';
const client = new Client({
  node: 'http://localhost:9200'
  
});

export { client };
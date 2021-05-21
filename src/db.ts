import { Pool } from 'pg';

console.log(process.env.DATABASE_URL);
const client = new Pool({
  connectionString: process.env.DATABASE_URL,
});
client.connect();

export default client;

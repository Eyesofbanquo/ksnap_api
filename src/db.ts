import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const client = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default client;

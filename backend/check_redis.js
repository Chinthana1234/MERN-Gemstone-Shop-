import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

async function run() {
  const client = createClient({ url: redisUrl });
  client.on('error', (err) => console.log('Redis Client Error', err));
  
  await client.connect();
  console.log('Connected to Redis!');
  
  const keys = await client.keys('products:*');
  console.log(`Found ${keys.length} product cache keys:`);
  for (const key of keys) {
    const val = await client.get(key);
    console.log(`Key: "${key}"`);
    console.log(`Value snippet: ${val ? val.substring(0, 100) : 'null'}...`);
  }
  
  await client.disconnect();
}

run();

import { clearProductCache, redisClient } from './utils/redis.js';

async function run() {
  try {
    console.log('Clearing Redis cache...');
    await clearProductCache();
    console.log('Cache cleared successfully!');
  } catch (err) {
    console.error('Error clearing cache:', err);
  } finally {
    if (redisClient) {
      try {
        await redisClient.quit();
      } catch (err) {
        try {
          await redisClient.disconnect();
        } catch (discErr) {
          // ignore
        }
      }
    }
    process.exit();
  }
}

run();

import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let redisClient = null;
let isRedisConnected = false;

try {
  redisClient = createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 3) {
          console.warn('Redis reconnection failed. Falling back to MongoDB.');
          isRedisConnected = false;
          return false; // Stop reconnecting after 3 retries
        }
        return Math.min(retries * 500, 2000); // Backoff strategy
      }
    }
  });

  redisClient.on('connect', () => {
    console.log('Connecting to Redis...');
  });

  redisClient.on('ready', () => {
    console.log('Redis Client Connected successfully');
    isRedisConnected = true;
  });

  redisClient.on('error', (err) => {
    console.warn('Redis client disconnected or down. Warning: ', err.message);
    isRedisConnected = false;
  });

  redisClient.on('end', () => {
    console.warn('Redis connection closed.');
    isRedisConnected = false;
  });

  // Proactively connect to Redis asynchronously
  redisClient.connect().catch((err) => {
    console.warn('Failed to make initial Redis connection. Continuing without Redis cache: ', err.message);
    isRedisConnected = false;
  });
} catch (err) {
  console.error('Error instantiating Redis client: ', err);
}

// Utility cache helper methods
export const getCache = async (key) => {
  if (!isRedisConnected || !redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`Error reading key "${key}" from Redis cache:`, err);
    return null;
  }
};

export const setCache = async (key, value, durationSeconds = 3600) => {
  if (!isRedisConnected || !redisClient) return false;
  try {
    const stringValue = JSON.stringify(value);
    await redisClient.set(key, stringValue, {
      EX: durationSeconds,
    });
    return true;
  } catch (err) {
    console.error(`Error setting key "${key}" in Redis cache:`, err);
    return false;
  }
};

export const clearCachePattern = async (pattern) => {
  if (!isRedisConnected || !redisClient) return false;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys && keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (err) {
    console.error(`Error clearing cache pattern "${pattern}":`, err);
    return false;
  }
};

export const clearProductCache = async (productId) => {
  try {
    if (productId && isRedisConnected && redisClient) {
      await redisClient.del(`products:single:${productId}`);
    }
    await clearCachePattern('products:listings:*');
    console.log(`Redis cache invalidated for product ID: ${productId || 'all'}`);
    return true;
  } catch (err) {
    console.error('Error invalidating product cache:', err);
    return false;
  }
};

export { redisClient, isRedisConnected };

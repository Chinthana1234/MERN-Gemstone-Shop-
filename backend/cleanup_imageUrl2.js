import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import { clearProductCache, redisClient } from './utils/redis.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const run = async () => {
  try {
    await connectDB();

    // Use updateMany to unset the imageUrl2 field from all products
    const result = await Product.updateMany(
      {},
      { $unset: { imageUrl2: "" } }
    );

    console.log(`Successfully unset imageUrl2 from database. Modified count: ${result.modifiedCount}`);

    // Clear Redis Cache
    try {
      console.log('Invalidating product cache in Redis...');
      await clearProductCache();
      console.log('Redis cache cleared successfully.');
    } catch (cacheErr) {
      console.warn('Could not clear Redis cache:', cacheErr.message);
    }

  } catch (error) {
    console.error('Error removing imageUrl2 field:', error);
  } finally {
    if (redisClient) {
      try {
        await redisClient.quit();
      } catch (err) {
        try {
          await redisClient.disconnect();
        } catch (dErr) {}
      }
    }
    mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit();
  }
};

run();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { autoSeedJewelry } from './autoSeed.js';
import Product from './models/Product.js';

dotenv.config();

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Count before seeding
    const initialCount = await Product.countDocuments({ category: { $in: ['Rings', 'Necklaces', 'Earrings', 'Bracelets'] } });
    console.log(`Initial count of jewelry items in DB: ${initialCount}`);

    console.log('Running autoSeedJewelry...');
    await autoSeedJewelry();

    // Verify final count
    const finalCount = await Product.countDocuments({ category: { $in: ['Rings', 'Necklaces', 'Earrings', 'Bracelets'] } });
    console.log(`Final count of jewelry items in DB: ${finalCount}`);

    // Print distinct products by category
    const categories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets'];
    for (const cat of categories) {
      const count = await Product.countDocuments({ category: cat });
      console.log(`- ${cat}: ${count} products`);
    }

  } catch (err) {
    console.error('Error running trigger_seed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit();
  }
};

run();

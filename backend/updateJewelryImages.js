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

// Map jewelry product names to high-quality secondary Unsplash image URLs
const secondaryImageMap = {
  '18K White Gold Sapphire Halo Ring': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
  '18K Yellow Gold Ruby Solitaire Ring': 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&w=600&q=80',
  'Platinum Emerald and Diamond Three-Stone Ring': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
  'Vintage Ruby & Diamond Pendant Necklace': 'https://images.unsplash.com/photo-1611085583191-a3b1a308c02f?auto=format&fit=crop&w=600&q=80',
  'Classic Emerald Pendant in 18K Gold': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
  'Emerald Cut Sapphire Drop Earrings': 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
  'Natural Ruby Halo Stud Earrings': 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80',
  'Sapphire & Diamond Line Tennis Bracelet': 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80',
  'Classic Ruby & Gold Link Bracelet': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80'
};

const defaultJewelrySecondary = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';

const run = async () => {
  try {
    await connectDB();

    const jewelryCategories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets'];
    
    // Find all products that fall under jewelry categories or have carat: 0
    const products = await Product.find({
      $or: [
        { category: { $in: jewelryCategories } },
        { carat: 0 }
      ]
    });

    console.log(`Found ${products.length} jewelry products in database.`);

    let updatedCount = 0;

    for (const product of products) {
      const secondaryUrl = secondaryImageMap[product.name] || defaultJewelrySecondary;
      
      product.imageUrl2 = secondaryUrl;
      await product.save();
      
      console.log(`Updated jewelry item: "${product.name}" with secondary image URL.`);
      updatedCount++;
    }

    console.log(`Successfully updated ${updatedCount} jewelry items.`);

    // Clear Redis Cache
    try {
      console.log('Invalidating product cache in Redis...');
      await clearProductCache();
      console.log('Redis cache cleared successfully.');
    } catch (cacheErr) {
      console.warn('Could not clear Redis cache:', cacheErr.message);
    }

  } catch (error) {
    console.error('Error updating jewelry images:', error);
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

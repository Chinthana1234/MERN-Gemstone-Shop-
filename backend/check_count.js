import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Product.countDocuments();
    const jewelryCount = await Product.countDocuments({category: {$in: ['Rings', 'Necklaces', 'Earrings', 'Bracelets']}});
    const gemCount = await Product.countDocuments({category: {$nin: ['Rings', 'Necklaces', 'Earrings', 'Bracelets']}});
    
    console.log('Total products:', count);
    console.log('Jewelry products:', jewelryCount);
    console.log('Gem products:', gemCount);
    
    await mongoose.disconnect();
}
run();

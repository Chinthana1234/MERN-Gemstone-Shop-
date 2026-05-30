import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function checkImages() {
    try {
        await mongoose.connect(MONGO_URI);
        const products = await Product.find({}).limit(5);
        console.log('Seeded products sample:');
        products.forEach(p => {
            console.log(`- Name: ${p.name}`);
            console.log(`  Category: ${p.category}`);
            console.log(`  ImageUrl: ${p.imageUrl}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkImages();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Order from './models/Order.js';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function run() {
    try {
        console.log('Connecting to Mongo...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        const products = await Product.find({});
        console.log(`Found ${products.length} products.`);

        const orders = await Order.find({});
        console.log(`Found ${orders.length} orders.`);

        let totalReviews = 0;
        products.forEach(p => {
            if (p.reviews && p.reviews.length > 0) {
                totalReviews += p.reviews.length;
                console.log(`Product "${p.name}" has ${p.reviews.length} reviews:`);
                p.reviews.forEach(r => {
                    console.log(`  - User: ${r.name}, Rating: ${r.rating}, Comment: "${r.comment}", Verified: ${r.isVerifiedPurchase}`);
                });
            }
        });
        console.log(`Total reviews: ${totalReviews}`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

run();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const p = await Product.findOne({ name: 'Luxury Emerald Drop Chandelier Earrings' });
  console.log('Database Value:', JSON.stringify(p, null, 2));
  await mongoose.disconnect();
}
run();

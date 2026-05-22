import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    stock: Number,
    carat: Number,
    imageUrl: String,
    description: String
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function run() {
    try {
        console.log('Connecting to Mongo...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');
        
        const products = await Product.find({}).sort({ createdAt: -1 });
        console.log(`Found ${products.length} products:`);
        products.forEach(p => {
            console.log(`- ID: ${p._id}, Name: "${p.name}", Category: "${p.category}", Price: $${p.price}, Carat: ${p.carat}, Stock: ${p.stock}, Image: "${p.imageUrl}", CreatedAt: ${p.createdAt}`);
        });
        
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

run();

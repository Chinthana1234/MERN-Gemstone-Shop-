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
    description: String,
    createdAt: Date
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function run() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');
        
        // Find products that are NOT part of the standard seed data
        const standardJewelryNames = [
            '18K White Gold Sapphire Halo Ring',
            '18K Yellow Gold Ruby Solitaire Ring',
            'Platinum Emerald and Diamond Three-Stone Ring',
            'Vintage Ruby & Diamond Pendant Necklace',
            'Classic Emerald Pendant in 18K Gold',
            'Emerald Cut Sapphire Drop Earrings',
            'Natural Ruby Halo Stud Earrings',
            'Sapphire & Diamond Line Tennis Bracelet',
            'Classic Ruby & Gold Link Bracelet'
        ];

        const products = await Product.find({
            $and: [
                { name: { $not: /^Natural / } },
                { name: { $nin: standardJewelryNames } }
            ]
        });
        
        console.log(`Found ${products.length} custom products:`);
        products.forEach(p => {
            console.log(`- ID: ${p._id}, Name: "${p.name}", Category: "${p.category}", Price: $${p.price}, Image: "${p.imageUrl}", CreatedAt: ${p.createdAt}`);
        });

        const totalCount = await Product.countDocuments({});
        console.log(`Total products in database: ${totalCount}`);
        
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

run();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map local folder names to exact Category strings expected by the frontend
const categoryMap = {
    'blue-sapphire': 'Blue Sapphire',
    'yellow sapphire': 'Yellow Sapphire',
    'white sapphire': 'White Sapphire',
    'spessartine garnet': 'Spessartine Garnet',
    'Ruby': 'Ruby',
    'emerald': 'Emerald',
    "cat's eye": "Cat's Eye"
};

// Base price per carat for different gems to generate realistic prices
const basePriceMap = {
    'Blue Sapphire': 1500,
    'Yellow Sapphire': 800,
    'White Sapphire': 400,
    'Spessartine Garnet': 300,
    'Ruby': 2500,
    'Emerald': 2000,
    "Cat's Eye": 1200
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const seedGems = async () => {
    try {
        await connectDB();

        // Optional: clear existing products to start fresh
        await Product.deleteMany();
        console.log('Cleared existing products.');

        const gemsDir = path.join(__dirname, '../frontend/public/images/gems');
        const folders = fs.readdirSync(gemsDir);

        const productsToInsert = [];

        for (const folder of folders) {
            const folderPath = path.join(gemsDir, folder);
            if (fs.statSync(folderPath).isDirectory()) {
                const category = categoryMap[folder];
                if (!category) {
                    console.warn(`Skipping unknown folder: ${folder}`);
                    continue;
                }

                const images = fs.readdirSync(folderPath).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
                
                images.forEach((image, index) => {
                    const imageUrl = `/images/gems/${folder}/${image}`;
                    const carat = getRandomFloat(1.0, 15.0);
                    
                    // Price calculation: base price * carat * random multiplier (0.8 to 1.5)
                    const basePrice = basePriceMap[category] || 1000;
                    const priceMultiplier = getRandomFloat(0.8, 1.5);
                    const price = Math.round(basePrice * carat * priceMultiplier);

                    productsToInsert.push({
                        name: `Natural ${carat}ct ${category}`,
                        description: `A stunning ${carat} carat natural ${category}. Exquisitely cut to maximize brilliance and color saturation. Perfect for high-end custom jewelry or as an investment piece.`,
                        price: price,
                        imageUrl: imageUrl,
                        category: category,
                        stock: getRandomInt(1, 5),
                        rating: getRandomFloat(4.0, 5.0),
                        numReviews: getRandomInt(0, 25),
                        carat: carat,
                        origin: ['Ceylon (Sri Lanka)', 'Madagascar', 'Colombia', 'Myanmar'][getRandomInt(0, 3)]
                    });
                });
            }
        }

        if (productsToInsert.length > 0) {
            await Product.insertMany(productsToInsert);
            console.log(`Successfully seeded ${productsToInsert.length} gemstone products!`);
        } else {
            console.log('No images found to seed.');
        }

        process.exit();
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
};

seedGems();

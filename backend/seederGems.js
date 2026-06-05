import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';
import { clearProductCache, redisClient } from './utils/redis.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map local folder names to exact Category strings expected by the frontend
const categoryMap = {
    'blue-sapphire': 'Blue Sapphire',
    'yellow-sapphire': 'Yellow Sapphire',
    'white-sapphire': 'White Sapphire',
    'spessartine-garnet': 'Spessartine Garnet',
    'ruby': 'Ruby',
    'emerald': 'Emerald',
    'cats-eye': "Cat's Eye"
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

        const jewelryProducts = [
            {
                name: '18K White Gold Sapphire Halo Ring',
                description: 'An exquisite 18K white gold ring featuring a brilliant blue sapphire surrounded by a halo of micro-pave diamonds. Elegant and timeless design.',
                price: 3500,
                imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
                category: 'Rings',
                stock: 3,
                rating: 4.8,
                numReviews: 12,
                carat: 0,
                origin: 'Ceylon (Sri Lanka)'
            },
            {
                name: '18K Yellow Gold Ruby Solitaire Ring',
                description: 'A classic solitaire ring in rich 18K yellow gold, showcasing a stunning oval-cut natural ruby. A perfect statement piece.',
                price: 4200,
                imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
                category: 'Rings',
                stock: 2,
                rating: 4.9,
                numReviews: 8,
                carat: 0,
                origin: 'Myanmar'
            },
            {
                name: 'Platinum Emerald and Diamond Three-Stone Ring',
                description: 'A majestic three-stone ring crafted in pure platinum, featuring a vibrant emerald-cut emerald flanked by two brilliant round diamonds.',
                price: 5800,
                imageUrl: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80',
                category: 'Rings',
                stock: 4,
                rating: 4.7,
                numReviews: 15,
                carat: 0,
                origin: 'Colombia'
            },
            {
                name: 'Vintage Ruby & Diamond Pendant Necklace',
                description: 'A gorgeous vintage-inspired pendant necklace featuring a pear-shaped natural ruby suspended from a delicate 18K white gold chain studded with diamonds.',
                price: 2900,
                imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
                category: 'Necklaces',
                stock: 5,
                rating: 4.6,
                numReviews: 9,
                carat: 0,
                origin: 'Madagascar'
            },
            {
                name: 'Classic Emerald Pendant in 18K Gold',
                description: 'An elegant round-cut emerald solitaire pendant in 18K yellow gold. Simple, sophisticated, and perfect for everyday luxury.',
                price: 1800,
                imageUrl: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80',
                category: 'Necklaces',
                stock: 3,
                rating: 4.5,
                numReviews: 7,
                carat: 0,
                origin: 'Colombia'
            },
            {
                name: 'Emerald Cut Sapphire Drop Earrings',
                description: 'Stunning drop earrings featuring two matching emerald-cut blue sapphires hanging from 18K white gold diamond-encrusted hoops.',
                price: 3200,
                imageUrl: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80',
                category: 'Earrings',
                stock: 2,
                rating: 4.8,
                numReviews: 14,
                carat: 0,
                origin: 'Ceylon (Sri Lanka)'
            },
            {
                name: 'Natural Ruby Halo Stud Earrings',
                description: 'Dazzling stud earrings with round-cut rubies encircled by halos of brilliant round diamonds, set in 18K yellow gold.',
                price: 2500,
                imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
                category: 'Earrings',
                stock: 6,
                rating: 4.7,
                numReviews: 11,
                carat: 0,
                origin: 'Myanmar'
            },
            {
                name: 'Sapphire & Diamond Line Tennis Bracelet',
                description: 'A breathtaking tennis bracelet featuring alternating deep blue sapphires and brilliant round diamonds, set in 18K white gold.',
                price: 7500,
                imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80',
                category: 'Bracelets',
                stock: 1,
                rating: 5.0,
                numReviews: 18,
                carat: 0,
                origin: 'Ceylon (Sri Lanka)'
            },
            {
                name: 'Classic Ruby & Gold Link Bracelet',
                description: 'An exquisite link bracelet in 18K yellow gold, set with brilliant cut oval rubies. Secure clasp and luxury finish.',
                price: 4800,
                imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&q=80',
                category: 'Bracelets',
                stock: 3,
                rating: 4.9,
                numReviews: 10,
                carat: 0,
                origin: 'Madagascar'
            }
        ];

        // Combine gemstones and jewelry products
        const totalProductsToInsert = [...productsToInsert, ...jewelryProducts];

        if (totalProductsToInsert.length > 0) {
            await Product.insertMany(totalProductsToInsert);
            console.log(`Successfully seeded ${totalProductsToInsert.length} products (including ${jewelryProducts.length} jewelry items)!`);

            // Clear Redis cache to avoid stale empty cache listings
            try {
                await clearProductCache();
            } catch (cacheErr) {
                console.warn('Redis cache clear failed: ', cacheErr.message);
            }
        } else {
            console.log('No products found to seed.');
        }

        if (redisClient) {
            try {
                await redisClient.quit();
            } catch (err) {
                try {
                    await redisClient.disconnect();
                } catch (discErr) {
                    // ignore
                }
            }
        }
        process.exit();
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
};

seedGems();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gemsDir = path.join(__dirname, '../frontend/public/images/gems');
const MONGO_URI = process.env.MONGO_URI;

// Map categories to clean, web-safe kebab-case folder names
const cleanFolderNames = {
    'blue-sapphire': 'blue-sapphire',
    'yellow sapphire': 'yellow-sapphire',
    'white sapphire': 'white-sapphire',
    'spessartine garnet': 'spessartine-garnet',
    'Ruby': 'ruby',
    'emerald': 'emerald',
    "cat's eye": 'cats-eye'
};

const categoryNames = {
    'blue-sapphire': 'Blue Sapphire',
    'yellow-sapphire': 'Yellow Sapphire',
    'white-sapphire': 'White Sapphire',
    'spessartine-garnet': 'Spessartine Garnet',
    'ruby': 'Ruby',
    'emerald': 'Emerald',
    'cats-eye': "Cat's Eye"
};

// Base price per carat mapping
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

async function runCleanupAndReSeed() {
    try {
        console.log('--- Phase 1: Cleaning & Renaming Asset Files ---');
        if (!fs.existsSync(gemsDir)) {
            console.error(`Error: Directory ${gemsDir} does not exist.`);
            return;
        }

        const folders = fs.readdirSync(gemsDir);

        for (const folder of folders) {
            const currentFolderPath = path.join(gemsDir, folder);
            if (fs.statSync(currentFolderPath).isDirectory()) {
                const targetFolder = cleanFolderNames[folder] || folder.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const targetFolderPath = path.join(gemsDir, targetFolder);

                // Rename folder if it has spaces or capital letters
                if (folder !== targetFolder) {
                    console.log(`Renaming folder: "${folder}" -> "${targetFolder}"`);
                    if (folder.toLowerCase() === targetFolder.toLowerCase()) {
                        // Safe casing-only rename on Windows using a temp folder
                        const tempFolderPath = path.join(gemsDir, `${targetFolder}_temp_rename`);
                        fs.renameSync(currentFolderPath, tempFolderPath);
                        fs.renameSync(tempFolderPath, targetFolderPath);
                    } else if (fs.existsSync(targetFolderPath)) {
                        // Merge if target already exists
                        const files = fs.readdirSync(currentFolderPath);
                        files.forEach(file => {
                            fs.renameSync(path.join(currentFolderPath, file), path.join(targetFolderPath, file));
                        });
                        fs.rmdirSync(currentFolderPath);
                    } else {
                        fs.renameSync(currentFolderPath, targetFolderPath);
                    }
                }

                // Rename files inside target folder to remove spaces and parentheses
                const activeFolderPath = targetFolderPath;
                const files = fs.readdirSync(activeFolderPath);
                
                files.forEach((file, index) => {
                    if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
                        // e.g. "download (1).jpeg" -> "download-1.jpeg"
                        let cleanFileName = file.toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[\(\)]/g, '');
                            
                        const currentFilePath = path.join(activeFolderPath, file);
                        const targetFilePath = path.join(activeFolderPath, cleanFileName);

                        if (file !== cleanFileName) {
                            console.log(`  Renaming file: "${file}" -> "${cleanFileName}"`);
                            fs.renameSync(currentFilePath, targetFilePath);
                        }
                    }
                });
            }
        }

        console.log('\n--- Phase 2: Connecting to Database to Re-Seed ---');
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected successfully!');

        // Delete existing products
        await Product.deleteMany();
        console.log('Cleared old products from database.');

        const activeFolders = fs.readdirSync(gemsDir);
        const productsToInsert = [];

        for (const folder of activeFolders) {
            const folderPath = path.join(gemsDir, folder);
            if (fs.statSync(folderPath).isDirectory()) {
                const category = categoryNames[folder];
                if (!category) {
                    console.warn(`Skipping unknown folder in seeding: ${folder}`);
                    continue;
                }

                const images = fs.readdirSync(folderPath).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
                
                images.forEach((image, index) => {
                    const imageUrl = `/images/gems/${folder}/${image}`;
                    const carat = getRandomFloat(1.0, 15.0);
                    
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
            console.log(`Successfully clean-seeded ${productsToInsert.length} gemstone products!`);
        } else {
            console.log('Warning: No images found to seed.');
        }

    } catch (err) {
        console.error('Error during cleanup and re-seeding:', err);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
    }
}

runCleanupAndReSeed();

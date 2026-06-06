import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Configure Cloudinary with keys from .env
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Import Product Model
import Product from './models/Product.js';

async function migrateImages() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB successfully.");

        const products = await Product.find({});
        console.log(`Found ${products.length} products to check.`);

        let updatedCount = 0;

        for (const product of products) {
            // Check if imageUrl is a local path
            if (product.imageUrl && product.imageUrl.startsWith('/images/')) {
                console.log(`\nProcessing product: ${product.name}`);
                console.log(`Current local URL: ${product.imageUrl}`);

                // Construct absolute path to the local image file
                // The images are in frontend/public/images/...
                const localImagePath = path.join(__dirname, '..', 'frontend', 'public', product.imageUrl);

                if (fs.existsSync(localImagePath)) {
                    console.log(`Found local file at: ${localImagePath}`);
                    console.log(`Uploading to Cloudinary...`);
                    
                    try {
                        const result = await cloudinary.uploader.upload(
                            localImagePath, 
                            { folder: 'gemstones' }
                        );
                        
                        console.log(`Upload successful! New Cloudinary URL: ${result.secure_url}`);
                        
                        // Update product
                        product.imageUrl = result.secure_url;
                        await product.save();
                        updatedCount++;
                        console.log(`Product "${product.name}" updated in database.`);
                    } catch (uploadError) {
                        console.error(`Failed to upload image for "${product.name}":`, uploadError.message);
                    }
                } else {
                    console.log(`Warning: Local file not found at ${localImagePath}. Skipping...`);
                }
            } else {
                console.log(`Skipping product "${product.name}" (imageUrl is already remote or not set)`);
            }
        }

        console.log(`\nMigration completed! Updated ${updatedCount} products.`);
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

migrateImages();

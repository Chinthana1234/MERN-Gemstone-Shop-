import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function deleteReview() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected Successfully!');

        // Find product containing the review using case-insensitive matches
        const authorName = "Shashikala Samaranayaka";
        const commentSubstr = "this website is not recommended";

        const products = await Product.find({
            $or: [
                { "reviews.name": { $regex: new RegExp(authorName, 'i') } },
                { "reviews.comment": { $regex: new RegExp(commentSubstr, 'i') } }
            ]
        });

        if (products.length === 0) {
            console.log('No products found with reviews matching Shashikala Samaranayaka.');
            return;
        }

        console.log(`Found ${products.length} products with matching reviews.`);

        for (const product of products) {
            console.log(`Processing Product: "${product.name}" (ID: ${product._id})`);
            
            // Filter out the bad review (case-insensitively)
            const initialCount = product.reviews.length;
            product.reviews = product.reviews.filter(r => 
                r.name.toLowerCase() !== authorName.toLowerCase() && 
                !r.comment.toLowerCase().includes(commentSubstr)
            );
            
            const deletedCount = initialCount - product.reviews.length;
            if (deletedCount > 0) {
                console.log(`Removing ${deletedCount} review(s) from "${product.name}"`);
                
                // Recalculate averages
                product.numReviews = product.reviews.length;
                if (product.reviews.length > 0) {
                    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
                    product.rating = totalRating / product.reviews.length;
                } else {
                    product.rating = 0;
                }

                await product.save();
                console.log(`Successfully updated product "${product.name}" rating to ${product.rating.toFixed(2)} and review count to ${product.numReviews}.`);
            }
        }

    } catch (err) {
        console.error('An error occurred during operation:', err);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
    }
}

deleteReview();

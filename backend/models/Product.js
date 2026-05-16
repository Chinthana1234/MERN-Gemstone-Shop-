import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true }, // e.g., Sapphire, Ruby, Emerald
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    carat: { type: Number, default: 0 },
    origin: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
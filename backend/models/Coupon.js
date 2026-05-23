import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        required: true,
        enum: ['percentage', 'flat'],
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        required: true
    },
    minPurchaseAmount: {
        type: Number,
        required: true,
        default: 0
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);

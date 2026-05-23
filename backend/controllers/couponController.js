import Coupon from '../models/Coupon.js';

// @desc    Validate and apply a coupon
// @route   POST /api/coupons/apply
// @access  Private
export const applyCoupon = async (req, res) => {
    try {
        const { code, itemsPrice } = req.body;

        if (!code) {
            return res.status(400).json({ message: 'Coupon code is required' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid coupon code' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ message: 'This coupon is no longer active' });
        }

        // Check expiry date
        const currentDate = new Date();
        if (new Date(coupon.expiryDate) < currentDate) {
            return res.status(400).json({ message: 'This coupon has expired' });
        }

        // Check minimum purchase amount
        if (itemsPrice < coupon.minPurchaseAmount) {
            return res.status(400).json({ 
                message: `Minimum purchase of $${coupon.minPurchaseAmount.toLocaleString()} is required for this coupon` 
            });
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = itemsPrice * (coupon.discountValue / 100);
        } else if (coupon.discountType === 'flat') {
            discountAmount = coupon.discountValue;
        }

        // Cap discount at the items price to avoid negative totals
        if (discountAmount > itemsPrice) {
            discountAmount = itemsPrice;
        }

        // Round discount to 2 decimal places
        discountAmount = Math.round(discountAmount * 100) / 100;

        res.json({
            message: 'Coupon applied successfully',
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount
        });
    } catch (error) {
        console.error('Apply coupon error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        console.error('Get coupons error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minPurchaseAmount, expiryDate, isActive } = req.body;

        if (!code || !discountType || discountValue === undefined || !expiryDate) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const couponExists = await Coupon.findOne({ code: code.toUpperCase().trim() });

        if (couponExists) {
            return res.status(400).json({ message: 'A coupon with this code already exists' });
        }

        const coupon = new Coupon({
            code: code.toUpperCase().trim(),
            discountType,
            discountValue,
            minPurchaseAmount: minPurchaseAmount || 0,
            expiryDate,
            isActive: isActive !== undefined ? isActive : true
        });

        const createdCoupon = await coupon.save();
        res.status(201).json(createdCoupon);
    } catch (error) {
        console.error('Create coupon error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coupon removed successfully' });
    } catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Toggle coupon active status
// @route   PUT /api/coupons/:id/toggle
// @access  Private/Admin
export const toggleCouponStatus = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        coupon.isActive = !coupon.isActive;
        const updatedCoupon = await coupon.save();

        res.json(updatedCoupon);
    } catch (error) {
        console.error('Toggle coupon status error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

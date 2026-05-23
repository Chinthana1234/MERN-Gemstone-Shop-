import express from 'express';
import { 
    applyCoupon,
    getCoupons,
    createCoupon,
    deleteCoupon,
    toggleCouponStatus
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User protected endpoint to validate and apply coupon
router.post('/apply', protect, applyCoupon);

// Admin protected endpoints
router.route('/')
    .get(protect, admin, getCoupons)
    .post(protect, admin, createCoupon);

router.route('/:id')
    .delete(protect, admin, deleteCoupon);

router.route('/:id/toggle')
    .put(protect, admin, toggleCouponStatus);

export default router;

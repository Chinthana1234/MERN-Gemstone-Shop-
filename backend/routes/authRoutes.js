import express from 'express';
import { 
    registerUser, 
    loginUser, 
    googleLogin, 
    getUserProfile, 
    updateUserProfile, 
    getWishlist, 
    toggleWishlist,
    getUsers,
    createUser,
    updateUserRole,
    deleteUser
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/wishlist').get(protect, getWishlist);
router.route('/wishlist/:id').post(protect, toggleWishlist);

// Admin user management routes
router.route('/')
    .get(protect, admin, getUsers)
    .post(protect, admin, createUser);

router.route('/:id')
    .put(protect, admin, updateUserRole)
    .delete(protect, admin, deleteUser);

export default router;


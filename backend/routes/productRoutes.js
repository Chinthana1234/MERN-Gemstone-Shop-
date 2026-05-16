import express from 'express';
import { getProducts, createProduct } from '../controllers/productController.js';

const router = express.Router();

// Define the routes and connect them to controller functions
router.route('/').get(getProducts).post(createProduct);

export default router;

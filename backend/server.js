import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import couponRoutes from './routes/couponRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true
}));
app.use(express.json());

// Connect to MongoDB Middleware
const connectDB = async (req, res, next) => {
    try {
        if (mongoose.connection.readyState === 1) {
            return next();
        }
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully');
        next();
    } catch (err) {
        console.error('MongoDB Connection Error: ', err);
        res.status(500).json({ message: 'Database connection failed' });
    }
};

app.use(connectDB);

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/coupons', couponRoutes);

app.get('/api/config/paypal', (req, res) => {
    res.json({ clientId: process.env.PAYPAL_CLIENT_ID || 'sb' });
});

app.get('/', (req, res) => {
    res.send('Gemstone Shop API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
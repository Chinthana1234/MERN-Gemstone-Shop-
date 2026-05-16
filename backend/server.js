import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js'; // <-- NEW IMPORT

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes); // <-- NEW ROUTE MIDDLEWARE

app.get('/', (req, res) => {
    res.send('Gemstone Shop API is running...');
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch((err) => console.log('MongoDB Connection Error: ', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
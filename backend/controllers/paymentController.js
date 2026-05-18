import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe Payment Intent
// @route   POST /api/payment/create-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body; // Amount should be in cents

        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd', // or 'lkr' if you prefer, but usually usd is standard for international
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ message: error.message });
    }
};

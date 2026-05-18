import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripePaymentForm = ({ clientSecret, onPaymentSuccess, cartTotal }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet
            return;
        }

        setProcessing(true);

        const cardElement = elements.getElement(CardElement);

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (error) {
            setError(error.message);
            setProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setError(null);
            setProcessing(false);
            // Pass the payment ID back to the checkout handler
            onPaymentSuccess(paymentIntent.id);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border border-gemBorder rounded-md bg-gemBgAlt">
                <CardElement 
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#f5f5f5',
                                '::placeholder': {
                                    color: '#a3a3a3',
                                },
                                iconColor: '#f5f5f5',
                            },
                            invalid: {
                                color: '#ef4444',
                                iconColor: '#ef4444',
                            },
                        },
                    }}
                />
            </div>

            {error && (
                <div className="text-red-500 text-sm mt-2 bg-red-500/10 p-3 rounded">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white uppercase tracking-widest text-sm font-semibold hover:bg-green-700 transition-all duration-300 rounded shadow-md disabled:opacity-50"
            >
                {processing ? 'Processing...' : `Pay $${cartTotal.toLocaleString()}`}
            </button>
        </form>
    );
};

export default StripePaymentForm;

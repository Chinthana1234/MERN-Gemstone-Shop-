import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Package, ChevronRight, ChevronLeft, Check, ShoppingCart, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../utils/api';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm from '../components/checkout/StripePaymentForm';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

// Initialize Stripe (using optional chaining for safety if env is missing)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_PLACEHOLDER_KEY');

const STEPS = [
    { id: 1, label: 'Shipping', icon: MapPin },
    { id: 2, label: 'Review', icon: Package },
    { id: 3, label: 'Payment', icon: CreditCard }
];

function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    // Inactivity Session Expiry Timer (Option 2)
    useEffect(() => {
        let timeoutId;
        const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsSessionExpired(true);
            }, TIMEOUT_DURATION);
        };

        // Initialize timer
        resetTimer();

        // Listen for user activity to extend the session
        const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
        activityEvents.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Cleanup on unmount
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            activityEvents.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, []);

    const finalTotal = cartTotal;

    const [shipping, setShipping] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Sri Lanka',
        phone: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('Credit Card (Stripe)');

    // Fetch client secret when entering step 3
    useEffect(() => {
        if (currentStep === 3) {
            if (paymentMethod === 'Credit Card (Stripe)') {
                const fetchClientSecret = async () => {
                    try {
                        const { data } = await API.post('/payment/create-intent', {
                            amount: Math.round(finalTotal * 100) // Convert to cents
                        });
                        setClientSecret(data.clientSecret);
                    } catch (err) {
                        console.error("Failed to initialize Stripe payment", err);
                        setError("Could not connect to payment gateway.");
                    }
                };
                fetchClientSecret();
            }
        }
    }, [currentStep, paymentMethod, finalTotal]);

    // Redirect if cart is empty
    if (cartItems.length === 0) {
        return (
            <div className="pt-28 pb-20 min-h-screen bg-white flex flex-col items-center justify-center">
                <ShoppingCart size={64} className="text-stone-300 mb-6" />
                <h2 className="text-2xl font-serif text-stone-900 mb-3">Your Cart is Empty</h2>
                <p className="text-stone-600 mb-8">Add some items before checking out.</p>
                <button onClick={() => navigate('/shop')}
                    className="bg-gemRed text-white font-semibold uppercase tracking-widest text-sm px-10 py-3 hover:bg-gemRedDark transition-all duration-300 rounded">
                    Browse Collection
                </button>
            </div>
        );
    }

    const handleShippingChange = (e) => {
        setShipping({ ...shipping, [e.target.name]: e.target.value });
    };

    const validateShipping = () => {
        const { fullName, address, city, state, postalCode, country } = shipping;
        if (!fullName || !address || !city || !state || !postalCode || !country) {
            setError('Please fill in all required fields.');
            return false;
        }
        setError('');
        return true;
    };

    const handleNext = () => {
        if (currentStep === 1 && !validateShipping()) return;
        setCurrentStep(prev => Math.min(prev + 1, 3));
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        setError('');
    };



    const handlePlaceOrder = async (paymentId = null) => {
        try {
            setLoading(true);
            setError('');

            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    price: item.price,
                    imageUrl: item.imageUrl,
                    product: item._id
                })),
                shippingAddress: shipping,
                paymentMethod,
                paymentResult: paymentId ? { id: paymentId, status: 'succeeded', update_time: new Date().toISOString() } : undefined
            };

            const { data } = await API.post('/orders', orderData);
            clearCart();
            toast.success('Order placed successfully!');
            navigate(`/order/${data._id}`);
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Failed to place order. Please try again.';
            setError(errMsg);
            toast.error('Order failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-28 pb-20 min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="text-center mb-12">
                    <span className="text-gemRed tracking-[0.3em] text-xs uppercase font-semibold">Secure Checkout</span>
                    <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mt-3 mb-4">Complete Your Order</h1>
                    <div className="h-0.5 w-24 bg-gemRed mx-auto"></div>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-14">
                    {STEPS.map((step, idx) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${currentStep > step.id
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : currentStep === step.id
                                        ? 'bg-gemRed border-gemRed text-white scale-110 shadow-lg shadow-gemRed/25'
                                        : 'bg-stone-50 border-stone-200 text-stone-400'
                                    }`}>
                                    {currentStep > step.id ? <Check size={20} /> : <step.icon size={20} />}
                                </div>
                                <span className={`mt-2 text-xs uppercase tracking-widest font-medium transition-colors duration-300 ${currentStep >= step.id ? 'text-stone-800' : 'text-stone-400'
                                    }`}>{step.label}</span>
                            </div>
                            {idx < STEPS.length - 1 && (
                                <div className={`w-20 sm:w-32 h-0.5 mx-2 transition-colors duration-500 ${currentStep > step.id ? 'bg-green-500' : 'bg-stone-200'
                                    }`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 mb-8 text-sm text-center rounded">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Step 1: Shipping */}
                        {currentStep === 1 && (
                            <div className="bg-white border border-stone-200 rounded-lg p-8 shadow-sm animate-fadeIn">
                                <h2 className="text-xl font-serif text-stone-900 mb-6 flex items-center gap-3">
                                    <MapPin size={20} className="text-gemRed" /> Shipping Address
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="sm:col-span-2">
                                        <label className="text-xs uppercase tracking-widest text-stone-500 mb-2 block">Full Name *</label>
                                        <input type="text" name="fullName" value={shipping.fullName} onChange={handleShippingChange} required
                                            className="w-full bg-stone-50 border border-stone-200 p-3 text-stone-800 rounded focus:outline-none focus:border-gemRed transition-colors" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-xs uppercase tracking-widest text-stone-500 mb-2 block">Street Address *</label>
                                        <input type="text" name="address" value={shipping.address} onChange={handleShippingChange} required
                                            placeholder="123 Main Street, Apt 4B"
                                            className="w-full bg-stone-50 border border-stone-200 p-3 text-stone-800 rounded focus:outline-none focus:border-gemRed transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-widest text-stone-500 mb-2 block">City *</label>
                                        <input type="text" name="city" value={shipping.city} onChange={handleShippingChange} required
                                            className="w-full bg-stone-50 border border-stone-200 p-3 text-stone-800 rounded focus:outline-none focus:border-gemRed transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-widest text-stone-500 mb-2 block">State / Province *</label>
                                        <input type="text" name="state" value={shipping.state} onChange={handleShippingChange} required
                                            placeholder="e.g. Western Province"
                                            className="w-full bg-stone-50 border border-stone-200 p-3 text-stone-800 rounded focus:outline-none focus:border-gemRed transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-widest text-stone-500 mb-2 block">Postal Code *</label>
                                        <input type="text" name="postalCode" value={shipping.postalCode} onChange={handleShippingChange} required
                                            className="w-full bg-stone-50 border border-stone-200 p-3 text-stone-800 rounded focus:outline-none focus:border-gemRed transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-widest text-stone-500 mb-2 block">Country *</label>
                                        <input type="text" name="country" value={shipping.country} onChange={handleShippingChange} required
                                            className="w-full bg-stone-50 border border-stone-200 p-3 text-stone-800 rounded focus:outline-none focus:border-gemRed transition-colors" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-xs uppercase tracking-widest text-stone-500 mb-2 block">Phone (Optional)</label>
                                        <input type="tel" name="phone" value={shipping.phone} onChange={handleShippingChange}
                                            placeholder="e.g. 0771234567"
                                            className="w-full bg-stone-50 border border-stone-200 p-3 text-stone-800 rounded focus:outline-none focus:border-gemRed transition-colors" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Order Review */}
                        {currentStep === 2 && (
                            <div className="bg-white border border-stone-200 rounded-lg p-8 shadow-sm animate-fadeIn">
                                <h2 className="text-xl font-serif text-stone-900 mb-6 flex items-center gap-3">
                                    <Package size={20} className="text-gemRed" /> Review Your Order
                                </h2>

                                {/* Shipping Summary */}
                                <div className="bg-stone-50 border border-stone-200/60 rounded-lg p-5 mb-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-stone-500 mb-2">Shipping To</p>
                                            <p className="text-stone-900 font-medium">{shipping.fullName}</p>
                                            <p className="text-stone-600 text-sm">{shipping.address}</p>
                                            <p className="text-stone-600 text-sm">{shipping.city}, {shipping.state && `${shipping.state}, `}{shipping.postalCode}</p>
                                            <p className="text-stone-600 text-sm">{shipping.country}</p>
                                            {shipping.phone && <p className="text-stone-600 text-sm mt-1">📞 {shipping.phone}</p>}
                                        </div>
                                        <button onClick={() => setCurrentStep(1)} className="text-gemRed text-xs uppercase tracking-widest hover:underline">
                                            Edit
                                        </button>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-4">
                                    {cartItems.map(item => (
                                        <div key={item._id} className="flex items-center gap-4 py-4 border-b border-stone-200 last:border-b-0">
                                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                            <div className="flex-1">
                                                <p className="text-stone-900 font-serif">{item.name}</p>
                                                <p className="text-stone-500 text-xs uppercase tracking-widest">{item.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-stone-600 text-sm">Qty: {item.qty}</p>
                                                <p className="text-stone-900 font-medium">${(item.price * item.qty).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment */}
                        {currentStep === 3 && (
                            <div className="bg-white border border-stone-200 rounded-lg p-8 shadow-sm animate-fadeIn">
                                <h2 className="text-xl font-serif text-stone-900 mb-6 flex items-center gap-3">
                                    <CreditCard size={20} className="text-gemRed" /> Payment Method
                                </h2>

                                <div className="space-y-4 mb-8">
                                    {['Credit Card (Stripe)', 'PayPal', 'Cash on Delivery', 'Bank Transfer'].map(method => (
                                        <label key={method}
                                            onClick={() => { setPaymentMethod(method); setError(''); }}
                                            className={`flex items-center gap-4 p-5 border-2 rounded-lg cursor-pointer transition-all duration-300 ${paymentMethod === method
                                                ? 'border-gemRed bg-gemRed/5 shadow-sm'
                                                : 'border-stone-200 bg-white hover:border-stone-400'
                                                }`}>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === method ? 'border-gemRed' : 'border-stone-200'
                                                }`}>
                                                {paymentMethod === method && <div className="w-2.5 h-2.5 rounded-full bg-gemRed"></div>}
                                            </div>
                                            <div>
                                                <p className="text-stone-900 font-medium">{method}</p>
                                                <p className="text-stone-500 text-xs mt-0.5">
                                                    {method === 'Credit Card (Stripe)' ? 'Secure credit card payment via Stripe' :
                                                        method === 'PayPal' ? 'Pay securely via PayPal account or credit card' :
                                                            method === 'Cash on Delivery' ? 'Pay when your order arrives at your doorstep' :
                                                                'Transfer directly to our bank account'}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {paymentMethod === 'Credit Card (Stripe)' && clientSecret && (
                                    <div className="mt-8 border-t border-stone-200 pt-8 animate-fadeIn">
                                        <h3 className="text-lg font-serif text-stone-900 mb-6">Enter Card Details</h3>
                                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                                            <StripePaymentForm
                                                clientSecret={clientSecret}
                                                cartTotal={cartTotal}
                                                onPaymentSuccess={(paymentId) => handlePlaceOrder(paymentId)}
                                            />
                                        </Elements>
                                    </div>
                                )}

                                {paymentMethod === 'Credit Card (Stripe)' && !clientSecret && (
                                    <div className="mt-8 border-t border-stone-200 pt-8 text-center text-stone-500">
                                        Loading secure payment gateway...
                                    </div>
                                )}

                                {paymentMethod === 'PayPal' && (
                                    <div className="mt-8 border-t border-stone-200 pt-8 animate-fadeIn">
                                        <h3 className="text-lg font-serif text-stone-900 mb-6 font-semibold">Pay with PayPal</h3>
                                        <PayPalScriptProvider options={{
                                            "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
                                            currency: "USD",
                                            intent: "capture"
                                        }}>
                                            <PayPalButtons
                                                createOrder={(data, actions) => {
                                                    // Clean phone number format for Sri Lanka
                                                    let cleanPhone = (shipping.phone || '').replace(/[^0-9]/g, '');
                                                    if (cleanPhone.startsWith('94')) {
                                                        cleanPhone = cleanPhone.substring(2);
                                                    }
                                                    if (cleanPhone.startsWith('0')) {
                                                        cleanPhone = cleanPhone.substring(1);
                                                    }
                                                    // Only pass phone if it has a valid length (e.g., 9 digits for Sri Lankan mobile)
                                                    const hasValidPhone = cleanPhone.length >= 7 && cleanPhone.length <= 11;

                                                    const countryMap = {
                                                        'sri lanka': 'LK'
                                                    };
                                                    const cleanCountry = (shipping.country || '').trim().toLowerCase();
                                                    const countryCode = countryMap[cleanCountry] || 'LK';

                                                    const orderPayload = {
                                                        purchase_units: [{
                                                            amount: {
                                                                value: finalTotal.toFixed(2),
                                                                currency_code: 'USD'
                                                            },
                                                            shipping: {
                                                                name: {
                                                                    full_name: shipping.fullName
                                                                },
                                                                phone_number: hasValidPhone ? {
                                                                    country_code: '94',
                                                                    national_number: cleanPhone
                                                                } : undefined,
                                                                address: {
                                                                    address_line_1: shipping.address,
                                                                    admin_area_2: shipping.city,
                                                                    admin_area_1: shipping.state || shipping.city,
                                                                    postal_code: shipping.postalCode,
                                                                    country_code: countryCode
                                                                }
                                                            }
                                                        }]
                                                    };

                                                    orderPayload.application_context = {
                                                        shipping_preference: 'SET_PROVIDED_ADDRESS'
                                                    };

                                                    return actions.order.create(orderPayload);
                                                }}
                                                onApprove={async (data, actions) => {
                                                    try {
                                                        setLoading(true);
                                                        const details = await actions.order.capture();
                                                        handlePlaceOrder(details.id);
                                                    } catch (err) {
                                                        console.error("PayPal capture error:", err);
                                                        setError("Failed to capture PayPal payment.");
                                                        setLoading(false);
                                                    }
                                                }}
                                                onError={(err) => {
                                                    console.error("PayPal error:", err);
                                                    setError("PayPal payment failed or cancelled.");
                                                }}
                                            />
                                        </PayPalScriptProvider>
                                    </div>
                                )}

                                <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                                    <p className="text-green-500 text-sm font-medium">🔒 Your order information is secure and encrypted</p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            {currentStep > 1 ? (
                                <button onClick={handleBack}
                                    className="flex items-center gap-2 px-6 py-3 border-2 border-stone-200 text-stone-600 hover:border-stone-850 hover:text-stone-850 uppercase tracking-widest text-sm font-semibold transition-all duration-300 rounded">
                                    <ChevronLeft size={16} /> Back
                                </button>
                            ) : <div></div>}

                            {currentStep < 3 ? (
                                <button onClick={handleNext}
                                    className="flex items-center gap-2 px-8 py-3 bg-gemRed text-white uppercase tracking-widest text-sm font-semibold hover:bg-gemRedDark transition-all duration-300 rounded shadow-md hover:shadow-lg">
                                    Continue <ChevronRight size={16} />
                                </button>
                            ) : (
                                (paymentMethod !== 'Credit Card (Stripe)' && paymentMethod !== 'PayPal') ? (
                                    <button onClick={() => handlePlaceOrder()} disabled={loading}
                                        className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white uppercase tracking-widest text-sm font-semibold hover:bg-green-700 transition-all duration-300 rounded shadow-md disabled:opacity-50">
                                        {loading ? 'Placing Order...' : 'Place Order'}
                                    </button>
                                ) : null
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="bg-stone-50 border border-stone-200/60 p-6 h-fit sticky top-28 rounded-lg shadow-sm">
                        <h3 className="text-lg font-serif text-stone-900 mb-5 pb-4 border-b border-stone-200">Order Summary</h3>
                        <div className="space-y-3 mb-5">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex justify-between text-sm">
                                    <span className="text-stone-600 truncate mr-2">{item.name} × {item.qty}</span>
                                    <span className="text-stone-850 font-medium whitespace-nowrap">${(item.price * item.qty).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-stone-200 pt-4 space-y-2">
                            <div className="flex justify-between text-sm text-stone-600">
                                <span>Subtotal</span><span>${cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-stone-600">
                                <span>Shipping</span><span className="text-green-500">Free</span>
                            </div>
                        </div>

                        <div className="flex justify-between text-stone-900 text-lg font-semibold mt-4 pt-4 border-t border-stone-200">
                            <span className="font-serif">Total</span>
                            <span>${finalTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inactivity Session Expiry Modal */}
            {isSessionExpired && (
                <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-500 animate-fadeIn">
                    <div className="bg-white border border-stone-200 max-w-md w-full rounded-2xl p-8 shadow-2xl text-center transform scale-100 transition-transform duration-300">
                        <div className="w-16 h-16 bg-gemRed/10 text-gemRed rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock size={32} className="animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-serif text-stone-900 mb-3">Session Expired</h3>
                        <p className="text-stone-600 text-sm mb-8 leading-relaxed">
                            Your checkout session has expired due to inactivity. We need to refresh the page to update product prices and stock availability.
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full bg-gemRed text-white font-semibold uppercase tracking-widest text-sm py-4 hover:bg-gemRedDark transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl shadow-gemRed/25 hover:shadow-gemRed/35"
                        >
                            Refresh Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Checkout;

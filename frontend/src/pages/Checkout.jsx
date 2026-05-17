import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Package, ChevronRight, ChevronLeft, Check, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const STEPS = [
    { id: 1, label: 'Shipping', icon: MapPin },
    { id: 2, label: 'Review', icon: Package },
    { id: 3, label: 'Payment', icon: CreditCard }
];

function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [shipping, setShipping] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Sri Lanka',
        phone: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

    // Redirect if cart is empty
    if (cartItems.length === 0) {
        return (
            <div className="pt-28 pb-20 min-h-screen bg-gemBgAlt flex flex-col items-center justify-center">
                <ShoppingBag size={64} className="text-gemBorder mb-6" />
                <h2 className="text-2xl font-serif text-gemText mb-3">Your Cart is Empty</h2>
                <p className="text-gemTextLight mb-8">Add some items before checking out.</p>
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
        const { fullName, address, city, postalCode, country } = shipping;
        if (!fullName || !address || !city || !postalCode || !country) {
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

    const handlePlaceOrder = async () => {
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
                paymentMethod
            };

            const { data } = await API.post('/orders', orderData);
            clearCart();
            navigate(`/order/${data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-28 pb-20 min-h-screen bg-gemBgAlt">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="text-center mb-12">
                    <span className="text-gemRed tracking-[0.3em] text-xs uppercase font-semibold">Secure Checkout</span>
                    <h1 className="text-3xl md:text-4xl font-serif text-gemText mt-3 mb-4">Complete Your Order</h1>
                    <div className="h-0.5 w-24 bg-gemRed mx-auto"></div>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-14">
                    {STEPS.map((step, idx) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                    currentStep > step.id
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : currentStep === step.id
                                            ? 'bg-gemRed border-gemRed text-white scale-110 shadow-lg shadow-gemRed/25'
                                            : 'bg-white border-gemBorder text-gemTextMuted'
                                }`}>
                                    {currentStep > step.id ? <Check size={20} /> : <step.icon size={20} />}
                                </div>
                                <span className={`mt-2 text-xs uppercase tracking-widest font-medium transition-colors duration-300 ${
                                    currentStep >= step.id ? 'text-gemText' : 'text-gemTextMuted'
                                }`}>{step.label}</span>
                            </div>
                            {idx < STEPS.length - 1 && (
                                <div className={`w-20 sm:w-32 h-0.5 mx-2 transition-colors duration-500 ${
                                    currentStep > step.id ? 'bg-green-500' : 'bg-gemBorder'
                                }`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-gemRed px-4 py-3 mb-8 text-sm text-center rounded">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Step 1: Shipping */}
                        {currentStep === 1 && (
                            <div className="bg-white border border-gemBorder rounded-lg p-8 shadow-sm animate-fadeIn">
                                <h2 className="text-xl font-serif text-gemText mb-6 flex items-center gap-3">
                                    <MapPin size={20} className="text-gemRed" /> Shipping Address
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="sm:col-span-2">
                                        <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 block">Full Name *</label>
                                        <input type="text" name="fullName" value={shipping.fullName} onChange={handleShippingChange} required
                                            className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 block">Street Address *</label>
                                        <input type="text" name="address" value={shipping.address} onChange={handleShippingChange} required
                                            placeholder="123 Main Street, Apt 4B"
                                            className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 block">City *</label>
                                        <input type="text" name="city" value={shipping.city} onChange={handleShippingChange} required
                                            className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 block">Postal Code *</label>
                                        <input type="text" name="postalCode" value={shipping.postalCode} onChange={handleShippingChange} required
                                            className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 block">Country *</label>
                                        <input type="text" name="country" value={shipping.country} onChange={handleShippingChange} required
                                            className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 block">Phone (Optional)</label>
                                        <input type="tel" name="phone" value={shipping.phone} onChange={handleShippingChange}
                                            className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Order Review */}
                        {currentStep === 2 && (
                            <div className="bg-white border border-gemBorder rounded-lg p-8 shadow-sm animate-fadeIn">
                                <h2 className="text-xl font-serif text-gemText mb-6 flex items-center gap-3">
                                    <Package size={20} className="text-gemRed" /> Review Your Order
                                </h2>

                                {/* Shipping Summary */}
                                <div className="bg-gemBgAlt border border-gemBorder rounded-lg p-5 mb-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-gemTextMuted mb-2">Shipping To</p>
                                            <p className="text-gemText font-medium">{shipping.fullName}</p>
                                            <p className="text-gemTextLight text-sm">{shipping.address}</p>
                                            <p className="text-gemTextLight text-sm">{shipping.city}, {shipping.postalCode}</p>
                                            <p className="text-gemTextLight text-sm">{shipping.country}</p>
                                            {shipping.phone && <p className="text-gemTextLight text-sm mt-1">📞 {shipping.phone}</p>}
                                        </div>
                                        <button onClick={() => setCurrentStep(1)} className="text-gemRed text-xs uppercase tracking-widest hover:underline">
                                            Edit
                                        </button>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-4">
                                    {cartItems.map(item => (
                                        <div key={item._id} className="flex items-center gap-4 py-4 border-b border-gemBorder last:border-b-0">
                                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                            <div className="flex-1">
                                                <p className="text-gemText font-serif">{item.name}</p>
                                                <p className="text-gemTextMuted text-xs uppercase tracking-widest">{item.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gemTextLight text-sm">Qty: {item.qty}</p>
                                                <p className="text-gemText font-medium">${(item.price * item.qty).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment */}
                        {currentStep === 3 && (
                            <div className="bg-white border border-gemBorder rounded-lg p-8 shadow-sm animate-fadeIn">
                                <h2 className="text-xl font-serif text-gemText mb-6 flex items-center gap-3">
                                    <CreditCard size={20} className="text-gemRed" /> Payment Method
                                </h2>

                                <div className="space-y-4">
                                    {['Cash on Delivery', 'Bank Transfer'].map(method => (
                                        <label key={method}
                                            className={`flex items-center gap-4 p-5 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                                                paymentMethod === method
                                                    ? 'border-gemRed bg-gemRed/5 shadow-sm'
                                                    : 'border-gemBorder bg-white hover:border-gemTextMuted'
                                            }`}>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                paymentMethod === method ? 'border-gemRed' : 'border-gemBorder'
                                            }`}>
                                                {paymentMethod === method && <div className="w-2.5 h-2.5 rounded-full bg-gemRed"></div>}
                                            </div>
                                            <div>
                                                <p className="text-gemText font-medium">{method}</p>
                                                <p className="text-gemTextMuted text-xs mt-0.5">
                                                    {method === 'Cash on Delivery' 
                                                        ? 'Pay when your order arrives at your doorstep' 
                                                        : 'Transfer directly to our bank account'}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                                    <p className="text-green-700 text-sm font-medium">🔒 Your order information is secure and encrypted</p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            {currentStep > 1 ? (
                                <button onClick={handleBack}
                                    className="flex items-center gap-2 px-6 py-3 border-2 border-gemBorder text-gemTextLight hover:border-gemText hover:text-gemText uppercase tracking-widest text-sm font-semibold transition-all duration-300 rounded">
                                    <ChevronLeft size={16} /> Back
                                </button>
                            ) : <div></div>}

                            {currentStep < 3 ? (
                                <button onClick={handleNext}
                                    className="flex items-center gap-2 px-8 py-3 bg-gemRed text-white uppercase tracking-widest text-sm font-semibold hover:bg-gemRedDark transition-all duration-300 rounded shadow-md hover:shadow-lg">
                                    Continue <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button onClick={handlePlaceOrder} disabled={loading}
                                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white uppercase tracking-widest text-sm font-semibold hover:bg-green-700 transition-all duration-300 rounded shadow-md hover:shadow-lg disabled:opacity-50">
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="bg-white border border-gemBorder p-6 h-fit sticky top-28 rounded-lg shadow-sm">
                        <h3 className="text-lg font-serif text-gemText mb-5 pb-4 border-b border-gemBorder">Order Summary</h3>
                        <div className="space-y-3 mb-5">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex justify-between text-sm">
                                    <span className="text-gemTextLight truncate mr-2">{item.name} × {item.qty}</span>
                                    <span className="text-gemText font-medium whitespace-nowrap">${(item.price * item.qty).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gemBorder pt-4 space-y-2">
                            <div className="flex justify-between text-sm text-gemTextLight">
                                <span>Subtotal</span><span>${cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gemTextLight">
                                <span>Shipping</span><span className="text-green-600">Free</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-gemText text-lg font-semibold mt-4 pt-4 border-t border-gemBorder">
                            <span className="font-serif">Total</span>
                            <span>${cartTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Clock, ArrowLeft, ShoppingBag, XCircle, Printer } from 'lucide-react';
import API from '../utils/api';

function OrderConfirmation() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await API.get(`/orders/${id}`);
                setOrder(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load order details');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order? This will restore the product stock and cannot be undone.')) {
            return;
        }
        setCancelling(true);
        try {
            const { data } = await API.put(`/orders/${id}/cancel`);
            setOrder(data);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel order');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="pt-28 pb-20 min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-stone-200 border-t-gemRed rounded-full animate-spin"></div>
                    <p className="text-stone-500 text-sm uppercase tracking-widest">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="pt-28 pb-20 min-h-screen bg-white flex flex-col items-center justify-center">
                <h2 className="text-2xl font-serif text-stone-900 mb-3">Order Not Found</h2>
                <p className="text-stone-600 mb-8">{error || 'This order does not exist.'}</p>
                <Link to="/shop" className="text-gemRed hover:underline">← Back to Shop</Link>
            </div>
        );
    }

    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const estimatedDelivery = new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const statusSteps = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];
    const currentStepIndex = statusSteps.indexOf(order.status);

    return (
        <div className="pt-28 pb-20 min-h-screen bg-white print:pt-4 print:pb-4">
            {/* Print styling overrides */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    header, footer, nav, .print-hidden {
                        display: none !important;
                    }
                    body {
                        background-color: white !important;
                        color: #1c1917 !important;
                    }
                    .print-full-width {
                        width: 100% !important;
                        max-width: 100% !important;
                        flex: none !important;
                    }
                }
            `}} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 print:max-w-full print:px-0">

                {/* Success Banner - hidden during printing */}
                {order.status !== 'Cancelled' && (
                    <div className="text-center mb-10 print-hidden">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounceIn">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mb-3">Order Confirmed!</h1>
                        <div className="h-0.5 w-24 bg-gemRed mx-auto mb-4"></div>
                        <p className="text-stone-600">
                            Thank you for your purchase. Your order <span className="text-gemRed font-semibold">#{order._id.slice(-8).toUpperCase()}</span> has been placed.
                        </p>
                    </div>
                )}

                {/* Print Header */}
                <div className="hidden print:block text-center border-b pb-6 mb-8">
                    <h1 className="text-3xl font-serif tracking-widest text-stone-950 uppercase">Aura Gems</h1>
                    <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Luxury Gemstone Shop</p>
                    <h2 className="text-lg font-serif mt-4 font-semibold text-stone-900">INVOICE & ORDER SUMMARY</h2>
                    <p className="text-sm text-stone-600 mt-1">Order #{order._id.toUpperCase()}</p>
                </div>

                {/* Status Section / Stepper */}
                <div className="mb-8 print-hidden">
                    {order.status === 'Cancelled' ? (
                        <div className="bg-red-50 border border-red-200/80 rounded-lg p-6 flex items-center gap-4 text-red-800 animate-fadeIn">
                            <XCircle size={40} className="text-red-500 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-lg font-serif">Order Cancelled</h4>
                                <p className="text-sm text-red-700 mt-1">This order has been cancelled and the inventory stock has been restored.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-stone-50 border border-stone-200/60 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-serif text-stone-900 mb-6 flex items-center gap-2">
                                <Clock size={18} className="text-gemRed" /> Order Progress
                            </h3>
                            <div className="relative">
                                {/* Connecting line */}
                                <div className="absolute top-5 left-0 right-0 h-0.5 bg-stone-200 -translate-y-1/2 hidden md:block" />
                                {currentStepIndex > 0 && (
                                    <div 
                                        className="absolute top-5 left-0 h-0.5 bg-amber-600 -translate-y-1/2 transition-all duration-500 hidden md:block"
                                        style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                                    />
                                )}
                                
                                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                                    {statusSteps.map((step, idx) => {
                                        const isCompleted = idx < currentStepIndex;
                                        const isActive = idx === currentStepIndex;
                                        const isPending = idx > currentStepIndex;
                                        
                                        return (
                                            <div key={step} className="flex md:flex-col items-center flex-1 w-full md:text-center z-10">
                                                {/* Circle */}
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-500 border-2 ${
                                                    isCompleted 
                                                        ? 'bg-amber-600 border-amber-600 text-white shadow-md' 
                                                        : isActive 
                                                            ? 'bg-white border-amber-600 text-amber-600 shadow-md animate-pulse' 
                                                            : 'bg-white border-stone-200 text-stone-400'
                                                }`}>
                                                    {isCompleted ? '✓' : idx + 1}
                                                </div>
                                                {/* Label */}
                                                <div className="ml-4 md:ml-0 md:mt-3 text-left md:text-center">
                                                    <p className={`font-serif text-sm font-medium ${
                                                        isActive ? 'text-amber-600 font-semibold scale-105 transition-transform' : isCompleted ? 'text-stone-850' : 'text-stone-400'
                                                    }`}>
                                                        {step}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:flex print:flex-col">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6 print-full-width">
                        {/* Status & Timeline Grid */}
                        <div className="bg-stone-50 border border-stone-200/60 rounded-lg p-6 shadow-sm print:bg-white print:border-stone-300">
                            <h3 className="text-lg font-serif text-stone-900 mb-4 flex items-center gap-2 print:border-b print:pb-2">
                                <Clock size={18} className="text-gemRed print:hidden" /> Order Information
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-stone-500 text-xs uppercase tracking-widest mb-1">Status</p>
                                    <span className={`px-2.5 py-0.5 text-xs uppercase tracking-widest rounded-full font-semibold inline-block ${
                                        order.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-stone-500 text-xs uppercase tracking-widest mb-1">Order Date</p>
                                    <p className="text-stone-850 font-medium">{formattedDate}</p>
                                </div>
                                {order.status !== 'Cancelled' && (
                                    <div>
                                        <p className="text-stone-500 text-xs uppercase tracking-widest mb-1">Estimated Delivery</p>
                                        <p className="text-stone-850 font-medium">{estimatedDelivery}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-stone-500 text-xs uppercase tracking-widest mb-1">Payment Method</p>
                                    <p className="text-stone-850 font-medium">{order.paymentMethod}</p>
                                </div>
                                <div>
                                    <p className="text-stone-500 text-xs uppercase tracking-widest mb-1">Payment Status</p>
                                    <div className="mt-1">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                            order.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {order.isPaid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </div>
                                    {order.isPaid && order.paidAt && (
                                        <p className="text-stone-500 text-[10px] uppercase tracking-widest mt-1">
                                            Paid on {new Date(order.paidAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <p className="text-stone-500 text-xs uppercase tracking-widest mb-1">Order ID</p>
                                    <p className="text-stone-850 font-mono text-xs">{order._id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="bg-stone-50 border border-stone-200/60 rounded-lg p-6 shadow-sm print:bg-white print:border-stone-300">
                            <h3 className="text-lg font-serif text-stone-900 mb-4 flex items-center gap-2 print:border-b print:pb-2">
                                <Package size={18} className="text-gemRed print:hidden" /> Purchased Items
                            </h3>
                            <div className="divide-y divide-stone-200">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 py-4">
                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded print:hidden" />
                                        <div className="flex-1">
                                            <p className="text-stone-900 font-serif font-medium">{item.name}</p>
                                            <p className="text-stone-500 text-xs">Quantity: {item.qty} &bull; Price: ${item.price.toLocaleString()}</p>
                                        </div>
                                        <p className="text-stone-850 font-semibold">${(item.price * item.qty).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-stone-50 border border-stone-200/60 rounded-lg p-6 shadow-sm print:bg-white print:border-stone-300">
                            <h3 className="text-lg font-serif text-stone-900 mb-4 flex items-center gap-2 print:border-b print:pb-2">
                                <MapPin size={18} className="text-gemRed print:hidden" /> Delivery Address
                            </h3>
                            <p className="text-stone-900 font-semibold">{order.shippingAddress.fullName}</p>
                            <p className="text-stone-600 text-sm mt-1">{order.shippingAddress.address}</p>
                            <p className="text-stone-600 text-sm">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                            <p className="text-stone-600 text-sm">{order.shippingAddress.country}</p>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-stone-50 border border-stone-200/60 p-6 h-fit sticky top-28 rounded-lg shadow-sm print:bg-white print:border-stone-300 print:relative print:top-0 print-full-width">
                        <h3 className="text-lg font-serif text-stone-900 mb-5 pb-4 border-b border-stone-200 print:border-stone-300">Amount Due</h3>
                        <div className="space-y-3 mb-5">
                            <div className="flex justify-between text-sm text-stone-600">
                                <span>Items ({order.orderItems.reduce((sum, i) => sum + i.qty, 0)})</span>
                                <span className="font-medium">${order.itemsPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-stone-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-stone-900 text-lg font-semibold pt-4 border-t border-stone-200 print:border-stone-300">
                            <span className="font-serif">Total</span>
                            <span className="text-gemRed">${order.totalPrice.toLocaleString()}</span>
                        </div>

                        <div className="mt-8 space-y-3 print-hidden">
                            <button
                                onClick={() => window.print()}
                                className="flex items-center justify-center gap-2 w-full text-center border border-stone-300 bg-white text-stone-600 font-semibold uppercase tracking-widest text-sm py-3 hover:border-gemRed hover:text-gemRed hover:bg-stone-50 transition-all duration-300 rounded cursor-pointer"
                            >
                                <Printer size={16} /> Print Invoice
                            </button>
                            
                            {(order.status === 'Processing' || order.status === 'Confirmed') && (
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={cancelling}
                                    className="flex items-center justify-center gap-2 w-full text-center bg-red-600 text-white font-semibold uppercase tracking-widest text-sm py-3 hover:bg-red-700 disabled:bg-red-400 transition-all duration-300 rounded cursor-pointer"
                                >
                                    <XCircle size={16} /> {cancelling ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                            )}

                            <Link to="/my-orders"
                                className="block w-full text-center bg-stone-900 text-white font-semibold uppercase tracking-widest text-sm py-3 hover:bg-stone-850 transition-all duration-300 rounded">
                                View All Orders
                            </Link>
                            <Link to="/shop"
                                className="block w-full text-center border border-stone-300 bg-white text-stone-600 font-semibold uppercase tracking-widest text-sm py-3 hover:border-stone-900 hover:text-stone-900 hover:bg-stone-50 transition-all duration-300 rounded">
                                Continue Shopping
                            </Link>
                        </div>
                        
                        <div className="hidden print:block text-center text-xs text-stone-400 mt-8 pt-4 border-t">
                            Thank you for shopping with Aura Gems. If you have any questions, please contact support@auragems.com.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;

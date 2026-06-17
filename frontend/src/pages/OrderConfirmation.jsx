import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Clock, ArrowLeft, ShoppingCart, XCircle, Printer } from 'lucide-react';
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
        <div className="pt-28 pb-20 min-h-screen bg-stone-50/30 print:bg-white print:pt-4 print:pb-4">
            {/* Print styling overrides */}
            <style dangerouslySetInnerHTML={{
                __html: `
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
                    <div className="text-center mb-12 print-hidden animate-fadeIn">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-5 shadow-sm border border-emerald-100">
                            <CheckCircle size={36} className="text-emerald-500 animate-pulse" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif text-stone-900 font-medium tracking-wide">Order Confirmed!</h1>
                        <div className="h-0.5 w-16 bg-gemRed mx-auto mt-4 mb-4"></div>
                        <p className="text-stone-650 max-w-md mx-auto text-sm leading-relaxed">
                            Thank you for your purchase. Your order <span className="text-stone-900 font-semibold underline decoration-gemRed decoration-2">#{order._id.slice(-8).toUpperCase()}</span> has been successfully placed.
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
                        <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-6 flex items-center gap-4 text-rose-800 animate-fadeIn">
                            <XCircle size={36} className="text-rose-500 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-base uppercase tracking-wider font-serif">Order Cancelled</h4>
                                <p className="text-sm text-rose-700 mt-1">This order has been cancelled and the inventory stock has been restored.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-stone-200/70 rounded-xl p-6 shadow-sm">
                            <h3 className="text-sm uppercase tracking-wider text-stone-900 font-bold mb-6 flex items-center gap-2">
                                <Clock size={16} className="text-gemRed" /> Order Progress
                            </h3>
                            <div className="relative px-2">
                                {/* Connecting line */}
                                <div className="absolute top-5 left-8 right-8 h-0.5 bg-stone-100 -translate-y-1/2 hidden md:block" />
                                {currentStepIndex > 0 && (
                                    <div
                                        className="absolute top-5 left-8 h-0.5 bg-gemRed -translate-y-1/2 transition-all duration-500 hidden md:block"
                                        style={{ width: `calc(${(currentStepIndex / (statusSteps.length - 1)) * 100}% - 2rem)` }}
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
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-500 border-2 ${
                                                    isCompleted
                                                        ? 'bg-gemRed border-gemRed text-white shadow-sm'
                                                        : isActive
                                                            ? 'bg-white border-gemRed text-gemRed shadow-md scale-110 font-bold'
                                                            : 'bg-white border-stone-200 text-stone-400'
                                                }`}>
                                                    {isCompleted ? '✓' : idx + 1}
                                                </div>
                                                {/* Label */}
                                                <div className="ml-4 md:ml-0 md:mt-3 text-left md:text-center">
                                                    <p className={`text-[11px] font-bold uppercase tracking-wider ${
                                                        isActive ? 'text-gemRed font-bold scale-105' : isCompleted ? 'text-stone-800' : 'text-stone-400'
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
                        <div className="bg-white border border-stone-200/70 rounded-xl p-6 shadow-sm print:bg-white print:border-stone-300">
                            <h3 className="text-sm uppercase tracking-wider text-stone-900 font-bold mb-4 flex items-center gap-2 border-b border-stone-100 pb-3 print:pb-2">
                                <Clock size={16} className="text-gemRed print:hidden" /> Order Information
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                                <div>
                                    <p className="text-stone-400 text-[10px] uppercase tracking-wider font-semibold mb-1">Status</p>
                                    <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider rounded-full font-bold border inline-block ${
                                        order.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' :
                                        order.status === 'Processing' ? 'bg-amber-500/10 text-amber-700 border-amber-500/20' :
                                        order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-700 border-blue-500/20' :
                                        order.status === 'Delivered' ? 'bg-teal-500/10 text-teal-700 border-teal-500/20' :
                                        'bg-rose-500/10 text-rose-700 border-rose-500/20'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-stone-400 text-[10px] uppercase tracking-wider font-semibold mb-1">Order Date</p>
                                    <p className="text-stone-800 font-semibold">{formattedDate}</p>
                                </div>
                                {order.status !== 'Cancelled' && (
                                    <div>
                                        <p className="text-stone-400 text-[10px] uppercase tracking-wider font-semibold mb-1">Estimated Delivery</p>
                                        <p className="text-stone-850 font-semibold">{estimatedDelivery}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-stone-400 text-[10px] uppercase tracking-wider font-semibold mb-1">Payment Method</p>
                                    <p className="text-stone-850 font-semibold">{order.paymentMethod}</p>
                                </div>
                                <div>
                                    <p className="text-stone-400 text-[10px] uppercase tracking-wider font-semibold mb-1">Payment Status</p>
                                    <div className="mt-1">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                            order.isPaid 
                                                ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' 
                                                : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                                        }`}>
                                            {order.isPaid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </div>
                                    {order.isPaid && order.paidAt && (
                                        <p className="text-stone-400 text-[9px] uppercase tracking-wider mt-1">
                                            Paid on {new Date(order.paidAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <div className="sm:col-span-2 border-t border-stone-100 pt-3 mt-1">
                                    <p className="text-stone-400 text-[10px] uppercase tracking-wider font-semibold mb-1">Order ID</p>
                                    <p className="text-stone-800 font-mono text-xs select-all bg-stone-50 px-2.5 py-1.5 rounded border border-stone-100 inline-block w-full break-all">{order._id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="bg-white border border-stone-200/70 rounded-xl p-6 shadow-sm print:bg-white print:border-stone-300">
                            <h3 className="text-sm uppercase tracking-wider text-stone-900 font-bold mb-4 flex items-center gap-2 border-b border-stone-100 pb-3 print:pb-2">
                                <Package size={16} className="text-gemRed print:hidden" /> Purchased Items
                            </h3>
                            <div className="divide-y divide-stone-100">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 py-4 first:pt-1 last:pb-1">
                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-stone-100 print:hidden" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-stone-900 font-serif font-semibold text-base truncate">{item.name}</p>
                                            <p className="text-stone-400 text-xs mt-1">Quantity: <span className="text-stone-700 font-semibold">{item.qty}</span> &bull; Price: <span className="text-stone-700 font-semibold">${item.price.toLocaleString()}</span></p>
                                        </div>
                                        <p className="text-stone-900 font-bold text-base whitespace-nowrap">${(item.price * item.qty).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white border border-stone-200/70 rounded-xl p-6 shadow-sm print:bg-white print:border-stone-300">
                            <h3 className="text-sm uppercase tracking-wider text-stone-900 font-bold mb-4 flex items-center gap-2 border-b border-stone-100 pb-3 print:pb-2">
                                <MapPin size={16} className="text-gemRed print:hidden" /> Delivery Address
                            </h3>
                            <p className="text-stone-900 font-bold text-base">{order.shippingAddress.fullName}</p>
                            <div className="text-stone-600 text-sm mt-2 space-y-1">
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state && `${order.shippingAddress.state}, `}{order.shippingAddress.postalCode}</p>
                                <p className="font-semibold text-stone-750 mt-1">{order.shippingAddress.country}</p>
                            </div>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-white border border-stone-200/75 p-6 h-fit sticky top-28 rounded-xl shadow-sm print:bg-white print:border-stone-300 print:relative print:top-0 print-full-width">
                        <h3 className="text-sm uppercase tracking-wider text-stone-900 font-bold mb-5 pb-4 border-b border-stone-100 print:border-stone-300">Amount Due</h3>
                        <div className="space-y-3 mb-5 text-sm">
                            <div className="flex justify-between text-stone-550">
                                <span>Items ({order.orderItems.reduce((sum, i) => sum + i.qty, 0)})</span>
                                <span className="font-semibold text-stone-850">${order.itemsPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-stone-550">
                                <span>Shipping</span>
                                <span className="text-emerald-600 font-bold uppercase tracking-wider text-xs">Free</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-stone-900 text-lg font-bold pt-4 border-t border-dashed border-stone-200 print:border-stone-300">
                            <span className="font-serif">Total</span>
                            <span className="text-gemRed text-xl font-bold font-serif">${order.totalPrice.toLocaleString()}</span>
                        </div>

                        <div className="mt-8 space-y-3 print-hidden">
                            <button
                                onClick={() => window.print()}
                                className="flex items-center justify-center gap-2 w-full text-center border border-stone-250 bg-white text-stone-600 font-bold uppercase tracking-widest text-xs py-3.5 hover:border-gemRed hover:text-gemRed hover:bg-stone-50/50 transition-all duration-300 rounded-lg cursor-pointer shadow-sm hover:shadow"
                            >
                                <Printer size={14} /> Print Invoice
                            </button>

                            {(order.status === 'Processing' || order.status === 'Confirmed') && (
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={cancelling}
                                    className="flex items-center justify-center gap-2 w-full text-center bg-rose-600 text-white font-bold uppercase tracking-widest text-xs py-3.5 hover:bg-rose-700 disabled:bg-rose-400 transition-all duration-300 rounded-lg cursor-pointer shadow-sm hover:shadow-md"
                                >
                                    <XCircle size={14} /> {cancelling ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                            )}

                            <Link to="/my-orders"
                                className="block w-full text-center bg-stone-900 text-white font-bold uppercase tracking-widest text-xs py-3.5 hover:bg-stone-800 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md">
                                View All Orders
                            </Link>
                            <Link to="/shop"
                                className="block w-full text-center border border-stone-250 bg-white text-stone-600 font-bold uppercase tracking-widest text-xs py-3.5 hover:border-stone-850 hover:text-stone-850 hover:bg-stone-50/30 transition-all duration-300 rounded-lg shadow-sm">
                                Continue Shopping
                            </Link>
                        </div>

                        <div className="hidden print:block text-center text-[10px] text-stone-400 mt-8 pt-4 border-t border-dashed">
                            Thank you for shopping with Aura Gems. If you have any questions, please contact support@auragems.com.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;

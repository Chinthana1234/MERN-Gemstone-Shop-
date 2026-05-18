import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Clock, ArrowLeft, ShoppingBag } from 'lucide-react';
import API from '../utils/api';

function OrderConfirmation() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (loading) {
        return (
            <div className="pt-28 pb-20 min-h-screen bg-gemBgAlt flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-gemBorder border-t-gemRed rounded-full animate-spin"></div>
                    <p className="text-gemTextLight text-sm uppercase tracking-widest">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="pt-28 pb-20 min-h-screen bg-gemBgAlt flex flex-col items-center justify-center">
                <h2 className="text-2xl font-serif text-gemText mb-3">Order Not Found</h2>
                <p className="text-gemTextLight mb-8">{error || 'This order does not exist.'}</p>
                <Link to="/shop" className="text-gemRed hover:underline">← Back to Shop</Link>
            </div>
        );
    }

    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const estimatedDelivery = new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="pt-28 pb-20 min-h-screen bg-gemBgAlt">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Success Banner */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounceIn">
                        <CheckCircle size={40} className="text-green-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif text-gemText mb-3">Order Confirmed!</h1>
                    <div className="h-0.5 w-24 bg-gemRed mx-auto mb-4"></div>
                    <p className="text-gemTextLight">
                        Thank you for your purchase. Your order <span className="text-gemRed font-semibold">#{order._id.slice(-8).toUpperCase()}</span> has been placed.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status & Timeline */}
                        <div className="bg-gemCard border border-gemBorder rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-serif text-gemText mb-4 flex items-center gap-2">
                                <Clock size={18} className="text-gemRed" /> Order Status
                            </h3>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-3 py-1 text-xs uppercase tracking-widest rounded-full font-semibold ${
                                    order.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                    order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gemTextMuted text-xs uppercase tracking-widest mb-1">Order Date</p>
                                    <p className="text-gemText">{formattedDate}</p>
                                </div>
                                <div>
                                    <p className="text-gemTextMuted text-xs uppercase tracking-widest mb-1">Estimated Delivery</p>
                                    <p className="text-gemText">{estimatedDelivery}</p>
                                </div>
                                <div>
                                    <p className="text-gemTextMuted text-xs uppercase tracking-widest mb-1">Payment Method</p>
                                    <p className="text-gemText">{order.paymentMethod}</p>
                                </div>
                                <div>
                                    <p className="text-gemTextMuted text-xs uppercase tracking-widest mb-1">Order ID</p>
                                    <p className="text-gemText font-mono text-xs">{order._id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="bg-gemCard border border-gemBorder rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-serif text-gemText mb-4 flex items-center gap-2">
                                <Package size={18} className="text-gemRed" /> Order Items
                            </h3>
                            <div className="divide-y divide-gemBorder">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 py-4">
                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                        <div className="flex-1">
                                            <p className="text-gemText font-serif">{item.name}</p>
                                            <p className="text-gemTextMuted text-xs">Qty: {item.qty}</p>
                                        </div>
                                        <p className="text-gemText font-medium">${(item.price * item.qty).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-gemCard border border-gemBorder rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-serif text-gemText mb-4 flex items-center gap-2">
                                <MapPin size={18} className="text-gemRed" /> Shipping Address
                            </h3>
                            <p className="text-gemText">{order.shippingAddress.fullName}</p>
                            <p className="text-gemTextLight text-sm">{order.shippingAddress.address}</p>
                            <p className="text-gemTextLight text-sm">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                            <p className="text-gemTextLight text-sm">{order.shippingAddress.country}</p>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-gemCard border border-gemBorder p-6 h-fit sticky top-28 rounded-lg shadow-sm">
                        <h3 className="text-lg font-serif text-gemText mb-5 pb-4 border-b border-gemBorder">Price Summary</h3>
                        <div className="space-y-3 mb-5">
                            <div className="flex justify-between text-sm text-gemTextLight">
                                <span>Items ({order.orderItems.reduce((sum, i) => sum + i.qty, 0)})</span>
                                <span>${order.itemsPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gemTextLight">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-gemText text-lg font-semibold pt-4 border-t border-gemBorder">
                            <span className="font-serif">Total</span>
                            <span>${order.totalPrice.toLocaleString()}</span>
                        </div>

                        <div className="mt-8 space-y-3">
                            <Link to="/my-orders"
                                className="block w-full text-center bg-gemRed text-white font-semibold uppercase tracking-widest text-sm py-3 hover:bg-gemRedDark transition-all duration-300 rounded">
                                View All Orders
                            </Link>
                            <Link to="/shop"
                                className="block w-full text-center border-2 border-gemBorder text-gemTextLight font-semibold uppercase tracking-widest text-sm py-3 hover:border-gemRed hover:text-gemRed transition-all duration-300 rounded">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;

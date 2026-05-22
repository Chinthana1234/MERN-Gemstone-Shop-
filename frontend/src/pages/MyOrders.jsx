import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import API from '../utils/api';

const STATUS_CONFIG = {
    Processing: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    Confirmed: { icon: CheckCircle, color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    Shipped: { icon: Truck, color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    Delivered: { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    Cancelled: { icon: XCircle, color: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
};

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        const matchesSearch = searchTerm === '' ||
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderItems.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    if (loading) {
        return (
            <div className="pt-28 pb-20 min-h-screen bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="h-4 bg-stone-200 w-32 mx-auto mb-4 rounded animate-pulse"></div>
                        <div className="h-8 bg-stone-200 w-48 mx-auto rounded animate-pulse"></div>
                    </div>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white border border-stone-200/60 rounded-lg p-6 mb-4 animate-pulse animate-pulse shadow-sm">
                            <div className="flex justify-between">
                                <div className="space-y-3 flex-1">
                                    <div className="h-3 bg-stone-200 w-1/4 rounded"></div>
                                    <div className="h-5 bg-stone-200 w-1/3 rounded"></div>
                                    <div className="h-3 bg-stone-200 w-1/2 rounded"></div>
                                </div>
                                <div className="h-8 bg-stone-200 w-20 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-20 min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-14">
                    <span className="text-gemRed tracking-[0.3em] text-xs uppercase font-semibold">Your Account</span>
                    <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mt-3 mb-4">My Orders</h1>
                    <div className="h-0.5 w-24 bg-gemRed mx-auto"></div>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <Package size={64} className="text-stone-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-serif text-stone-900 mb-3">No Orders Yet</h2>
                        <p className="text-stone-600 mb-8">Your order history will appear here once you make a purchase.</p>
                        <Link to="/shop"
                            className="bg-gemRed text-white font-semibold uppercase tracking-widest text-sm px-10 py-3 hover:bg-gemRedDark transition-all duration-300 rounded inline-block">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Search & Filters */}
                        <div className="bg-stone-50 border border-stone-200/60 rounded-lg p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Search Box */}
                            <div className="relative flex-1 max-w-md w-full">
                                <input
                                    type="text"
                                    placeholder="Search by order ID or gem name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white border border-stone-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded px-4 py-2.5 text-sm text-stone-850 outline-none transition-colors"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-semibold cursor-pointer"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Status Filter Buttons */}
                            <div className="flex flex-wrap gap-2">
                                {['All', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all duration-200 border cursor-pointer ${
                                            statusFilter === status
                                                ? 'bg-stone-900 border-stone-900 text-white shadow-sm'
                                                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-900 hover:text-stone-900'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-16 bg-stone-50 border border-stone-200/60 rounded-lg shadow-sm">
                                <Package size={48} className="text-stone-400 mx-auto mb-4" />
                                <h3 className="text-lg font-serif text-stone-900 mb-2">No Matching Orders</h3>
                                <p className="text-stone-500 text-sm mb-6">No orders match your current search or status filter.</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                                    className="border border-stone-300 bg-white hover:border-stone-900 hover:text-stone-900 text-stone-600 px-6 py-2 text-xs font-semibold uppercase tracking-widest transition-all rounded cursor-pointer"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-5 animate-fadeIn">
                                {filteredOrders.map(order => {
                                    const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.Processing;
                                    const StatusIcon = config.icon;
                                    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric'
                                    });

                                    return (
                                        <div key={order._id}
                                            className="bg-stone-50 border border-stone-200/60 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                                            {/* Order Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-stone-200">
                                                <div>
                                                    <p className="text-stone-500 text-xs uppercase tracking-widest mb-1 font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                                                    <p className="text-stone-650 text-sm">Placed on {orderDate}</p>
                                                </div>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-widest rounded-full font-semibold ${
                                                        order.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {order.isPaid ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-widest rounded-full font-semibold ${config.color}`}>
                                                        <StatusIcon size={14} />
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Order Items Preview */}
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="flex -space-x-3">
                                                    {order.orderItems.slice(0, 4).map((item, idx) => (
                                                        <img key={idx} src={item.imageUrl} alt={item.name}
                                                            className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-sm" />
                                                    ))}
                                                    {order.orderItems.length > 4 && (
                                                        <div className="w-12 h-12 rounded-full border-2 border-white bg-stone-200 flex items-center justify-center text-xs text-stone-500 font-medium shadow-sm">
                                                            +{order.orderItems.length - 4}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-stone-900 text-sm font-semibold">
                                                        {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                                                    </p>
                                                    <p className="text-stone-500 text-xs mt-0.5">
                                                        {order.orderItems.map(i => i.name).join(', ')}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Order Footer */}
                                            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                                                <div>
                                                    <p className="text-stone-500 text-xs uppercase tracking-widest font-semibold">Total</p>
                                                    <p className="text-stone-900 text-lg font-semibold">${order.totalPrice.toLocaleString()}</p>
                                                </div>
                                                <Link to={`/order/${order._id}`}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-300 bg-white text-stone-600 hover:border-gemRed hover:text-gemRed hover:bg-stone-50 uppercase tracking-widest text-xs font-semibold transition-all duration-300 rounded">
                                                    <Eye size={14} /> View Details
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default MyOrders;

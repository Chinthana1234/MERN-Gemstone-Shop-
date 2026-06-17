import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import API from '../utils/api';

const STATUS_CONFIG = {
    Processing: { icon: Clock, color: 'bg-amber-500/10 text-amber-700 border-amber-500/20', dot: 'bg-amber-500' },
    Confirmed: { icon: CheckCircle, color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20', dot: 'bg-emerald-500' },
    Shipped: { icon: Truck, color: 'bg-blue-500/10 text-blue-700 border-blue-500/20', dot: 'bg-blue-500' },
    Delivered: { icon: CheckCircle, color: 'bg-teal-500/10 text-teal-700 border-teal-500/20', dot: 'bg-teal-500' },
    Cancelled: { icon: XCircle, color: 'bg-rose-500/10 text-rose-700 border-rose-500/20', dot: 'bg-rose-500' }
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
            <div className="pt-28 pb-20 min-h-screen bg-stone-50/30">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="h-4 bg-stone-200 w-32 mx-auto mb-4 rounded animate-pulse"></div>
                        <div className="h-8 bg-stone-200 w-48 mx-auto rounded animate-pulse"></div>
                    </div>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white border border-stone-200/60 rounded-xl p-6 mb-4 animate-pulse shadow-sm">
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
        <div className="pt-28 pb-20 min-h-screen bg-stone-50/30">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-14">
                    <span className="text-gemRed tracking-[0.3em] text-xs uppercase font-bold">Your Account</span>
                    <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mt-3 mb-4 tracking-wide">My Orders</h1>
                    <div className="h-0.5 w-20 bg-gemRed mx-auto"></div>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-stone-200/60 rounded-2xl p-8 shadow-sm">
                        <Package size={64} className="text-stone-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-serif text-stone-900 mb-3">No Orders Yet</h2>
                        <p className="text-stone-600 mb-8">Your order history will appear here once you make a purchase.</p>
                        <Link to="/shop"
                            className="bg-gemRed text-white font-semibold uppercase tracking-widest text-sm px-10 py-3.5 hover:bg-gemRedDark hover:shadow-lg transition-all duration-300 rounded-lg inline-block">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Search & Filters */}
                        <div className="bg-white border border-stone-200/65 rounded-xl p-5 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
                            {/* Search Box */}
                            <div className="relative flex-1 max-w-md w-full">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by order ID or gem name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-stone-50/50 border border-stone-200 focus:border-stone-850 rounded-lg pl-10 pr-10 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none transition-all duration-300"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-semibold uppercase tracking-wider cursor-pointer border-none bg-transparent"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Status Filter Buttons */}
                            <div className="flex flex-wrap gap-1.5">
                                {['All', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 border cursor-pointer ${
                                            statusFilter === status
                                                ? 'bg-stone-900 border-stone-900 text-white shadow-sm'
                                                : 'bg-white border-stone-200 text-stone-550 hover:border-stone-800 hover:text-stone-800'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-16 bg-white border border-stone-200/60 rounded-xl shadow-sm">
                                <Package size={48} className="text-stone-300 mx-auto mb-4" />
                                <h3 className="text-lg font-serif text-stone-900 mb-2">No Matching Orders</h3>
                                <p className="text-stone-500 text-sm mb-6">No orders match your current search or status filter.</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                                    className="border border-stone-300 bg-white hover:border-stone-800 hover:text-stone-800 text-stone-600 px-6 py-2 text-xs font-semibold uppercase tracking-widest transition-all rounded-lg cursor-pointer"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fadeIn">
                                {filteredOrders.map(order => {
                                    const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.Processing;
                                    const StatusIcon = config.icon;
                                    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric'
                                    });

                                    return (
                                        <div key={order._id}
                                            className="bg-white border border-stone-200/70 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-gemRed/30 transition-all duration-300 group">
                                            
                                            {/* Order Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-stone-100">
                                                <div>
                                                    <div className="flex items-center gap-2.5 flex-wrap">
                                                        <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono text-[11px] font-semibold">
                                                            #{order._id.slice(-8).toUpperCase()}
                                                        </span>
                                                        <span className="text-stone-300 text-xs">•</span>
                                                        <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold">Placed {orderDate}</p>
                                                    </div>
                                                    <p className="text-stone-400 text-[10px] mt-1 font-mono">{order._id}</p>
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase tracking-wider rounded-full font-semibold border ${
                                                        order.isPaid 
                                                            ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' 
                                                            : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${order.isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                        {order.isPaid ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase tracking-wider rounded-full font-semibold border ${config.color}`}>
                                                        <span className="relative flex h-1.5 w-1.5">
                                                            {(order.status === 'Processing' || order.status === 'Confirmed') && (
                                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-75`}></span>
                                                            )}
                                                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`}></span>
                                                        </span>
                                                        <StatusIcon size={11} className="shrink-0" />
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Order Items Preview */}
                                            <div className="flex items-center gap-5 mb-5">
                                                <div className="flex -space-x-3 items-center">
                                                    {order.orderItems.slice(0, 4).map((item, idx) => (
                                                        <div key={idx} className="relative group/img">
                                                            <img src={item.imageUrl} alt={item.name}
                                                                className="w-14 h-14 object-cover rounded-xl border-2 border-white shadow-sm transition-transform duration-300 group-hover/img:scale-105" />
                                                        </div>
                                                    ))}
                                                    {order.orderItems.length > 4 && (
                                                        <div className="w-14 h-14 rounded-xl border-2 border-white bg-stone-100 flex items-center justify-center text-xs text-stone-500 font-semibold shadow-sm">
                                                            +{order.orderItems.length - 4}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-stone-850 text-sm font-semibold truncate">
                                                        {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                                                    </p>
                                                    <p className="text-stone-400 text-xs mt-1 truncate">
                                                        {order.orderItems.map(i => i.name).join(', ')}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Order Footer */}
                                            <div className="flex items-center justify-between pt-5 border-t border-stone-100">
                                                <div>
                                                    <p className="text-stone-400 text-[10px] uppercase tracking-wider font-semibold">Total Amount</p>
                                                    <p className="text-stone-900 text-xl font-bold font-serif mt-0.5">${order.totalPrice.toLocaleString()}</p>
                                                </div>
                                                <Link to={`/order/${order._id}`}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-200 bg-white text-stone-600 hover:border-gemRed hover:text-gemRed hover:bg-stone-50/50 uppercase tracking-widest text-xs font-bold transition-all duration-300 rounded-lg shadow-sm hover:shadow">
                                                    <Eye size={13} /> View Details
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

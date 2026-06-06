import React, { useState, useEffect, useRef } from 'react';
import API from '../utils/api';
import { Package, ShoppingCart, TrendingUp, Edit, Trash2, CheckCircle, Clock, Truck, XCircle, X, User, Mail, MapPin, CreditCard } from 'lucide-react';

const GEMSTONE_CATEGORIES = [
    'Blue Sapphire',
    'Yellow Sapphire',
    'White Sapphire',
    'Spessartine Garnet',
    'Ruby',
    'Emerald',
    "Cat's Eye"
];

const JEWELRY_CATEGORIES = [
    'Rings',
    'Necklaces',
    'Earrings',
    'Bracelets'
];

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // For editing/adding products
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({ name: '', price: '', category: '', stock: '', carat: '', imageUrl: '', imageUrl2: '', description: '' });
    const [productType, setProductType] = useState('Gemstone'); // 'Gemstone' or 'Jewelry'
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [uploading, setUploading] = useState(false);
    const formRef = useRef(null);

    // For order search/filters/modal
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [orderSearchTerm, setOrderSearchTerm] = useState('');
    const [orderStatusFilter, setOrderStatusFilter] = useState('All');
    const [orderPaymentFilter, setOrderPaymentFilter] = useState('All');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersRes, productsRes, reviewsRes] = await Promise.all([
                API.get('/orders'),
                API.get('/products?fetchAll=true'),
                API.get('/products/reviews/all').catch((err) => {
                    console.error("Error fetching reviews:", err);
                    return { data: [] };
                })
            ]);
            setOrders(ordersRes.data);
            setProducts(productsRes.data.products || []);
            setReviews(reviewsRes.data || []);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (productId, reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await API.delete(`/products/${productId}/reviews/${reviewId}`);
                fetchData();
            } catch (error) {
                console.error("Error deleting review:", error);
                alert(error.response?.data?.message || "Failed to delete review");
            }
        }
    };



    const handleDeliverOrder = async (id) => {
        try {
            await API.put(`/orders/${id}/deliver`);
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        setStatusUpdating(true);
        try {
            const { data } = await API.put(`/orders/${id}/status`, { status: newStatus });
            if (selectedOrder && selectedOrder._id === id) {
                setSelectedOrder(data);
            }
            fetchData();
        } catch (error) {
            console.error("Error updating order status:", error);
            alert(error.response?.data?.message || "Failed to update order status");
        } finally {
            setStatusUpdating(false);
        }
    };

    const getOrderStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed':
                return <span className="inline-flex items-center gap-1 text-green-500 bg-green-500/10 px-2.5 py-1 rounded w-max"><CheckCircle size={14} /> Confirmed</span>;
            case 'Processing':
                return <span className="inline-flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded w-max"><Clock size={14} /> Processing</span>;
            case 'Shipped':
                return <span className="inline-flex items-center gap-1 text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded w-max"><Truck size={14} /> Shipped</span>;
            case 'Delivered':
                return <span className="inline-flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded w-max"><CheckCircle size={14} /> Delivered</span>;
            case 'Cancelled':
                return <span className="inline-flex items-center gap-1 text-red-500 bg-red-500/10 px-2.5 py-1 rounded w-max"><XCircle size={14} /> Cancelled</span>;
            default:
                return <span className="inline-flex items-center gap-1 text-stone-500 bg-stone-500/10 px-2.5 py-1 rounded w-max">{status}</span>;
        }
    };

    const filteredOrders = orders.filter(order => {
        const customerName = order.user ? order.user.name : 'Deleted User';
        const matchesSearch = orderSearchTerm === '' ||
            order._id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
            customerName.toLowerCase().includes(orderSearchTerm.toLowerCase());
        const matchesStatus = orderStatusFilter === 'All' || order.status === orderStatusFilter;
        const matchesPayment = orderPaymentFilter === 'All' ||
            (orderPaymentFilter === 'Paid' && order.isPaid) ||
            (orderPaymentFilter === 'Unpaid' && !order.isPaid);
        return matchesSearch && matchesStatus && matchesPayment;
    });

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await API.delete(`/products/${id}`);
                fetchData();
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const handleImageUpload = async (e, field = 'primary') => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);

        try {
            // Securely upload through our backend /api/upload endpoint
            const { data } = await API.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.url) {
                if (field === 'secondary') {
                    setProductForm(prev => ({ ...prev, imageUrl2: data.url }));
                } else {
                    setProductForm(prev => ({ ...prev, imageUrl: data.url }));
                }
            } else {
                throw new Error("Failed to upload image");
            }

            setUploading(false);
        } catch (error) {
            console.error("Error uploading image:", error);
            const errMsg = error.response?.data?.message || error.message;
            alert("Image upload failed: " + errMsg);
            setUploading(false);
        }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await API.put(`/products/${editingProduct._id}`, productForm);
            } else {
                await API.post('/products', productForm);
            }
            setEditingProduct(null);
            setProductForm({ name: '', price: '', category: '', stock: '', carat: '', imageUrl: '', imageUrl2: '', description: '' });
            setProductType('Gemstone');
            setIsCustomCategory(false);
            fetchData();
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Error saving product. Make sure all fields are filled properly.");
        }
    };

    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gemBgAlt">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <h1 className="text-3xl font-serif text-gemText mb-8">Admin Dashboard</h1>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gemBorder mb-8 overflow-x-auto">
                    <button onClick={() => setActiveTab('overview')} className={`whitespace-nowrap pb-3 uppercase tracking-widest text-sm font-semibold transition-colors ${activeTab === 'overview' ? 'text-gemRed border-b-2 border-gemRed' : 'text-gemTextLight hover:text-gemText'}`}>Overview</button>
                    <button onClick={() => setActiveTab('products')} className={`whitespace-nowrap pb-3 uppercase tracking-widest text-sm font-semibold transition-colors ${activeTab === 'products' ? 'text-gemRed border-b-2 border-gemRed' : 'text-gemTextLight hover:text-gemText'}`}>Products</button>
                    <button onClick={() => setActiveTab('orders')} className={`whitespace-nowrap pb-3 uppercase tracking-widest text-sm font-semibold transition-colors ${activeTab === 'orders' ? 'text-gemRed border-b-2 border-gemRed' : 'text-gemTextLight hover:text-gemText'}`}>Orders</button>
                    <button onClick={() => setActiveTab('reviews')} className={`whitespace-nowrap pb-3 uppercase tracking-widest text-sm font-semibold transition-colors ${activeTab === 'reviews' ? 'text-gemRed border-b-2 border-gemRed' : 'text-gemTextLight hover:text-gemText'}`}>Reviews</button>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gemTextLight flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gemRed"></div>
                        Loading data...
                    </div>
                ) : (
                    <>
                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gemCard p-6 rounded border border-gemBorder flex items-center gap-4">
                                    <div className="p-3 bg-gemBgAlt rounded text-gemRed"><TrendingUp size={24} /></div>
                                    <div>
                                        <p className="text-sm text-gemTextLight uppercase tracking-widest">Total Sales</p>
                                        <p className="text-2xl font-serif text-gemText">${totalSales.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="bg-gemCard p-6 rounded border border-gemBorder flex items-center gap-4">
                                    <div className="p-3 bg-gemBgAlt rounded text-gemRed"><ShoppingCart size={24} /></div>
                                    <div>
                                        <p className="text-sm text-gemTextLight uppercase tracking-widest">Total Orders</p>
                                        <p className="text-2xl font-serif text-gemText">{orders.length}</p>
                                    </div>
                                </div>
                                <div className="bg-gemCard p-6 rounded border border-gemBorder flex items-center gap-4">
                                    <div className="p-3 bg-gemBgAlt rounded text-gemRed"><Package size={24} /></div>
                                    <div>
                                        <p className="text-sm text-gemTextLight uppercase tracking-widest">Total Products</p>
                                        <p className="text-2xl font-serif text-gemText">{products.length}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PRODUCTS TAB */}
                        {activeTab === 'products' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-serif text-gemText">Inventory Management</h2>
                                </div>

                                {/* Add/Edit Form */}
                                <div ref={formRef} className="bg-gemCard border border-gemBorder p-6 rounded mb-8">
                                    <h3 className="text-lg text-gemText mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                    <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1 md:col-span-2">
                                            <label className="text-xs text-gemTextLight uppercase tracking-wider font-semibold">Product Type</label>
                                            <select
                                                value={productType}
                                                onChange={(e) => {
                                                    const type = e.target.value;
                                                    setProductType(type);
                                                    if (type === 'Jewelry') {
                                                        setProductForm(prev => ({ ...prev, carat: '0' }));
                                                    }
                                                }}
                                                className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none cursor-pointer rounded w-full"
                                            >
                                                <option value="Gemstone">Gemstone (requires Carat Weight)</option>
                                                <option value="Jewelry">Jewelry (no Carat Weight)</option>
                                            </select>
                                        </div>
                                        <input type="text" placeholder="Product Name" required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none" />
                                        <div className="flex flex-col gap-2">
                                            <select
                                                value={isCustomCategory ? 'custom' : productForm.category}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === 'custom') {
                                                        setIsCustomCategory(true);
                                                        setProductForm(prev => ({ ...prev, category: '' }));
                                                    } else {
                                                        setIsCustomCategory(false);
                                                        setProductForm(prev => ({ ...prev, category: val }));
                                                    }
                                                }}
                                                className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none cursor-pointer rounded w-full"
                                                required
                                            >
                                                <option value="" disabled>Select Category</option>
                                                {(productType === 'Gemstone' ? GEMSTONE_CATEGORIES : JEWELRY_CATEGORIES).map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                                <option value="custom">+ Add Custom Category...</option>
                                            </select>
                                            {isCustomCategory && (
                                                <input
                                                    type="text"
                                                    placeholder="Enter Custom Category"
                                                    required
                                                    value={productForm.category}
                                                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                                                    className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none w-full"
                                                />
                                            )}
                                        </div>
                                        <input type="number" placeholder="Price ($)" required value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none" />
                                        <input type="number" placeholder="Stock Quantity" required value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none" />

                                        {productType === 'Gemstone' ? (
                                            <input type="number" step="0.01" placeholder="Carat Weight" required value={productForm.carat} onChange={e => setProductForm({ ...productForm, carat: e.target.value })} className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none" />
                                        ) : (
                                            <div className="bg-gemBgAlt/30 border border-gemBorder/50 text-gemTextLight p-3 select-none flex items-center justify-center text-sm italic rounded">
                                                No Carat weight required for Jewelry
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-gemTextLight uppercase tracking-wider font-semibold">Primary Image</label>
                                            <input type="text" placeholder="Image URL (will auto-populate on upload)" required value={productForm.imageUrl} onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })} className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none w-full" />
                                            <div className="flex items-center gap-3">
                                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'primary')} className="hidden" id="admin-image-upload-file" />
                                                <label htmlFor="admin-image-upload-file" className="bg-gemRed/20 border border-gemRed/40 hover:bg-gemRed/40 text-gemText px-4 py-2.5 text-xs uppercase tracking-wider font-semibold cursor-pointer rounded transition-colors text-center">
                                                    Upload File
                                                </label>
                                                {uploading && <span className="text-xs text-gemGold animate-pulse">Uploading to Cloudinary...</span>}
                                            </div>
                                        </div>

                                        {productType === 'Jewelry' ? (
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs text-gemTextLight uppercase tracking-wider font-semibold">Secondary Image (Jewelry Only)</label>
                                                <input type="text" placeholder="Secondary Image URL (will auto-populate on upload)" value={productForm.imageUrl2 || ''} onChange={e => setProductForm({ ...productForm, imageUrl2: e.target.value })} className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none w-full" />
                                                <div className="flex items-center gap-3">
                                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'secondary')} className="hidden" id="admin-image-upload-file-2" />
                                                    <label htmlFor="admin-image-upload-file-2" className="bg-gemRed/20 border border-gemRed/40 hover:bg-gemRed/40 text-gemText px-4 py-2.5 text-xs uppercase tracking-wider font-semibold cursor-pointer rounded transition-colors text-center">
                                                        Upload Secondary File
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-gemBgAlt/30 border border-gemBorder/50 text-gemTextLight p-3 select-none flex items-center justify-center text-sm italic rounded">
                                                No Secondary Image for Gemstones
                                            </div>
                                        )}

                                        <textarea placeholder="Product Description" required value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none md:col-span-2" rows="3"></textarea>
                                        <div className="md:col-span-2 flex gap-4">
                                            <button type="submit" className="bg-gemRed text-white p-3 uppercase tracking-widest font-semibold hover:bg-gemRedDark w-full transition-colors">
                                                {editingProduct ? 'Update Product' : 'Add Product'}
                                            </button>
                                            {editingProduct && (
                                                <button type="button" onClick={() => { setEditingProduct(null); setProductForm({ name: '', price: '', category: '', stock: '', carat: '', imageUrl: '', imageUrl2: '', description: '' }); setProductType('Gemstone'); setIsCustomCategory(false); }} className="bg-gemBorder text-gemText p-3 uppercase tracking-widest font-semibold hover:bg-gemTextLight hover:text-black w-full transition-colors">
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gemBorder text-gemTextLight uppercase text-xs tracking-widest">
                                                <th className="p-3">ID</th>
                                                <th className="p-3">Product</th>
                                                <th className="p-3">Price</th>
                                                <th className="p-3">Stock</th>
                                                <th className="p-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(product => (
                                                <tr key={product._id} className="border-b border-gemBorder/50 text-gemText text-sm hover:bg-gemCard transition-colors">
                                                    <td className="p-3 font-mono text-xs text-gemTextLight">{product._id.substring(0, 8)}...</td>
                                                    <td className="p-3 flex items-center gap-3">
                                                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded border border-gemBorder" />
                                                        <span className="font-serif">{product.name}</span>
                                                    </td>
                                                    <td className="p-3">${product.price.toLocaleString()}</td>
                                                    <td className="p-3">{product.stock}</td>
                                                    <td className="p-3 text-right">
                                                        <button onClick={() => {
                                                            setEditingProduct(product);
                                                            setProductForm({
                                                                name: product.name || '',
                                                                price: product.price || '',
                                                                category: product.category || '',
                                                                stock: product.stock || '',
                                                                carat: product.carat || '',
                                                                imageUrl: product.imageUrl || '',
                                                                imageUrl2: product.imageUrl2 || '',
                                                                description: product.description || ''
                                                            });
                                                            const isPredef = GEMSTONE_CATEGORIES.includes(product.category) || JEWELRY_CATEGORIES.includes(product.category);
                                                            setIsCustomCategory(!isPredef);
                                                            setProductType(product.carat > 0 ? 'Gemstone' : 'Jewelry');
                                                            setTimeout(() => {
                                                                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                            }, 100);
                                                        }} className="text-gemTextLight hover:text-gemText p-2 transition-colors"><Edit size={16} /></button>
                                                        <button onClick={() => handleDeleteProduct(product._id)} className="text-gemRed p-2 hover:bg-gemRed/10 rounded transition-colors ml-2"><Trash2 size={16} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ORDERS TAB */}
                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-xl font-serif text-gemText mb-6">Customer Orders</h2>

                                {/* Search & Filters */}
                                <div className="bg-gemCard border border-gemBorder p-5 rounded mb-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                                    <div className="flex-1 max-w-md w-full relative">
                                        <input
                                            type="text"
                                            placeholder="Search by Order ID or Customer Name..."
                                            value={orderSearchTerm}
                                            onChange={(e) => setOrderSearchTerm(e.target.value)}
                                            className="w-full bg-gemBgAlt border border-gemBorder text-gemText p-2.5 text-sm focus:border-gemRed outline-none rounded"
                                        />
                                        {orderSearchTerm && (
                                            <button
                                                onClick={() => setOrderSearchTerm('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gemTextLight hover:text-gemText text-xs font-semibold cursor-pointer"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        {/* Status Filter */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gemTextLight uppercase tracking-wider">Status:</span>
                                            <select
                                                value={orderStatusFilter}
                                                onChange={(e) => setOrderStatusFilter(e.target.value)}
                                                className="bg-gemBgAlt border border-gemBorder text-gemText p-2 text-xs outline-none focus:border-gemRed rounded cursor-pointer"
                                            >
                                                <option value="All">All Statuses</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        {/* Payment Filter */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gemTextLight uppercase tracking-wider">Payment:</span>
                                            <select
                                                value={orderPaymentFilter}
                                                onChange={(e) => setOrderPaymentFilter(e.target.value)}
                                                className="bg-gemBgAlt border border-gemBorder text-gemText p-2 text-xs outline-none focus:border-gemRed rounded cursor-pointer"
                                            >
                                                <option value="All">All Payments</option>
                                                <option value="Paid">Paid</option>
                                                <option value="Unpaid">Unpaid</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gemBorder text-gemTextLight uppercase text-xs tracking-widest">
                                                <th className="p-3">Order ID</th>
                                                <th className="p-3">Customer</th>
                                                <th className="p-3">Date</th>
                                                <th className="p-3">Total</th>
                                                <th className="p-3">Method</th>
                                                <th className="p-3">Payment</th>
                                                <th className="p-3">Delivery Status</th>
                                                <th className="p-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders.map(order => (
                                                <tr key={order._id} className="border-b border-gemBorder/50 text-gemText text-sm hover:bg-gemCard transition-colors animate-fadeIn">
                                                    <td className="p-3 font-mono text-xs text-gemTextLight">
                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="text-gemRed hover:underline cursor-pointer font-bold text-left outline-none"
                                                        >
                                                            {order._id.substring(0, 8).toUpperCase()}...
                                                        </button>
                                                    </td>
                                                    <td className="p-3 font-medium">{order.user ? order.user.name : 'Deleted User'}</td>
                                                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="p-3 font-serif font-bold">${order.totalPrice.toLocaleString()}</td>
                                                    <td className="p-3 text-xs text-gemTextLight">{order.paymentMethod || 'Cash on Delivery'}</td>
                                                    <td className="p-3">
                                                        {order.isPaid ? (
                                                            <span className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded w-max"><CheckCircle size={14} /> Paid</span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded w-max"><Clock size={14} /> Unpaid</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 font-medium">
                                                        {getOrderStatusBadge(order.status)}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="bg-gemBg border border-gemBorder text-gemText text-xs uppercase tracking-widest px-3 py-1.5 hover:border-gemRed hover:text-gemRed transition-colors rounded cursor-pointer"
                                                        >
                                                            Manage
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredOrders.length === 0 && (
                                                <tr>
                                                    <td colSpan="8" className="text-center p-6 text-gemTextLight">No matching orders found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* REVIEWS TAB */}
                        {activeTab === 'reviews' && (
                            <div>
                                <h2 className="text-xl font-serif text-gemText mb-6">Customer Reviews Management</h2>
                                <div className="bg-gemCard border border-gemBorder rounded overflow-hidden">
                                    <table className="w-full text-left text-gemText border-collapse">
                                        <thead>
                                            <tr className="bg-gemBgAlt border-b border-gemBorder text-gemTextLight uppercase tracking-wider text-xs">
                                                <th className="p-4 font-semibold">Gemstone</th>
                                                <th className="p-4 font-semibold">Customer</th>
                                                <th className="p-4 font-semibold">Rating</th>
                                                <th className="p-4 font-semibold">Comment</th>
                                                <th className="p-4 font-semibold">Verified</th>
                                                <th className="p-4 font-semibold">Date</th>
                                                <th className="p-4 font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gemBorder text-sm font-light">
                                            {reviews.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="p-8 text-center text-gemTextLight">No customer reviews found.</td>
                                                </tr>
                                            ) : (
                                                reviews.map((review) => (
                                                    <tr key={review._id} className="hover:bg-gemBgAlt/50 transition-colors animate-fadeIn">
                                                        <td className="p-4 font-medium">{review.productName}</td>
                                                        <td className="p-4">{review.name}</td>
                                                        <td className="p-4 text-gemGold font-serif">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</td>
                                                        <td className="p-4 max-w-xs truncate" title={review.comment}>{review.comment}</td>
                                                        <td className="p-4">
                                                            {review.isVerifiedPurchase ? (
                                                                <span className="text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs font-bold">Yes</span>
                                                            ) : (
                                                                <span className="text-stone-500 bg-stone-500/10 px-2 py-0.5 rounded text-xs">No</span>
                                                            )}
                                                        </td>
                                                        <td className="p-4 text-gemTextLight">{new Date(review.createdAt).toLocaleDateString()}</td>
                                                        <td className="p-4">
                                                            <button
                                                                onClick={() => handleDeleteReview(review.productId, review._id)}
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-500/10 p-1.5 rounded transition-all duration-200 cursor-pointer"
                                                                title="Delete Review"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}


                    </>
                )}

                {/* Modal Overlay */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-gemCard border border-gemBorder text-gemText max-w-2xl w-full rounded shadow-2xl p-6 relative overflow-y-auto max-h-[90vh] animate-fadeIn">
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="absolute top-4 right-4 text-gemTextLight hover:text-gemText transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-2xl font-serif mb-6 pb-3 border-b border-gemBorder text-gemRed">
                                Order Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Customer Details */}
                                <div className="space-y-4">
                                    <div className="border border-gemBorder/40 bg-gemBgAlt/50 p-4 rounded">
                                        <h4 className="text-xs uppercase tracking-widest text-gemTextLight mb-3 flex items-center gap-1.5 font-semibold">
                                            <User size={14} className="text-gemRed" /> Customer Info
                                        </h4>
                                        <p className="text-sm font-semibold">{selectedOrder.user ? selectedOrder.user.name : 'Deleted User'}</p>
                                        <p className="text-xs text-gemTextLight mt-1 flex items-center gap-1">
                                            <Mail size={12} /> {selectedOrder.user ? selectedOrder.user.email : 'N/A'}
                                        </p>
                                    </div>

                                    <div className="border border-gemBorder/40 bg-gemBgAlt/50 p-4 rounded">
                                        <h4 className="text-xs uppercase tracking-widest text-gemTextLight mb-3 flex items-center gap-1.5 font-semibold">
                                            <MapPin size={14} className="text-gemRed" /> Shipping Address
                                        </h4>
                                        <p className="text-sm font-semibold">{selectedOrder.shippingAddress.fullName}</p>
                                        <p className="text-xs text-gemTextLight mt-1">{selectedOrder.shippingAddress.address}</p>
                                        <p className="text-xs text-gemTextLight">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                                        <p className="text-xs text-gemTextLight">{selectedOrder.shippingAddress.country}</p>
                                    </div>
                                </div>

                                {/* Status & Update */}
                                <div className="space-y-4">
                                    <div className="border border-gemBorder/40 bg-gemBgAlt/50 p-4 rounded">
                                        <h4 className="text-xs uppercase tracking-widest text-gemTextLight mb-3 flex items-center gap-1.5 font-semibold">
                                            Status Controls
                                        </h4>

                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-gemTextLight mb-1">Current Status</p>
                                                {getOrderStatusBadge(selectedOrder.status)}
                                            </div>

                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-gemTextLight mb-1">Update Status</p>
                                                <select
                                                    value={selectedOrder.status}
                                                    onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                                                    disabled={statusUpdating}
                                                    className="w-full bg-gemBgAlt border border-gemBorder text-gemText p-2 text-sm outline-none focus:border-gemRed rounded cursor-pointer"
                                                >
                                                    <option value="Processing">Processing</option>
                                                    <option value="Confirmed">Confirmed</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                                {statusUpdating && (
                                                    <p className="text-xs text-gemTextLight animate-pulse mt-1">Updating...</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-gemBorder/40 bg-gemBgAlt/50 p-4 rounded">
                                        <h4 className="text-xs uppercase tracking-widest text-gemTextLight mb-3 flex items-center gap-1.5 font-semibold">
                                            <CreditCard size={14} className="text-gemRed" /> Payment Summary
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-gemTextLight">Method</p>
                                                <p className="font-semibold text-gemText mt-0.5">{selectedOrder.paymentMethod}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-gemTextLight">Status</p>
                                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mt-0.5 ${selectedOrder.isPaid ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {selectedOrder.isPaid ? 'Paid' : 'Unpaid'}
                                                </span>
                                            </div>
                                            {selectedOrder.couponApplied && (
                                                <>
                                                    <div className="col-span-2 border-t border-gemBorder/10 pt-2 mt-2 flex justify-between items-center text-xs">
                                                        <span className="text-gemTextLight">Subtotal:</span>
                                                        <span className="font-semibold">${selectedOrder.itemsPrice.toLocaleString()}</span>
                                                    </div>
                                                    <div className="col-span-2 flex justify-between items-center text-xs text-green-500 font-semibold">
                                                        <span>Coupon ({selectedOrder.couponApplied}):</span>
                                                        <span>-${selectedOrder.discountAmount.toLocaleString()}</span>
                                                    </div>
                                                </>
                                            )}
                                            <div className="col-span-2 border-t border-gemBorder/20 pt-2 mt-2 flex justify-between items-center text-sm font-semibold">
                                                <span>Total Price:</span>
                                                <span className="text-gemRed font-serif font-bold text-base">${selectedOrder.totalPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Purchased Items */}
                            <div className="border border-gemBorder/40 bg-gemBgAlt/50 p-4 rounded mb-6">
                                <h4 className="text-xs uppercase tracking-widest text-gemTextLight mb-3 flex items-center gap-1.5 font-semibold">
                                    Purchased Items
                                </h4>
                                <div className="divide-y divide-gemBorder/20 max-h-48 overflow-y-auto pr-2">
                                    {selectedOrder.orderItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-2 text-sm">
                                            <div className="flex items-center gap-3">
                                                <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded border border-gemBorder/40" />
                                                <div>
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p className="text-xs text-gemTextLight">Qty: {item.qty} &bull; ${item.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-gemText">${(item.price * item.qty).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="bg-gemBorder hover:bg-gemTextLight hover:text-black text-gemText px-6 py-2.5 uppercase tracking-widest text-xs font-semibold transition-colors rounded cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default AdminDashboard;

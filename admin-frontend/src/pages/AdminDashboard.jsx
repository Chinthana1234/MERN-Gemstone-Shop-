import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { Package, ShoppingCart, TrendingUp, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // For editing/adding products
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({ name: '', price: '', category: '', stock: '', carat: '', imageUrl: '', description: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersRes, productsRes] = await Promise.all([
                API.get('/orders'),
                API.get('/products?fetchAll=true')
            ]);
            setOrders(ordersRes.data);
            setProducts(productsRes.data.products || []);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
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

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await API.put(`/products/${editingProduct._id}`, productForm);
            } else {
                await API.post('/products', productForm);
            }
            setEditingProduct(null);
            setProductForm({ name: '', price: '', category: '', stock: '', carat: '', imageUrl: '', description: '' });
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
                                    <div className="p-3 bg-gemBgAlt rounded text-gemRed"><TrendingUp size={24}/></div>
                                    <div>
                                        <p className="text-sm text-gemTextLight uppercase tracking-widest">Total Sales</p>
                                        <p className="text-2xl font-serif text-gemText">${totalSales.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="bg-gemCard p-6 rounded border border-gemBorder flex items-center gap-4">
                                    <div className="p-3 bg-gemBgAlt rounded text-gemRed"><ShoppingCart size={24}/></div>
                                    <div>
                                        <p className="text-sm text-gemTextLight uppercase tracking-widest">Total Orders</p>
                                        <p className="text-2xl font-serif text-gemText">{orders.length}</p>
                                    </div>
                                </div>
                                <div className="bg-gemCard p-6 rounded border border-gemBorder flex items-center gap-4">
                                    <div className="p-3 bg-gemBgAlt rounded text-gemRed"><Package size={24}/></div>
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
                                <div className="bg-gemCard border border-gemBorder p-6 rounded mb-8">
                                    <h3 className="text-lg text-gemText mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                    <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" placeholder="Product Name" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none" />
                                        <input type="text" placeholder="Category (e.g. Sapphire)" required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none" />
                                        <input type="number" placeholder="Price ($)" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none" />
                                        <input type="number" placeholder="Stock Quantity" required value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none" />
                                        <input type="number" step="0.01" placeholder="Carat Weight" required value={productForm.carat} onChange={e => setProductForm({...productForm, carat: e.target.value})} className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none" />
                                        <input type="text" placeholder="Image URL (/images/gem.jpg)" required value={productForm.imageUrl} onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none" />
                                        <textarea placeholder="Product Description" required value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="bg-gemBgAlt border border-gemBorder text-gemText p-3 focus:border-gemRed outline-none md:col-span-2" rows="3"></textarea>
                                        <div className="md:col-span-2 flex gap-4">
                                            <button type="submit" className="bg-gemRed text-white p-3 uppercase tracking-widest font-semibold hover:bg-gemRedDark w-full transition-colors">
                                                {editingProduct ? 'Update Product' : 'Add Product'}
                                            </button>
                                            {editingProduct && (
                                                <button type="button" onClick={() => { setEditingProduct(null); setProductForm({ name: '', price: '', category: '', stock: '', carat: '', imageUrl: '', description: '' }); }} className="bg-gemBorder text-gemText p-3 uppercase tracking-widest font-semibold hover:bg-gemTextLight hover:text-black w-full transition-colors">
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
                                                        <button onClick={() => { setEditingProduct(product); setProductForm(product); }} className="text-gemTextLight hover:text-gemText p-2 transition-colors"><Edit size={16}/></button>
                                                        <button onClick={() => handleDeleteProduct(product._id)} className="text-gemRed p-2 hover:bg-gemRed/10 rounded transition-colors ml-2"><Trash2 size={16}/></button>
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
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gemBorder text-gemTextLight uppercase text-xs tracking-widest">
                                                <th className="p-3">Order ID</th>
                                                <th className="p-3">Customer</th>
                                                <th className="p-3">Date</th>
                                                <th className="p-3">Total</th>
                                                <th className="p-3">Status</th>
                                                <th className="p-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order._id} className="border-b border-gemBorder/50 text-gemText text-sm hover:bg-gemCard transition-colors">
                                                    <td className="p-3 font-mono text-xs text-gemTextLight">{order._id.substring(0, 8)}...</td>
                                                    <td className="p-3 font-medium">{order.user ? order.user.name : 'Deleted User'}</td>
                                                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="p-3 font-serif font-bold">${order.totalPrice.toLocaleString()}</td>
                                                    <td className="p-3">
                                                        {order.isDelivered ? (
                                                            <span className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded w-max"><CheckCircle size={14}/> Shipped</span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-gemGold bg-gemGold/10 px-2 py-1 rounded w-max"><Clock size={14}/> Processing</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        {!order.isDelivered && (
                                                            <button onClick={() => handleDeliverOrder(order._id)} className="bg-gemBg border border-gemBorder text-gemText text-xs uppercase tracking-widest px-3 py-1.5 hover:border-gemRed hover:text-gemRed transition-colors rounded">
                                                                Mark Shipped
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {orders.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="text-center p-6 text-gemTextLight">No orders found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}

export default AdminDashboard;

import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex flex-col items-center justify-center">
        <ShoppingBag size={64} className="text-gemBorder mb-6" />
        <h2 className="text-2xl font-serif text-white mb-3">Your Cart is Empty</h2>
        <p className="text-gray-400 mb-8">Discover our exceptional gemstone collection.</p>
        <Link to="/shop" className="bg-gemGold text-black font-semibold uppercase tracking-widest text-sm px-10 py-3 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link to="/shop" className="inline-flex items-center gap-2 text-gray-400 hover:text-gemGold transition-colors text-sm uppercase tracking-widest mb-4">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif text-white mt-2">Shopping Cart</h1>
            <p className="text-gray-400 mt-1">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={clearCart} className="text-red-400 hover:text-red-300 text-sm uppercase tracking-widest transition-colors">Clear All</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <div key={item._id} className="flex gap-6 bg-gemCard border border-gemBorder p-4">
                <Link to={`/product/${item._id}`} className="flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-28 h-28 object-cover" />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-gemGold text-xs uppercase tracking-widest">{item.category}</p>
                    <Link to={`/product/${item._id}`} className="text-lg font-serif text-white hover:text-gemGold transition-colors">{item.name}</Link>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gemBorder">
                      <button onClick={() => updateQuantity(item._id, item.qty - 1)} className="px-3 py-1.5 text-gray-400 hover:text-white"><Minus size={14} /></button>
                      <span className="px-3 py-1.5 text-white text-sm min-w-[40px] text-center">{item.qty}</span>
                      <button onClick={() => updateQuantity(item._id, item.qty + 1)} className="px-3 py-1.5 text-gray-400 hover:text-white"><Plus size={14} /></button>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-white font-light">${(item.price * item.qty).toLocaleString()}</span>
                      <button onClick={() => removeFromCart(item._id)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gemCard border border-gemBorder p-8 h-fit sticky top-28">
            <h3 className="text-xl font-serif text-white mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6 pb-6 border-b border-gemBorder">
              <div className="flex justify-between text-gray-400 text-sm"><span>Subtotal</span><span>${cartTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-400 text-sm"><span>Shipping</span><span className="text-green-400">Free</span></div>
            </div>
            <div className="flex justify-between text-white text-lg mb-8"><span className="font-serif">Total</span><span className="font-semibold">${cartTotal.toLocaleString()}</span></div>
            <button className="w-full bg-gemGold text-black font-semibold uppercase tracking-widest text-sm py-3.5 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300">Proceed to Checkout</button>
            <p className="text-center text-gray-500 text-xs mt-4 uppercase tracking-wider">Secure & Encrypted Payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

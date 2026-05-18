import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-gemBgAlt flex flex-col items-center justify-center">
        <ShoppingBag size={64} className="text-gemBorder mb-6" />
        <h2 className="text-2xl font-serif text-gemText mb-3">Your Cart is Empty</h2>
        <p className="text-gemTextLight mb-8">Discover our exceptional gemstone collection.</p>
        <Link to="/shop" className="bg-gemRed text-white font-semibold uppercase tracking-widest text-sm px-10 py-3 hover:bg-gemRedDark transition-all duration-300 rounded">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-gemBgAlt">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link to="/shop" className="inline-flex items-center gap-2 text-gemTextLight hover:text-gemRed transition-colors text-sm uppercase tracking-widest mb-4">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif text-gemText mt-2">Shopping Cart</h1>
            <p className="text-gemTextLight mt-1">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={clearCart} className="text-gemRed hover:text-gemRedDark text-sm uppercase tracking-widest transition-colors">Clear All</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <div key={item._id} className="flex gap-6 bg-gemCard border border-gemBorder p-4 rounded-lg shadow-sm">
                <Link to={`/product/${item._id}`} className="flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-28 h-28 object-cover rounded" />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-gemRed text-xs uppercase tracking-widest">{item.category}</p>
                    <Link to={`/product/${item._id}`} className="text-lg font-serif text-gemText hover:text-gemRed transition-colors">{item.name}</Link>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border-2 border-gemBorder rounded">
                      <button onClick={() => updateQuantity(item._id, item.qty - 1)} className="px-3 py-1.5 text-gemTextLight hover:text-gemText"><Minus size={14} /></button>
                      <span className="px-3 py-1.5 text-gemText text-sm min-w-[40px] text-center">{item.qty}</span>
                      <button onClick={() => updateQuantity(item._id, item.qty + 1)} className="px-3 py-1.5 text-gemTextLight hover:text-gemText"><Plus size={14} /></button>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-gemText font-medium">${(item.price * item.qty).toLocaleString()}</span>
                      <button onClick={() => removeFromCart(item._id)} className="text-gemTextMuted hover:text-gemRed transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gemCard border border-gemBorder p-8 h-fit sticky top-28 rounded-lg shadow-sm">
            <h3 className="text-xl font-serif text-gemText mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6 pb-6 border-b border-gemBorder">
              <div className="flex justify-between text-gemTextLight text-sm"><span>Subtotal</span><span>${cartTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-gemTextLight text-sm"><span>Shipping</span><span className="text-green-600">Free</span></div>
            </div>
            <div className="flex justify-between text-gemText text-lg mb-8"><span className="font-serif">Total</span><span className="font-semibold">${cartTotal.toLocaleString()}</span></div>
            <Link to="/checkout" className="block w-full text-center bg-gemRed text-white font-semibold uppercase tracking-widest text-sm py-3.5 hover:bg-gemRedDark transition-all duration-300 rounded">Proceed to Checkout</Link>
            <p className="text-center text-gemTextMuted text-xs mt-4 uppercase tracking-wider">Secure & Encrypted Payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

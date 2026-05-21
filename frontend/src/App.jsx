import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="min-h-screen bg-white text-stone-800 font-sans flex flex-col">
            {!isAuthPage && <Navbar />}
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={
                  <PrivateRoute><Checkout /></PrivateRoute>
                } />
                <Route path="/order/:id" element={
                  <PrivateRoute><OrderConfirmation /></PrivateRoute>
                } />
                <Route path="/my-orders" element={
                  <PrivateRoute><MyOrders /></PrivateRoute>
                } />
                <Route path="/wishlist" element={
                  <PrivateRoute><Wishlist /></PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute><Profile /></PrivateRoute>
                } />
              </Routes>
            </div>
            {!isAuthPage && <Footer />}
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
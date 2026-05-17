import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gemBorder shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-3xl font-serif text-gemRed tracking-widest uppercase transition-transform duration-300 group-hover:scale-105">
                Aura Gems
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-sm uppercase tracking-widest text-gemText hover:text-gemRed transition-colors duration-300 font-medium">Home</Link>
            <Link to="/shop" className="text-sm uppercase tracking-widest text-gemText hover:text-gemRed transition-colors duration-300 font-medium">Shop</Link>
            <Link to="/about" className="text-sm uppercase tracking-widest text-gemText hover:text-gemRed transition-colors duration-300 font-medium">About Us</Link>
            <Link to="/contact" className="text-sm uppercase tracking-widest text-gemText hover:text-gemRed transition-colors duration-300 font-medium">Contact</Link>
          </div>

          {/* Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gemText hover:text-gemRed transition-colors duration-300">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link to="/wishlist" className="text-gemText hover:text-gemRed transition-colors duration-300">
              <Heart size={20} strokeWidth={1.5} />
            </Link>
            <Link to="/cart" className="text-gemText hover:text-gemRed transition-colors duration-300 relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gemRed text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-4 ml-4">
                <Link to="/my-orders" className="text-sm uppercase tracking-widest text-gemText hover:text-gemRed transition-colors duration-300 font-medium">
                  Orders
                </Link>
                <span className="text-gemRed text-sm font-medium">{user.name}</span>
                <button onClick={logout} className="text-gemTextLight hover:text-gemRed transition-colors duration-300" title="Logout">
                  <LogOut size={18} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gemText hover:text-gemRed transition-colors duration-300 ml-4">
                <User size={20} strokeWidth={1.5} />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-4">
            <Link to="/cart" className="text-gemText relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gemRed text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gemText hover:text-gemRed transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gemBorder absolute w-full pb-4 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gemText hover:text-gemRed">HOME</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gemText hover:text-gemRed">SHOP</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gemText hover:text-gemRed">ABOUT US</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gemText hover:text-gemRed">CONTACT</Link>
            {user ? (
              <>
                <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gemText hover:text-gemRed">MY ORDERS</Link>
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="block px-3 py-2 text-base font-serif tracking-widest text-gemRed mt-4">LOGOUT</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gemRed mt-4 border border-gemRed rounded-full w-32 text-center">LOGIN</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

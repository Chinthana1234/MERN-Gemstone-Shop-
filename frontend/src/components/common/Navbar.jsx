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
    <nav className="fixed w-full top-0 z-50 bg-gemDark/80 backdrop-blur-md border-b border-gemBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-3xl font-serif text-gemGold tracking-widest uppercase transition-transform duration-300 group-hover:scale-105">
                Aura Gems
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-sm uppercase tracking-widest text-gray-300 hover:text-gemGold transition-colors duration-300">Home</Link>
            <Link to="/shop" className="text-sm uppercase tracking-widest text-gray-300 hover:text-gemGold transition-colors duration-300">Shop</Link>
            <Link to="/about" className="text-sm uppercase tracking-widest text-gray-300 hover:text-gemGold transition-colors duration-300">About</Link>
            <Link to="/contact" className="text-sm uppercase tracking-widest text-gray-300 hover:text-gemGold transition-colors duration-300">Contact</Link>
          </div>

          {/* Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-300 hover:text-gemGold transition-colors duration-300">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link to="/wishlist" className="text-gray-300 hover:text-gemGold transition-colors duration-300">
              <Heart size={20} strokeWidth={1.5} />
            </Link>
            <Link to="/cart" className="text-gray-300 hover:text-gemGold transition-colors duration-300 relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -top-2 -right-2 bg-gemGold text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
            {user ? (
              <div className="flex items-center gap-3 ml-4">
                <span className="text-gemGold text-sm">{user.name}</span>
                <button onClick={logout} className="text-gray-300 hover:text-red-400 transition-colors duration-300">
                  <LogOut size={18} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gray-300 hover:text-gemGold transition-colors duration-300 ml-4">
                <User size={20} strokeWidth={1.5} />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-4">
             <Link to="/cart" className="text-gray-300 relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -top-2 -right-2 bg-gemGold text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-gemGold transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gemDark border-b border-gemBorder absolute w-full pb-4 shadow-2xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gray-300 hover:text-gemGold">HOME</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gray-300 hover:text-gemGold">SHOP</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gray-300 hover:text-gemGold">ABOUT</Link>
            {user ? (
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="block px-3 py-2 text-base font-serif tracking-widest text-red-400 mt-4">LOGOUT</button>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gemGold mt-4 border border-gemGold rounded-full w-32 text-center">LOGIN</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

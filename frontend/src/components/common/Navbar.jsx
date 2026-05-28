import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const adminUrl = import.meta.env.VITE_ADMIN_URL || 
    (window.location.hostname.includes('vercel.app') ? 'https://auragems-admin.vercel.app' : 'http://localhost:5174');

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop?keyword=${keyword}`);
      setIsSearchOpen(false);
      setKeyword('');
    } else {
      navigate('/shop');
    }
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-gemBg/90 backdrop-blur-md border-b border-gemBorder shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-serif text-gemRed tracking-widest uppercase transition-transform duration-300 group-hover:scale-105">
                Aura Gems
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links or Search Bar */}
          <div className={`hidden md:flex items-center justify-center ${isSearchOpen ? 'flex-1 px-8' : 'space-x-8'}`}>
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="w-full max-w-2xl animate-fadeIn">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 text-gemTextLight" size={20} strokeWidth={1.5} />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search gems..."
                    className="w-full bg-gemBgMarble text-gemText border border-gemBorder rounded-full py-2.5 pl-12 pr-12 focus:outline-none focus:border-gemRed focus:ring-1 focus:ring-gemRed transition-all"
                    autoFocus
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-4 text-gemTextLight hover:text-gemRed transition-colors">
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>
              </form>
            ) : (
              <>
                <Link to="/" className="text-sm uppercase tracking-widest text-gemText hover:text-gemRed transition-colors duration-300 font-medium">Home</Link>
                <Link to="/shop" className="text-sm uppercase tracking-widest text-gemText hover:text-gemRed transition-colors duration-300 font-medium">Shop</Link>
                <Link to="/about" className="text-sm uppercase tracking-widest text-gemText hover:text-gemRed transition-colors duration-300 font-medium">About Us</Link>
                <Link to="/contact" className="text-sm uppercase tracking-widest text-gemText hover:text-gemRed transition-colors duration-300 font-medium">Contact</Link>
                <Link to="/reviews" className="text-sm uppercase tracking-widest text-gemText hover:text-gemRed transition-colors duration-300 font-medium">Reviews</Link>
              </>
            )}
          </div>

          {/* Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            {!isSearchOpen && (
              <button onClick={() => setIsSearchOpen(true)} className="text-gemText hover:text-gemRed transition-colors duration-300">
                <Search size={20} strokeWidth={1.5} />
              </button>
            )}
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
                {user.isAdmin && (
                  <a href={`${adminUrl}/login?adminData=${encodeURIComponent(JSON.stringify(user))}`} target="_blank" rel="noreferrer" className="text-sm uppercase tracking-widest text-gemGold hover:text-white transition-colors duration-300 font-bold border border-gemGold px-3 py-1 rounded">
                    Admin
                  </a>
                )}
                {!user.isAdmin && (
                  <Link to="/my-orders" className="text-sm uppercase tracking-widest text-gemText hover:text-gemRed transition-colors duration-300 font-medium">
                    Orders
                  </Link>
                )}
                <span className="text-gemRed text-sm font-medium ml-2">{user.name}</span>
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
        <div className="md:hidden bg-gemBg border-b border-gemBorder absolute w-full pb-4 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gemText hover:text-gemRed">HOME</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gemText hover:text-gemRed">SHOP</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gemText hover:text-gemRed">ABOUT US</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gemText hover:text-gemRed">CONTACT</Link>
            <Link to="/reviews" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gemText hover:text-gemRed">REVIEWS</Link>
            {user ? (
              <>
                {user.isAdmin && (
                  <a href={`${adminUrl}/login?adminData=${encodeURIComponent(JSON.stringify(user))}`} target="_blank" rel="noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gemGold hover:text-white">ADMIN PANEL</a>
                )}
                {!user.isAdmin && (
                  <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-serif tracking-widest text-gemText hover:text-gemRed">MY ORDERS</Link>
                )}
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

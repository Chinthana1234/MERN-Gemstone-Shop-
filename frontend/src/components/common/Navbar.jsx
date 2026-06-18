import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { setShopType, clearFilters } from '../../store/slices/productSlice';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isActive = (path) => {
    if (path === '/shop') {
      return location.pathname.startsWith('/shop') || location.pathname.startsWith('/product');
    }
    return location.pathname === path;
  };

  const handleShopClick = () => {
    dispatch(setShopType('gems'));
    dispatch(clearFilters());
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getAdminUrl = () => {
    if (import.meta.env.VITE_ADMIN_URL) return import.meta.env.VITE_ADMIN_URL;
    const hostname = window.location.hostname;
    if (hostname.includes('vercel.app')) {
      if (hostname.includes('-client')) return `https://${hostname.replace('-client', '-admin')}`;
      if (hostname.includes('-frontend')) return `https://${hostname.replace('-frontend', '-admin')}`;
      return 'https://auragems-admin.vercel.app';
    }
    return 'http://localhost:5174';
  };
  const adminUrl = getAdminUrl();

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

  const isHomePage = location.pathname === '/';

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out ${
      (isScrolled || !isHomePage)
        ? 'bg-gemBg/90 backdrop-blur-md border-b border-gemBorder/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]' 
        : 'bg-transparent border-b border-stone-200/10 shadow-none'
    }`}>
      <div className={`w-full bg-gemRedDark text-stone-200 transition-all duration-500 ease-in-out overflow-hidden flex items-center ${
        isScrolled ? 'h-0 opacity-0 border-b-0' : 'h-6 opacity-100 border-b border-gemRed/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center text-[10px] font-sans tracking-wide">
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-stone-300 hover:text-gemGold transition-colors duration-300 flex items-center" title="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-stone-300 hover:text-gemGold transition-colors duration-300 flex items-center" title="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="text-stone-300 hover:text-gemGold transition-colors duration-300 flex items-center" title="X (Twitter)">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
          </div>
          
          {/* Announcement Message */}
          <div className="text-center font-medium tracking-widest uppercase text-[9px] sm:block hidden">
            We ship worldwide — Fast and reliable shipping!
          </div>
          <div className="text-center font-medium tracking-widest uppercase text-[8px] sm:hidden block">
            Worldwide Shipping
          </div>

          {/* Contact Phone */}
          <div className="flex items-center">
            <a href="tel:+94714604907" className="text-stone-300 hover:text-gemGold transition-colors duration-300 font-semibold tracking-wider">
              +94714604907
            </a>
          </div>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out ${
        (isScrolled || !isHomePage) ? 'py-0.5' : 'py-1.5'
      }`}>
        <div className="flex justify-between items-center h-12">

          {/* Logo */}
          <div className={`flex-shrink-0 flex items-center ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl font-serif text-gemRed tracking-[0.25em] uppercase font-semibold transition-all duration-500 group-hover:tracking-[0.3em]">
                Aura Gems
              </span>
            </Link>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="flex-1 md:hidden px-2 animate-fadeIn">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative flex items-center">
                  <Search className="absolute left-3.5 text-stone-400" size={16} strokeWidth={1.5} />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search gems..."
                    className="w-full bg-gemBg border border-gemBorder/80 rounded-full py-1.5 pl-9 pr-9 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-gemRed transition-all"
                    autoFocus
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-3.5 text-stone-400 hover:text-gemRed transition-colors cursor-pointer border-none bg-transparent">
                    <X size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Desktop Navigation Links */}
          <div className={`hidden md:flex items-center justify-center ${isSearchOpen ? 'flex-1 px-8' : 'space-x-8'}`}>
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="w-full max-w-md animate-fadeIn">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 text-stone-400" size={18} strokeWidth={1.5} />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search our collection..."
                    className="w-full bg-gemBg border border-gemBorder/80 rounded-full py-2 pl-11 pr-11 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-gemRed transition-all duration-300 shadow-sm"
                    autoFocus
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-4 text-stone-400 hover:text-gemRed transition-colors border-none bg-transparent cursor-pointer">
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </form>
            ) : (
              <>
                {['/', '/shop', '/about', '/contact', '/reviews'].map((path) => {
                  const label = path === '/' ? 'Home' : path === '/about' ? 'About Us' : path.slice(1);
                  const clickHandler = path === '/shop' ? handleShopClick : undefined;
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={clickHandler}
                      className={`text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gemRed after:transform after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 ${
                        isActive(path) ? 'text-gemRed after:scale-x-100' : 'text-gemText hover:text-gemRed'
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          {/* Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-5">
            <Link to="/wishlist" className="text-gemText hover:text-gemRed transition-colors duration-300">
              <Heart size={18} strokeWidth={1.5} />
            </Link>
            {!isSearchOpen && (
              <button onClick={() => setIsSearchOpen(true)} className="text-gemText hover:text-gemRed transition-colors duration-300 cursor-pointer border-none bg-transparent p-0">
                <Search size={18} strokeWidth={1.5} />
              </button>
            )}
            <Link to="/cart" className="text-gemText hover:text-gemRed transition-colors duration-300 relative">
              <ShoppingCart size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gemRed text-white text-[9px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-3.5 ml-3">
                {user.isAdmin && (
                  <a href={`${adminUrl}/login?adminData=${encodeURIComponent(JSON.stringify(user))}`} target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-wider text-gemGold hover:text-white transition-colors duration-300 font-bold border border-gemGold px-2.5 py-0.5 rounded">
                    Admin
                  </a>
                )}
                {!user.isAdmin && (
                  <Link
                    to="/my-orders"
                    className={`text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gemRed after:transform after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 ${
                      isActive('/my-orders') ? 'text-gemRed after:scale-x-100' : 'text-gemText hover:text-gemRed'
                    }`}
                  >
                    Orders
                  </Link>
                )}
                <span className="text-stone-700 text-[11px] font-bold uppercase tracking-wider ml-1 bg-stone-100 px-3 py-1 rounded-full">{user.name}</span>
                <button onClick={logout} className="text-gemTextLight hover:text-gemRed transition-colors duration-300 border-none bg-transparent p-0 cursor-pointer" title="Logout">
                  <LogOut size={16} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gemText hover:text-gemRed transition-colors duration-300 ml-3">
                <User size={18} strokeWidth={1.5} />
              </Link>
            )}
          </div>

          {/* Mobile buttons */}
          <div className={`items-center md:hidden space-x-4 ${isSearchOpen ? 'hidden' : 'flex'}`}>
            <button onClick={() => setIsSearchOpen(true)} className="text-gemText hover:text-gemRed transition-colors cursor-pointer border-none bg-transparent p-0">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link to="/cart" className="text-gemText relative hover:text-gemRed transition-colors">
              <ShoppingCart size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gemRed text-white text-[9px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gemText hover:text-gemRed transition-colors cursor-pointer border-none bg-transparent p-0"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-stone-250/60 absolute w-full pb-4 shadow-lg animate-fadeIn">
          <div className="px-3 pt-2 pb-3 space-y-1 sm:px-4 flex flex-col items-center">
            {['/', '/shop', '/about', '/contact', '/reviews'].map((path) => {
              const label = path === '/' ? 'HOME' : path === '/about' ? 'ABOUT US' : path.slice(1).toUpperCase();
              const clickHandler = () => {
                setIsMobileMenuOpen(false);
                if (path === '/shop') handleShopClick();
              };
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={clickHandler}
                  className={`block px-3 py-2 text-xs font-semibold tracking-[0.2em] transition-colors ${
                    isActive(path) ? 'text-gemRed' : 'text-gemText hover:text-gemRed'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            {user ? (
              <>
                {user.isAdmin && (
                  <a href={`${adminUrl}/login?adminData=${encodeURIComponent(JSON.stringify(user))}`} target="_blank" rel="noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-bold tracking-[0.2em] text-gemGold hover:text-white">ADMIN PANEL</a>
                )}
                {!user.isAdmin && (
                  <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 text-xs font-semibold tracking-[0.2em] ${
                    isActive('/my-orders') ? 'text-gemRed' : 'text-gemText hover:text-gemRed'
                  }`}>MY ORDERS</Link>
                )}
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="block px-3 py-2 text-xs font-bold tracking-[0.2em] text-gemRed mt-4 border-none bg-transparent cursor-pointer">LOGOUT</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-bold tracking-[0.2em] text-white bg-gemRed hover:bg-gemRedDark mt-4 rounded-full w-28 text-center transition-colors">LOGIN</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

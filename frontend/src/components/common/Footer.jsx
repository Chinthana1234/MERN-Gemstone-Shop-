import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gemBg text-white border-t border-stone-900 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-16">

          {/* Brand & Description */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-serif text-white tracking-wide mb-6">Aura Gems</h3>
              <p className="text-stone-400 font-light text-sm leading-relaxed max-w-sm">
                Crafting timeless elegance with high-quality, ethically sourced gemstones. Discover the essence of luxury and sophistication with Aura Gems.
              </p>
            </div>
          </div>
    
          {/* Shop Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em] text-gemRed mb-6 font-bold">Shop</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-stone-400 hover:text-white text-sm font-light transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-stone-400 hover:text-white text-sm font-light transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-stone-400 hover:text-white text-sm font-light transition-colors duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-stone-400 hover:text-white text-sm font-light transition-colors duration-300">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-stone-400 hover:text-white text-sm font-light transition-colors duration-300">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em] text-gemRed mb-6 font-bold">Support</h4>
            <ul className="space-y-4">
              <li>
                <Link to="#" className="text-stone-400 hover:text-white text-sm font-light transition-colors duration-300">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-stone-400 hover:text-white text-sm font-light transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-stone-400 hover:text-white text-sm font-light transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-stone-400 hover:text-white text-sm font-light transition-colors duration-300">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-stone-400 hover:text-white text-sm font-light transition-colors duration-300">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-gemRed mb-6 font-bold">Newsletter</h4>
              <p className="text-stone-400 text-sm font-light mb-6">
                Join our mailing list for exclusive updates.
              </p>
              
              {/* Minimalist Underline Input Form */}
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center border-b border-stone-800 focus-within:border-gemRed transition-colors py-1.5 mb-8">
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  className="bg-transparent text-xs w-full text-white placeholder-stone-600 focus:outline-none tracking-widest" 
                  required
                />
                <button 
                  type="submit" 
                  className="text-white hover:text-gemRed text-xs font-bold tracking-widest ml-4 transition-colors cursor-pointer"
                >
                  JOIN
                </button>
              </form>
            </div>

            {/* Contact Details */}
            <div className="text-[11px] tracking-wider text-stone-400 space-y-1 uppercase font-light">
              <p className="mb-2">NO. 12, OCEAN CREST RESIDENCES, COLOMBO 03, SL</p>
              <p>
                <a href="mailto:auragems@gmail.com" className="text-gemRed hover:text-gemRedLight transition-colors font-medium">
                  auragems@gmail.com
                </a>
              </p>
              <p>
                <a href="tel:+94776599189" className="text-gemRed hover:text-gemRedLight transition-colors font-medium">
                  +94 77 659 9189
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-900 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-[10px] uppercase tracking-[0.2em] font-light">
            © {new Date().getFullYear()} Aura Gems. All Rights Reserved.
          </p>
          
          <div className="flex gap-8">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-stone-500 hover:text-white text-[10px] uppercase tracking-[0.2em] font-light transition-colors duration-300"
            >
              Instagram
            </a>
            <a 
              href="https://pinterest.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-stone-500 hover:text-white text-[10px] uppercase tracking-[0.2em] font-light transition-colors duration-300"
            >
              Pinterest
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-stone-500 hover:text-white text-[10px] uppercase tracking-[0.2em] font-light transition-colors duration-300"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

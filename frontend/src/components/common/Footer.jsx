import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gemBg text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-serif text-gemRed tracking-widest uppercase mb-4">Aura Gems</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">
              Curating the world's finest ethically sourced gemstones since 2024. Each stone tells a story of nature's artistry.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-white mb-4 font-medium">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-gray-400 hover:text-gemRed text-sm transition-colors">Shop</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-gemRed text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-gemRed text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-white mb-4 font-medium">Customer Care</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-400 text-sm">Shipping & Returns</span></li>
              <li><span className="text-gray-400 text-sm">Certification</span></li>
              <li><span className="text-gray-400 text-sm">Privacy Policy</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-white mb-4 font-medium">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">Get exclusive access to new arrivals and offers.</p>
            <div className="flex">
              <input type="email" placeholder="Your email"
                className="flex-1 bg-gray-800 border border-gray-700 px-4 py-2 text-white text-sm focus:outline-none focus:border-gemRed transition-colors rounded-l" />
              <button className="bg-gemRed text-white px-4 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-gemRedDark transition-all rounded-r">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} Aura Gems. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

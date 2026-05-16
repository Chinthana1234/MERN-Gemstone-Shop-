import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gemDarker border-t border-gemBorder mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-serif text-gemGold tracking-widest uppercase mb-4">Aura Gems</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">
              Curating the world's finest ethically sourced gemstones since 2024. Each stone tells a story of nature's artistry.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-gray-400 hover:text-gemGold text-sm transition-colors">Shop</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-gemGold text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-gemGold text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-white mb-4">Customer Care</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-400 text-sm">Shipping & Returns</span></li>
              <li><span className="text-gray-400 text-sm">Certification</span></li>
              <li><span className="text-gray-400 text-sm">Privacy Policy</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-white mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">Get exclusive access to new arrivals and offers.</p>
            <div className="flex">
              <input type="email" placeholder="Your email"
                className="flex-1 bg-gemDark border border-gemBorder px-4 py-2 text-white text-sm focus:outline-none focus:border-gemGold transition-colors" />
              <button className="bg-gemGold text-black px-4 py-2 text-sm font-semibold uppercase tracking-wider hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gemBorder mt-12 pt-8 text-center">
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} Aura Gems. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

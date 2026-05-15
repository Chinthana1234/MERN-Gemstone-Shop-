import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="p-6 flex justify-between items-center border-b border-gray-800 max-w-7xl mx-auto">
            <Link to="/">
                <h1 className="text-2xl font-bold text-gemGold tracking-widest cursor-pointer">
                    AURA GEMS
                </h1>
            </Link>
            <ul className="flex space-x-8 text-sm uppercase tracking-wide">
                <li><Link to="/" className="hover:text-gemPurple transition-colors duration-300">Home</Link></li>
                <li><Link to="/shop" className="hover:text-gemPurple transition-colors duration-300">Shop</Link></li>
                <li><Link to="/login" className="hover:text-gemPurple transition-colors duration-300">Login</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
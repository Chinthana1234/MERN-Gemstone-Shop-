import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <main className="flex flex-col items-center justify-center text-center mt-32 px-4">
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-gemPurple to-gemGold">Rare Perfection</span>
            </h2>
            <p className="text-gray-400 max-w-2xl text-lg md:text-xl mb-10 leading-relaxed">
                Elevate your collection with our hand-selected, ethically sourced gemstones.
                Crafted by nature, curated for you.
            </p>
            <Link to="/shop">
                <button className="bg-gemPurple hover:bg-purple-700 text-white font-semibold py-3 px-10 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)] transition-all duration-300 transform hover:-translate-y-1">
                    Explore Collection
                </button>
            </Link>
        </main>
    );
}

export default Home;
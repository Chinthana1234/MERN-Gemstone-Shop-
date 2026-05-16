import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="relative h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=2070&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gemDark/70 bg-gradient-to-t from-gemDark to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center">
        <span className="text-gemGold tracking-[0.3em] text-sm md:text-base font-semibold mb-4 uppercase">
          Exceptional Craftsmanship
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight">
          Discover <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gemGoldLight">Rare Perfection</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mb-10 font-light">
          Elevate your collection with our hand-selected, ethically sourced gemstones. 
          Crafted by nature, curated for you.
        </p>
        <Link 
          to="/shop"
          className="inline-block bg-gemGold hover:bg-yellow-500 text-black font-semibold tracking-widest uppercase text-sm px-10 py-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        >
          Explore Collection
        </Link>
      </div>
    </section>
  );
}

export default Hero;

import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="relative h-[calc(100vh-80px)] flex items-center overflow-hidden marble-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-gemText leading-tight">
              <span className="text-gemTextLight font-light italic">Luxury through</span>
              <br />
              <span className="text-gemRed font-bold">rarity</span>
              <br />
              <span className="text-gemTextLight font-light italic">created with</span>
              <br />
              <span className="text-gemRed font-bold text-6xl md:text-7xl lg:text-8xl">passion</span>
            </h1>
            <p className="mt-8 text-lg text-gemTextLight max-w-lg font-light leading-relaxed">
              Elevate your collection with our hand-selected, ethically sourced gemstones from Sri Lanka and beyond.
            </p>
            <Link 
              to="/shop"
              className="inline-block mt-8 bg-gemRed hover:bg-gemRedDark text-white font-semibold tracking-widest uppercase text-sm px-10 py-4 transition-all duration-300 hover:shadow-lg"
            >
              Explore Collection
            </Link>
          </div>

          {/* Hero Image */}
          <div className="hidden lg:flex justify-center items-center relative">
            <img 
              src="https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=800&auto=format&fit=crop" 
              alt="Luxury Gemstone" 
              className="w-96 h-96 object-cover rounded-full shadow-2xl border-4 border-white"
            />
            <div className="absolute -z-10 w-[420px] h-[420px] rounded-full bg-gemRed/5"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

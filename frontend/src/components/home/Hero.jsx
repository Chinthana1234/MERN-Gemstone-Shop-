import React from 'react';
import { Link } from 'react-router-dom';
import heroVideo from '../../assets/videos/hero-bg.mp4';

function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="object-cover w-full h-full scale-105"
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Gradient Overlay to ensure text readability and add luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-16">
        <div className="animate-fadeIn">
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-serif text-white leading-tight drop-shadow-2xl">
            <span className="font-light italic tracking-wide opacity-90">Luxury through</span>
            <br />
            <span className="font-bold text-white tracking-[0.2em] uppercase mt-4 block">rarity</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md opacity-90">
            Elevate your collection with our hand-selected, ethically sourced gemstones from Sri Lanka and beyond.
          </p>
          <Link 
            to="/shop"
            className="inline-block mt-12 bg-transparent border border-white text-white hover:bg-white hover:text-black font-medium tracking-[0.2em] uppercase text-sm px-12 py-4 transition-all duration-500 ease-out hover:scale-105"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;

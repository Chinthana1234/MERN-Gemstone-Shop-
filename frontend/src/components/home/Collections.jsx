import React from 'react';
import { Link } from 'react-router-dom';
import gemstoneImg from '../../assets/images/home page/lucid-origin_A_professional_bright_commercial_photograph_of_a_sorted_pile_of_faceted_gemstone-0 (1).jpg';
import jewelryImg from '../../assets/images/home page/Gemini_Generated_Image_ci5zqrci5zqrci5z.png';

function Collections() {
  return (
    <section className="pt-8 pb-12 bg-white w-full px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-0">

        {/* Gemstones Collection */}
        <Link
          to="/shop?type=gems"
          className="relative overflow-hidden group aspect-[4/3] md:aspect-[4/3] block"
        >
          <img
            src={gemstoneImg}
            alt="Gemstones Collection"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute bottom-6 left-6 bg-white p-6 pr-10 shadow-lg rounded-sm transition-transform duration-300 group-hover:-translate-y-1">
            <h3 className="font-serif text-stone-900 text-lg md:text-xl font-bold mb-2">Gemstones Collection</h3>
            <span className="text-stone-800 text-xs uppercase tracking-widest font-semibold border-b border-stone-800 pb-0.5 group-hover:text-gemRed group-hover:border-gemRed transition-colors duration-300">
              Shop Now
            </span>
          </div>
        </Link>

        {/* Jewelry Collection */}
        <Link
          to="/shop?type=jewelry"
          className="relative overflow-hidden group aspect-[4/3] md:aspect-[4/3] block"
        >
          <img
            src={jewelryImg}
            alt="Jewelry Collection"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute bottom-6 left-6 bg-white p-6 pr-10 shadow-lg rounded-sm transition-transform duration-300 group-hover:-translate-y-1">
            <h3 className="font-serif text-stone-900 text-lg md:text-xl font-bold mb-2">Jewelry Collection</h3>
            <span className="text-stone-800 text-xs uppercase tracking-widest font-semibold border-b border-stone-800 pb-0.5 group-hover:text-gemRed group-hover:border-gemRed transition-colors duration-300">
              Shop Now
            </span>
          </div>
        </Link>

      </div>
    </section>
  );
}

export default Collections;

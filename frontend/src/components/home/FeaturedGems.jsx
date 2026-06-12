import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

function FeaturedGems() {
  const [allGems, setAllGems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/products?sort=newest&fetchAll=true');
        setAllGems(data.products || []);
      } catch (error) {
        console.error('Error fetching featured gems:', error);
      }
    };
    fetchFeatured();
  }, []);

  const getVisibleGems = () => {
    if (allGems.length <= 3) return allGems;
    const gems = [];
    for (let i = 0; i < 3; i++) {
      gems.push(allGems[(currentIndex + i) % allGems.length]);
    }
    return gems;
  };

  const handleNext = () => {
    if (allGems.length <= 3) return;
    setAnimate(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 3) % allGems.length);
      setAnimate(true);
    }, 250);
  };

  const handlePrev = () => {
    if (allGems.length <= 3) return;
    setAnimate(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 3 + allGems.length) % allGems.length);
      setAnimate(true);
    }, 250);
  };

  const visibleGems = getVisibleGems();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Featured Collections</h2>
          <div className="h-0.5 w-24 bg-gemRed mx-auto"></div>
          <p className="mt-4 text-stone-500 font-light">Curated masterpieces for the discerning collector.</p>
        </div>

        {/* Product Slider Wrapper */}
        <div className="relative group/slider px-2 md:px-12">
          {/* Left Arrow Button */}
          {allGems.length > 3 && (
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 text-stone-800 hover:text-white hover:bg-gemRed p-2.5 md:p-3 rounded-full shadow-md border border-stone-200 hover:border-gemRed transition-all duration-300 -translate-x-1/2 md:translate-x-0 opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 focus:opacity-100 cursor-pointer"
              aria-label="Previous products"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Right Arrow Button */}
          {allGems.length > 3 && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 text-stone-800 hover:text-white hover:bg-gemRed p-2.5 md:p-3 rounded-full shadow-md border border-stone-200 hover:border-gemRed transition-all duration-300 translate-x-1/2 md:translate-x-0 opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 focus:opacity-100 cursor-pointer"
              aria-label="Next products"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Product Grid */}
          <div className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 transition-all duration-300 transform ${animate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-[0.98]'}`}>
            {visibleGems.map((gem) => {
              const isJewelry = ['ring', 'necklace', 'earring', 'bracelet'].includes(gem.category?.toLowerCase().replace(/s$/, '')) || gem.carat === 0;
              return (
                <Link to={`/product/${gem._id}`} key={gem._id} className="group cursor-pointer block">
                  {/* Image Container */}
                  <div className={`relative overflow-hidden bg-stone-50 aspect-[4/5] mb-4 rounded-lg shadow-sm border border-stone-200/50 hover:border-gemRed/40 flex items-center justify-center ${isJewelry ? 'p-0' : 'p-6'}`}>
                    <img
                      src={gem.imageUrl}
                      alt={gem.name}
                      className={`${isJewelry ? 'w-full h-full object-cover' : 'max-w-[75%] max-h-[75%] object-contain'} object-center transition-transform duration-700 group-hover:scale-110 drop-shadow-xl`}
                    />

                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => { e.preventDefault(); addToCart(gem, 1); }}
                        className="bg-white text-stone-900 p-3 rounded-full hover:bg-gemRed hover:text-white transition-colors shadow-md border-none cursor-pointer">
                        <ShoppingCart size={20} />
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); toggleWishlist(gem._id); }}
                        className={`p-3 rounded-full transition-colors shadow-md border-none cursor-pointer ${isInWishlist(gem._id) ? 'bg-gemRed text-white' : 'bg-white text-stone-900 hover:bg-gemRed hover:text-white'}`}>
                        <Heart size={20} className={isInWishlist(gem._id) ? 'fill-white' : ''} />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="text-center">
                    <p className="text-gemRed text-xs uppercase tracking-widest mb-2">{gem.category}</p>
                    <h3 className="text-lg font-serif text-stone-800 mb-1 group-hover:text-gemRed transition-colors truncate">{gem.name}</h3>
                    <p className="text-stone-900 font-medium font-serif">${gem.price.toLocaleString()}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            to="/shop"
            className="inline-block border-2 border-gemRed text-gemRed hover:bg-gemRed hover:text-white font-semibold tracking-widest uppercase text-sm px-10 py-3 transition-colors duration-300"
          >
            View All Products
          </Link>
        </div>

      </div>
    </section>
  );
}

export default FeaturedGems;

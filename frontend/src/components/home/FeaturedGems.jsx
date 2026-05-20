import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import API from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

function FeaturedGems() {
  const [featuredGems, setFeaturedGems] = useState([]);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/products?sort=newest');
        setFeaturedGems((data.products || []).slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured gems:', error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-24 bg-gemBgAlt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-gemText mb-4">Featured Collections</h2>
          <div className="h-0.5 w-24 bg-gemRed mx-auto"></div>
          <p className="mt-4 text-gemTextLight font-light">Curated masterpieces for the discerning collector.</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredGems.map((gem) => (
            <Link to={`/product/${gem._id}`} key={gem._id} className="group cursor-pointer block">
              {/* Image Container */}
              <div className="relative overflow-hidden bg-gradient-to-b from-[#151515] to-[#0a0a0a] aspect-[4/5] mb-4 rounded-lg shadow-md border border-transparent hover:border-gemBorder flex items-center justify-center p-6">
                <img 
                  src={gem.imageUrl} 
                  alt={gem.name} 
                  className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl"
                />
                
                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={(e) => { e.preventDefault(); addToCart(gem, 1); }}
                    className="bg-gemCard text-gemText p-3 rounded-full hover:bg-gemRed hover:text-white transition-colors shadow-lg">
                    <ShoppingBag size={20} />
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); toggleWishlist(gem._id); }}
                    className={`p-3 rounded-full transition-colors shadow-lg ${isInWishlist(gem._id) ? 'bg-gemRed text-white' : 'bg-gemCard text-gemText hover:bg-gemRed hover:text-white'}`}>
                    <Heart size={20} className={isInWishlist(gem._id) ? 'fill-white' : ''} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center">
                <p className="text-gemRed text-xs uppercase tracking-widest mb-2">{gem.category}</p>
                <h3 className="text-lg font-serif text-gemText mb-1 group-hover:text-gemRed transition-colors">{gem.name}</h3>
                <p className="text-gemText font-medium font-serif">${gem.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
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

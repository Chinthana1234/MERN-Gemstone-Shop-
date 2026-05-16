import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Filter, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import API from '../utils/api';

const CATEGORIES = ['All', 'Sapphire', 'Ruby', 'Emerald'];

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [addedId, setAddedId] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const query = activeCategory !== 'All' ? `?category=${activeCategory}` : '';
        const { data } = await API.get(`/products${query}`);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="text-gemGold tracking-[0.3em] text-xs uppercase font-semibold">Our Collection</span>
          <h1 className="text-4xl md:text-5xl font-serif text-white mt-3 mb-4">Gemstone Gallery</h1>
          <div className="h-0.5 w-24 bg-gemGold mx-auto"></div>
          <p className="mt-4 text-gray-400 font-light max-w-xl mx-auto">
            Each stone is hand-selected for its exceptional color, clarity, and character.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 text-sm uppercase tracking-widest font-semibold border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gemGold text-black border-gemGold'
                  : 'bg-transparent text-gray-400 border-gemBorder hover:border-gemGold hover:text-gemGold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gemCard aspect-[4/5] mb-4"></div>
                <div className="h-3 bg-gemCard w-1/3 mx-auto mb-2"></div>
                <div className="h-4 bg-gemCard w-2/3 mx-auto mb-2"></div>
                <div className="h-3 bg-gemCard w-1/4 mx-auto"></div>
              </div>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <Link to={`/product/${product._id}`} key={product._id} className="group cursor-pointer block">
                {/* Image */}
                <div className="relative overflow-hidden bg-gemCard aspect-[4/5] mb-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />

                  {/* Stock Badge */}
                  {product.stock <= 3 && product.stock > 0 && (
                    <span className="absolute top-4 left-4 bg-red-900/80 text-red-200 text-xs px-3 py-1 uppercase tracking-wider">
                      Only {product.stock} Left
                    </span>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`p-3 rounded-full transition-colors ${
                        addedId === product._id
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-black hover:bg-gemGold'
                      }`}
                    >
                      <ShoppingBag size={20} />
                    </button>
                    <button className="bg-white text-black p-3 rounded-full hover:bg-gemGold transition-colors">
                      <Heart size={20} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <p className="text-gemGold text-xs uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="text-lg font-serif text-gray-100 mb-1 group-hover:text-gemGold transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < Math.round(product.rating) ? 'fill-gemGold text-gemGold' : 'text-gray-600'} />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">({product.numReviews})</span>
                  </div>
                  <p className="text-gray-300 font-light">${product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No gemstones found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;
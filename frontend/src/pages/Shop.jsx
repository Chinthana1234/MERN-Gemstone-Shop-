import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
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
    <div className="pt-24 pb-20 min-h-screen bg-gemBgAlt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="text-gemRed tracking-[0.3em] text-xs uppercase font-semibold">Our Collection</span>
          <h1 className="text-4xl md:text-5xl font-serif text-gemText mt-3 mb-4">Gemstone Gallery</h1>
          <div className="h-0.5 w-24 bg-gemRed mx-auto"></div>
          <p className="mt-4 text-gemTextLight font-light max-w-xl mx-auto">
            Each stone is hand-selected for its exceptional color, clarity, and character.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 text-sm uppercase tracking-widest font-semibold border-2 transition-all duration-300 rounded ${
                activeCategory === cat
                  ? 'bg-gemRed text-white border-gemRed'
                  : 'bg-white text-gemTextLight border-gemBorder hover:border-gemRed hover:text-gemRed'
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
                <div className="bg-gemBorder aspect-[4/5] mb-4 rounded-lg"></div>
                <div className="h-3 bg-gemBorder w-1/3 mx-auto mb-2 rounded"></div>
                <div className="h-4 bg-gemBorder w-2/3 mx-auto mb-2 rounded"></div>
                <div className="h-3 bg-gemBorder w-1/4 mx-auto rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <Link to={`/product/${product._id}`} key={product._id} className="group cursor-pointer block">
                <div className="relative overflow-hidden bg-white aspect-[4/5] mb-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img src={product.imageUrl} alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
                  
                  {product.stock <= 3 && product.stock > 0 && (
                    <span className="absolute top-4 left-4 bg-gemRed text-white text-xs px-3 py-1 uppercase tracking-wider rounded">
                      Only {product.stock} Left
                    </span>
                  )}

                  <div className="absolute inset-0 bg-black/15 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={(e) => handleAddToCart(e, product)}
                      className={`p-3 rounded-full transition-colors shadow-lg ${
                        addedId === product._id ? 'bg-green-500 text-white' : 'bg-white text-gemText hover:bg-gemRed hover:text-white'
                      }`}>
                      <ShoppingBag size={20} />
                    </button>
                    <button className="bg-white text-gemText p-3 rounded-full hover:bg-gemRed hover:text-white transition-colors shadow-lg">
                      <Heart size={20} />
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gemRed text-xs uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="text-lg font-serif text-gemText mb-1 group-hover:text-gemRed transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < Math.round(product.rating) ? 'fill-gemGold text-gemGold' : 'text-gemBorder'} />
                    ))}
                    <span className="text-xs text-gemTextMuted ml-1">({product.numReviews})</span>
                  </div>
                  <p className="text-gemText font-medium">${product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gemTextLight text-lg">No gemstones found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;
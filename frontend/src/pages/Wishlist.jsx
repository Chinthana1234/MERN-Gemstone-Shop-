import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

function Wishlist() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="pt-28 pb-20 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif text-stone-900 mb-10 flex items-center gap-3">
          <Heart size={28} className="text-gemRed fill-gemRed" /> Your Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-stone-50 border border-stone-200 rounded-lg">
            <Heart size={48} className="mx-auto text-stone-300 mb-6" />
            <h2 className="text-xl font-serif text-stone-900 mb-4">Your wishlist is empty</h2>
            <p className="text-stone-600 mb-8">Save items you love and they will show up here.</p>
            <Link to="/shop" className="bg-gemRed text-white px-8 py-3 uppercase tracking-widest text-sm font-semibold hover:bg-gemRedDark transition-colors rounded inline-block">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistItems.map((product) => {
              const isJewelry = ['ring', 'necklace', 'earring', 'bracelet'].includes(product.category?.toLowerCase().replace(/s$/, '')) || product.carat === 0;
              return (
                <div key={product._id} className="bg-stone-50 border border-stone-200/60 rounded-lg overflow-hidden group shadow-sm hover:border-gemRed/40 transition-colors flex flex-col justify-between">
                  <div>
                    <div className={`relative aspect-square overflow-hidden bg-white border-b border-stone-200/50 flex items-center justify-center ${isJewelry ? 'p-0' : 'p-4'}`}>
                      <img src={product.imageUrl} alt={product.name} className={`${isJewelry ? 'w-full h-full object-cover' : 'max-w-[75%] max-h-[75%] object-contain'} transition-transform duration-700 group-hover:scale-110 drop-shadow-md`} />
                      <button onClick={() => toggleWishlist(product._id)} className="absolute top-3 right-3 p-1.5 bg-white/80 border border-stone-200 backdrop-blur-sm rounded-full text-gemRed hover:bg-gemRed hover:text-white transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-col justify-between gap-1 mb-1.5">
                        <Link to={`/product/${product._id}`} className="hover:text-gemRed transition-colors">
                          <h3 className="text-sm font-serif text-stone-900 font-medium line-clamp-1">{product.name}</h3>
                        </Link>
                        <span className="text-sm font-light text-stone-800">${product.price.toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-4">{product.category}</p>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <button onClick={() => addToCart(product, 1)} className="w-full flex items-center justify-center gap-1.5 bg-gemRed border border-transparent text-white py-2 uppercase tracking-widest text-[10px] font-semibold hover:bg-gemRedDark transition-all rounded shadow-sm">
                      <ShoppingCart size={13} /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;

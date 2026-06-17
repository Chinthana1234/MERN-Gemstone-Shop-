import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import API from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

function BestSeller() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBestSeller = async () => {
      try {
        const { data } = await API.get('/products?fetchAll=true');
        const products = data.products || [];
        
        // Find a high-value gemstone product to showcase (e.g. Sapphire, Ruby, or similar)
        if (products.length > 0) {
          const sapphire = products.find(p => p.name && p.name.toLowerCase().includes('sapphire'));
          const selected = sapphire || products[0];
          setProduct(selected);
        }
      } catch (error) {
        console.error('Error fetching best seller:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSeller();
  }, []);

  if (loading) {
    return (
      <div className="py-24 bg-white animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-stone-200 w-48 mx-auto mb-16 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-stone-200 aspect-[4/5] rounded-xl"></div>
            <div className="space-y-6 pt-8">
              <div className="h-4 bg-stone-200 w-1/4 rounded"></div>
              <div className="h-8 bg-stone-200 w-3/4 rounded"></div>
              <div className="h-4 bg-stone-200 w-full rounded"></div>
              <div className="h-10 bg-stone-200 w-1/3 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success('Added to cart!');
  };

  return (
    <section className="py-24 bg-white border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Best Seller</h2>
          <div className="h-0.5 w-24 bg-gemRed mx-auto"></div>
          <p className="mt-4 text-stone-500 font-light">Our most sought-after signature masterpiece.</p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Main Image Only */}
          <div className="lg:col-span-6">
            <div className="bg-stone-50 border border-stone-200/50 aspect-square rounded-xl overflow-hidden relative group w-full h-full shadow-sm">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105" 
              />
              <span className="absolute top-4 right-4 bg-gemRed text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-full shadow-sm z-10">
                Top Seller
              </span>
            </div>
          </div>

          {/* Right Column: Product Detail & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Tag / Category */}
            <p className="text-gemRed text-xs uppercase tracking-[0.25em] font-semibold mb-3">
              Certified Masterpiece
            </p>
            
            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Ratings summary */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-gemGold text-gemGold" />
                ))}
              </div>
              <span className="text-stone-500 text-sm font-light">(4.9/5 based on 128 reviews)</span>
            </div>

            {/* Price */}
            <p className="text-3xl font-light text-stone-900 mb-6">
              ${product.price.toLocaleString()}
            </p>

            {/* Description */}
            <p className="text-stone-600 font-light leading-relaxed mb-8">
              {product.description || 'This rare gemstone exhibits exceptional saturation and symmetry. A true investment piece, hand-crafted and ethically sourced for the most discerning collections.'}
            </p>

            {/* Quantity Selector & Add to Cart button */}
            <div className="mb-6">
              <span className="block text-xs uppercase tracking-widest text-stone-500 mb-3 font-semibold">Quantity:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-200 rounded bg-white shadow-sm">
                  <button 
                    onClick={() => setQty(q => Math.max(1, q - 1))} 
                    className="px-4 py-2 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                  >
                    −
                  </button>
                  <span className="px-3 py-2 text-stone-800 font-medium min-w-[32px] text-center">
                    {qty}
                  </span>
                  <button 
                    onClick={() => setQty(q => q + 1)} 
                    className="px-4 py-2 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-8 bg-stone-950 hover:bg-stone-900 text-white font-semibold uppercase tracking-widest text-sm transition-all duration-300 rounded-sm shadow hover:shadow-md border-none cursor-pointer"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

export default BestSeller;

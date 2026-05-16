import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Star, ArrowLeft, Shield, Truck, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import API from '../utils/api';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-gemBgAlt">
        <div className="max-w-6xl mx-auto px-4 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-gemBorder aspect-square rounded-lg"></div>
            <div className="space-y-6 pt-8">
              <div className="h-3 bg-gemBorder w-1/4 rounded"></div>
              <div className="h-8 bg-gemBorder w-3/4 rounded"></div>
              <div className="h-4 bg-gemBorder w-full rounded"></div>
              <div className="h-6 bg-gemBorder w-1/3 mt-8 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-gemBgAlt flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-gemText mb-4">Product Not Found</h2>
          <Link to="/shop" className="text-gemRed hover:underline">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-gemBgAlt">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-gemTextLight hover:text-gemRed transition-colors mb-10 text-sm uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image */}
          <div className="relative overflow-hidden bg-white aspect-square rounded-lg shadow-lg">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            {product.stock <= 3 && product.stock > 0 && (
              <span className="absolute top-6 left-6 bg-gemRed text-white text-xs px-4 py-1.5 uppercase tracking-wider rounded">Only {product.stock} Left</span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-gemRed text-xs uppercase tracking-[0.3em] font-semibold mb-3">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-serif text-gemText mb-4">{product.name}</h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.round(product.rating) ? 'fill-gemGold text-gemGold' : 'text-gemBorder'} />
                ))}
              </div>
              <span className="text-gemTextMuted text-sm">({product.numReviews} reviews)</span>
            </div>

            <p className="text-3xl font-light text-gemText mb-6">${product.price.toLocaleString()}</p>
            <p className="text-gemTextLight font-light leading-relaxed mb-8">{product.description}</p>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 mb-8 border-t border-b border-gemBorder py-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-gemTextMuted">Carat Weight</span>
                <p className="text-gemText font-light mt-1">{product.carat} ct</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-gemTextMuted">Origin</span>
                <p className="text-gemText font-light mt-1">{product.origin}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-gemTextMuted">In Stock</span>
                <p className={`font-light mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-gemRed'}`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-gemTextMuted">Category</span>
                <p className="text-gemText font-light mt-1">{product.category}</p>
              </div>
            </div>

            {/* Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border-2 border-gemBorder rounded">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 text-gemTextLight hover:text-gemText">−</button>
                  <span className="px-4 py-3 text-gemText min-w-[50px] text-center">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-4 py-3 text-gemTextLight hover:text-gemText">+</button>
                </div>
                <button onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-3 py-3.5 font-semibold uppercase tracking-widest text-sm transition-all duration-300 rounded ${
                    added ? 'bg-green-600 text-white' : 'bg-gemRed text-white hover:bg-gemRedDark hover:shadow-lg'
                  }`}>
                  <ShoppingBag size={18} />
                  {added ? 'Added to Cart ✓' : 'Add to Cart'}
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gemBorder">
              <div className="text-center">
                <Shield size={20} className="text-gemRed mx-auto mb-2" />
                <p className="text-xs text-gemTextMuted uppercase tracking-wider">Certified</p>
              </div>
              <div className="text-center">
                <Truck size={20} className="text-gemRed mx-auto mb-2" />
                <p className="text-xs text-gemTextMuted uppercase tracking-wider">Free Shipping</p>
              </div>
              <div className="text-center">
                <Award size={20} className="text-gemRed mx-auto mb-2" />
                <p className="text-xs text-gemTextMuted uppercase tracking-wider">Ethical Source</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

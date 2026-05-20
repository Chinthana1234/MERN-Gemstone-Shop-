import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Star, ArrowLeft, Shield, Truck, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setReviewError('Please select a rating');
      return;
    }
    try {
      setReviewError('');
      setReviewSuccess('');
      await API.post(`/products/${id}/reviews`, { rating, comment });
      setReviewSuccess('Review submitted successfully!');
      setRating(0);
      setComment('');
      // Refetch product to show new review
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Error submitting review');
    }
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
          <div className="relative overflow-hidden bg-gradient-to-b from-[#151515] to-[#0a0a0a] aspect-square rounded-lg shadow-lg flex items-center justify-center p-12">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain drop-shadow-2xl" />
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

        {/* Reviews Section */}
        <div className="mt-20 border-t border-gemBorder pt-16">
          <h2 className="text-2xl font-serif text-gemText mb-10">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              {product.reviews && product.reviews.length === 0 && <p className="text-gemTextLight">No reviews yet.</p>}
              <div className="space-y-8">
                {product.reviews && product.reviews.map((review) => (
                  <div key={review._id} className="bg-gemCard border border-gemBorder p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <strong className="text-gemText font-serif">{review.name}</strong>
                      <span className="text-gemTextMuted text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? 'fill-gemGold text-gemGold' : 'text-gemBorder'} />
                      ))}
                    </div>
                    <p className="text-gemTextLight text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gemCard border border-gemBorder p-8 rounded-lg h-fit">
              <h3 className="text-xl font-serif text-gemText mb-6">Write a Review</h3>
              {user ? (
                <form onSubmit={handleReviewSubmit}>
                  {reviewError && <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 mb-4 rounded">{reviewError}</div>}
                  {reviewSuccess && <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-sm p-3 mb-4 rounded">{reviewSuccess}</div>}
                  
                  <div className="mb-5">
                    <label className="block text-xs uppercase tracking-widest text-gemTextMuted mb-2">Rating</label>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full bg-gemBgAlt border border-gemBorder text-gemText p-3 rounded focus:outline-none focus:border-gemRed">
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-xs uppercase tracking-widest text-gemTextMuted mb-2">Comment</label>
                    <textarea row="4" value={comment} onChange={(e) => setComment(e.target.value)} required className="w-full bg-gemBgAlt border border-gemBorder text-gemText p-3 rounded focus:outline-none focus:border-gemRed"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-gemRed text-white py-3 uppercase tracking-widest text-sm font-semibold hover:bg-gemRedDark transition-colors rounded">
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="text-gemTextLight bg-gemBgAlt p-6 rounded border border-gemBorder text-center">
                  Please <Link to="/login" className="text-gemRed hover:underline">sign in</Link> to write a review.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetail;

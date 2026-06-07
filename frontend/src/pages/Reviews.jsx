import React, { useState, useEffect } from 'react';
import { Star, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import reviewBanner from '../assets/images/review page/Gemini_Generated_Image_agdsayagdsayagds.png';

const DEFAULT_REVIEWS = [
    { rating: 5, text: "The quality of the sapphire I purchased was beyond my expectations. The GIA certification was provided and verified instantly.", customer: "EMILY R." },
    { rating: 5, text: "Outstanding service. They guided me through selecting the perfect emerald for my custom engagement ring.", customer: "DAVID K." },
    { rating: 5, text: "Stunning craftsmanship on the ruby pendant. The ethical sourcing policy gave me complete peace of mind.", customer: "SOPHIA M." }
];

function Reviews() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [customer, setCustomer] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchReviews = async () => {
        try {
            const { data } = await API.get('/reviews');
            setReviews([...data, ...DEFAULT_REVIEWS]);
        } catch (err) {
            console.error('Error fetching site reviews:', err);
            setReviews(DEFAULT_REVIEWS);
        }
    };

    // Load reviews on mount and sync user info
    useEffect(() => {
        fetchReviews();
        if (user && user.name) {
            setCustomer(user.name);
        } else {
            setCustomer('');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in to submit a review.');
            return;
        }
        if (!text.trim()) return;

        setLoading(true);
        setError('');

        try {
            await API.post('/reviews', {
                rating,
                comment: text
            });

            // Reload reviews list
            await fetchReviews();

            // Reset form and close modal
            setText('');
            setRating(5);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Submit review error:', err);
            setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-24 bg-white min-h-screen">
            {/* Hero Banner */}
            <section 
                className="w-full h-[55vh] md:h-[60vh] lg:h-[65vh] bg-contain md:bg-cover bg-center bg-no-repeat bg-stone-950 mb-12 md:mb-20 relative"
                style={{ backgroundImage: `url("${reviewBanner}")` }}
            >
                {/* Subtle dark overlay for premium texture */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
            </section>

            {/* Header Section */}
            <div className="text-center mb-6 px-4">
                <h1 className="text-4xl md:text-5xl font-sans font-bold text-[#0f172a] tracking-tight">
                    Reviews
                </h1>
                <div className="w-16 h-1 bg-[#0f172a] mx-auto mt-4 rounded-full"></div>
                <p className="text-[#475569] mt-6 text-base font-light max-w-xl mx-auto leading-relaxed">
                    Check out what our customers say about their experiences
                </p>
            </div>

            {/* Write a Review Button */}
            <div className="text-center mb-16">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gemRed text-white hover:bg-gemRedDark transition-all duration-300 uppercase tracking-[0.2em] text-xs font-bold py-4 px-10 rounded-full shadow-lg shadow-gemRed/20 hover:scale-105"
                >
                    Write a Review
                </button>
            </div>

            {/* Grid of Light Review Cards */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, idx) => {
                        return (
                            <div 
                                key={idx} 
                                className="relative bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between min-h-[300px] border-2 border-stone-200 hover:border-gemRed"
                            >
                                {/* Quote Mark Watermark in Top Right */}
                                <div className="absolute right-6 top-4 select-none pointer-events-none text-stone-100 font-serif text-8xl font-bold leading-none">
                                    ””
                                </div>

                                <div className="space-y-6">
                                    {/* Stars Rating (orange-gold) */}
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={15} 
                                                className={`${
                                                    i < review.rating 
                                                        ? 'fill-[#f59e0b] text-[#f59e0b]' 
                                                        : 'text-stone-200 fill-transparent'
                                                }`} 
                                            />
                                        ))}
                                    </div>

                                    {/* Review Text in Italic Serif */}
                                    <p className="text-stone-800 font-serif italic text-lg leading-relaxed font-light">
                                        "{review.comment || review.text}"
                                    </p>
                                </div>

                                {/* Bottom Section */}
                                <div className="mt-8">
                                    {/* Divider Line */}
                                    <div className="border-t border-stone-100 my-5"></div>

                                    {/* Customer Profile */}
                                    <div className="flex items-center gap-4">
                                        {/* Circular Avatar outline */}
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-stone-50 border border-stone-200">
                                            <User size={18} className="text-stone-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-sans font-bold text-stone-900 text-sm tracking-wider uppercase">
                                                {review.name || review.customer}
                                            </h4>
                                            <p className="text-[10px] font-bold text-stone-400 tracking-widest uppercase mt-0.5">
                                                Verified Purchase
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                        onClick={() => setIsModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-stone-100 relative z-10 animate-fadeIn space-y-6">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-stone-400 hover:text-stone-700 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div>
                            <h3 className="text-3xl font-serif text-slate-900 mb-1">Write a Review</h3>
                            <p className="text-xs text-stone-400 tracking-wider uppercase font-bold">Share your experience with us</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Rating Selector */}
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2 block">Rating</label>
                                <div className="flex items-center gap-1.5">
                                    {[1, 2, 3, 4, 5].map((starVal) => (
                                        <button
                                            type="button"
                                            key={starVal}
                                            onClick={() => setRating(starVal)}
                                            onMouseEnter={() => setHoverRating(starVal)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none transition-transform active:scale-95"
                                        >
                                            <Star 
                                                size={24} 
                                                className={`transition-colors ${
                                                    starVal <= (hoverRating || rating)
                                                        ? 'fill-[#f59e0b] text-[#f59e0b]'
                                                        : 'text-stone-200 fill-transparent'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name Input */}
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1 block">Your Name</label>
                                <input 
                                    type="text" 
                                    value={customer || 'Anonymous'} 
                                    disabled
                                    className="w-full bg-stone-50 border-t-0 border-x-0 border-b border-stone-200 rounded-none px-0 py-3 text-stone-500 focus:outline-none cursor-not-allowed" 
                                />
                            </div>

                            {/* Review Textarea */}
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1 block">Your Testimonial</label>
                                <textarea 
                                    value={text} 
                                    onChange={(e) => setText(e.target.value)} 
                                    required 
                                    rows="3"
                                    placeholder="Describe your experience with our products or customer support..."
                                    className="w-full bg-transparent border-t-0 border-x-0 border-b border-stone-200 rounded-none px-0 py-3 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-0 focus:border-stone-800 transition-colors resize-none"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gemRed text-white hover:bg-gemRedDark transition-colors uppercase tracking-[0.2em] text-xs font-bold py-4 rounded-full shadow-lg shadow-gemRed/20 duration-300 disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'Submit Review'}
                                </button>
                                {error && <p className="text-red-500 text-xs mt-3 text-center font-semibold uppercase tracking-wider">{error}</p>}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reviews;

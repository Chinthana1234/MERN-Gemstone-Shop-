import React from 'react';
import { Star, User } from 'lucide-react';
import reviewBanner from '../assets/images/review page/Gemini_Generated_Image_agdsayagdsayagds.png';

const REVIEWS_DATA = [
    {
        rating: 5,
        text: "Really happy with this product. The quality is great and it lasts long. Definitely worth it",
        customer: "KASUN LAKMAL"
    },
    {
        rating: 5,
        text: "Exquisite sapphire and excellent customer support. Highly recommended for genuine Ceylon gems.",
        customer: "NISANSALA DE SILVA"
    },
    {
        rating: 1,
        text: "this website is not recommended cause i got bad experience.",
        customer: "SHASHIKALA SAMARANAYAKA"
    }
];

function Reviews() {
    return (
        <div className="pb-24 bg-white min-h-screen">
            {/* Hero Banner */}
            <section 
                className="w-full h-[65vh] bg-cover bg-center bg-no-repeat mb-20 relative"
                style={{ backgroundImage: `url("${reviewBanner}")` }}
            >
                {/* Subtle dark overlay for premium texture */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
            </section>

            {/* Grid of Light Review Cards */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {REVIEWS_DATA.map((review, idx) => {
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
                                                className={`${i < review.rating
                                                    ? 'fill-[#f59e0b] text-[#f59e0b]'
                                                    : 'text-stone-200 fill-transparent'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Review Text in Italic Serif */}
                                    <p className="text-stone-800 font-serif italic text-lg leading-relaxed font-light">
                                        "{review.text}"
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
                                                {review.customer}
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
        </div>
    );
}

export default Reviews;

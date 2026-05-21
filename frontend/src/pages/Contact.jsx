import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import contactBanner from '../assets/images/contact page/Gemini_Generated_Image_klb2feklb2feklb2.png';
import contactGemImage from '../assets/images/contact page/lucid-origin_Macro_product_photography_of_a_brilliant_cut_insert_gemstone_e.g._golden_citrine-0.jpg';

function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate sending
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setForm({ name: '', email: '', message: '' });
        }, 1500);
    };

    return (
        <div className="pb-20 min-h-screen bg-white">
            {/* Hero */}
            <section 
                className="w-full h-screen bg-cover bg-center bg-no-repeat mb-20 relative"
                style={{ backgroundImage: `url("${contactBanner}")` }}
            >
                {/* Subtle dark overlay for premium texture */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
            </section>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                    {/* Contact Form on the Left */}
                    <div>
                        {submitted ? (
                            <div className="bg-stone-50 border border-stone-200/60 rounded-3xl p-12 text-center shadow-sm animate-fadeIn">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={32} className="text-green-600" />
                                </div>
                                <h3 className="text-2xl font-serif text-stone-900 mb-3">Message Sent!</h3>
                                <p className="text-stone-600 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                                <button onClick={() => setSubmitted(false)}
                                    className="text-gemRed hover:underline text-sm uppercase tracking-widest font-semibold">
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white border border-stone-100 rounded-3xl p-10 md:p-12 shadow-sm space-y-10">
                                <div>
                                    <h2 className="text-4xl font-serif text-slate-900 mb-2 font-normal leading-tight">Compose a Message</h2>
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-stone-400 block uppercase">Expected Response: 24h</span>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1 block">Full Name</label>
                                        <input type="text" name="name" value={form.name} onChange={handleChange} required
                                            placeholder="E.g. Gabriel Blanc"
                                            className="w-full bg-transparent border-t-0 border-x-0 border-b border-stone-200 rounded-none px-0 py-3 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-0 focus:border-stone-800 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1 block">Email Address</label>
                                        <input type="email" name="email" value={form.email} onChange={handleChange} required
                                            placeholder="hello@example.com"
                                            className="w-full bg-transparent border-t-0 border-x-0 border-b border-stone-200 rounded-none px-0 py-3 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-0 focus:border-stone-800 transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1 block">Your Inquiry</label>
                                    <textarea name="message" value={form.message} onChange={handleChange} required rows="3"
                                        placeholder="How can we assist you today?"
                                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-stone-200 rounded-none px-0 py-3 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-0 focus:border-stone-800 transition-colors resize-none"></textarea>
                                </div>
                                <div className="pt-2">
                                    <button type="submit" disabled={loading}
                                        className="bg-gemRed text-white hover:bg-gemRedDark transition-colors uppercase tracking-[0.2em] text-xs font-bold py-4 px-10 rounded-full shadow-lg shadow-gemRed/20 duration-300 disabled:opacity-50">
                                        {loading ? 'Sending...' : 'SEND MESSAGE'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Image on the Right */}
                    <div className="relative overflow-hidden rounded-3xl h-[450px] lg:h-full shadow-md border border-stone-100/80 group">
                        <img 
                            src={contactGemImage} 
                            alt="Golden Citrine Gemstone" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;

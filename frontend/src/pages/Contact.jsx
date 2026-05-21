import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import contactBanner from '../assets/images/contact page/Gemini_Generated_Image_klb2feklb2feklb2.png';

const CONTACT_INFO = [
    { icon: Mail, label: 'Email', value: 'hello@auragems.com', href: 'mailto:hello@auragems.com' },
    { icon: Phone, label: 'Phone', value: '+94 11 234 5678', href: 'tel:+94112345678' },
    { icon: MapPin, label: 'Address', value: 'No. 45, Gem Street, Colombo 03, Sri Lanka', href: null },
    { icon: Clock, label: 'Hours', value: 'Mon - Sat: 9:00 AM - 6:00 PM', href: null }
];

function Contact() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
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
            setForm({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className="pb-20 min-h-screen bg-gemBgAlt">
            {/* Hero */}
            <section 
                className="w-full h-screen bg-cover bg-center bg-no-repeat mb-20 relative"
                style={{ backgroundImage: `url("${contactBanner}")` }}
            >
                {/* Subtle dark overlay for premium texture */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
            </section>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    {/* Contact Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gemCard border border-gemBorder rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl hover:border-gemRed/30 transition-all duration-500">
                            <h2 className="text-xl font-serif mb-6 text-gemText">Contact Information</h2>
                            <p className="text-gemTextLight text-sm font-light mb-8 leading-relaxed">
                                Reach out to our gemstone specialists for personalized guidance and support.
                            </p>
                            <div className="space-y-6">
                                {CONTACT_INFO.map((info, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gemRed/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <info.icon size={18} className="text-gemRed" />
                                        </div>
                                        <div>
                                            <p className="text-gemTextMuted text-[10px] uppercase tracking-widest mb-1 font-semibold">{info.label}</p>
                                            {info.href ? (
                                                <a href={info.href} className="text-gemText hover:text-gemRed transition-colors text-sm break-all font-light block">{info.value}</a>
                                            ) : (
                                                <p className="text-gemTextLight text-sm font-light break-words">{info.value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        {submitted ? (
                            <div className="bg-gemCard border border-gemBorder rounded-2xl p-12 text-center shadow-sm animate-fadeIn">
                                <div className="w-16 h-16 bg-green-100/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={32} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-serif text-gemText mb-3">Message Sent!</h3>
                                <p className="text-gemTextLight mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                                <button onClick={() => setSubmitted(false)}
                                    className="text-gemRed hover:underline text-sm uppercase tracking-widest font-semibold">
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-gemCard border border-gemBorder rounded-2xl p-8 shadow-sm space-y-6">
                                <h2 className="text-xl font-serif text-gemText mb-2">Send Us a Message</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 block">Your Name *</label>
                                        <input type="text" name="name" value={form.name} onChange={handleChange} required
                                            className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 block">Email Address *</label>
                                        <input type="email" name="email" value={form.email} onChange={handleChange} required
                                            className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 block">Subject *</label>
                                    <input type="text" name="subject" value={form.subject} onChange={handleChange} required
                                        placeholder="e.g., Inquiry about Ceylon Sapphires"
                                        className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors" />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-gemTextMuted mb-2 block">Message *</label>
                                    <textarea name="message" value={form.message} onChange={handleChange} required rows="5"
                                        placeholder="Tell us how we can help..."
                                        className="w-full bg-gemBgAlt border border-gemBorder p-3 text-gemText rounded focus:outline-none focus:border-gemRed transition-colors resize-none"></textarea>
                                </div>
                                <button type="submit" disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-gemRed text-white font-semibold uppercase tracking-widest text-sm py-3.5 hover:bg-gemRedDark transition-all duration-300 rounded disabled:opacity-50">
                                    <Send size={16} />
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;

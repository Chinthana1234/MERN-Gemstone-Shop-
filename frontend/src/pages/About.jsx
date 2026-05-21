import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, Shield, Award, Globe, Heart, Users } from 'lucide-react';
import aboutBg from '../assets/images/about page/Gemini_Generated_Image_lwztsnlwztsnlwzt (1).png';
import aboutMission from '../assets/images/about page/gemini-2.5-flash-image_and_delte_negative_pfo1m_box_and_add_text_to_like_more_proffesional-0 (2).jpg';

const VALUES = [
    { icon: Gem, title: 'Ethically Sourced', description: 'Every gemstone is traced back to responsible mining operations that prioritize sustainability.' },
    { icon: Shield, title: 'Certified Authentic', description: 'Each stone comes with a gemological certificate from internationally recognized laboratories.' },
    { icon: Award, title: 'Expert Curated', description: 'Our GIA-certified gemologists hand-select every stone for exceptional color, clarity, and cut.' },
    { icon: Globe, title: 'Global Sourcing', description: 'From Sri Lanka\'s sapphire mines to Colombia\'s emerald valleys — the world\'s finest origins.' },
    { icon: Heart, title: 'Passion for Gems', description: 'Founded by gemstone enthusiasts with deep appreciation for these natural wonders.' },
    { icon: Users, title: 'Customer First', description: 'Personalized consultation, secure packaging, and a satisfaction guarantee on every purchase.' }
];

const STATS = [
    { value: '2,500+', label: 'Gemstones Sold' },
    { value: '98%', label: 'Customer Satisfaction' },
    { value: '15+', label: 'Countries Served' },
    { value: '50+', label: 'Years Combined Exp.' }
];

function About() {
    return (
        <div className="pb-20 min-h-screen bg-gemBgAlt">
            {/* Hero */}
            <section
                className="w-full h-screen bg-cover bg-center bg-no-repeat mb-20"
                style={{ backgroundImage: `url("${aboutBg}")` }}
            >
            </section>

            {/* Mission */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-gemRed tracking-[0.3em] text-xs uppercase font-semibold">Our Mission</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-gemText mt-3 mb-6">Bridging the Gap Between Mine and Collector</h2>
                        <p className="text-gemTextLight font-light leading-relaxed mb-4">
                            Founded with a passion for rare gemstones, Aura Gems has grown from a small family
                            operation into a trusted name in the industry. We work directly with miners and cutting
                            houses across Sri Lanka, Myanmar, Colombia, and beyond.
                        </p>
                        <p className="text-gemTextLight font-light leading-relaxed mb-6">
                            Our commitment to transparency means every stone is fully documented — from its
                            geological origin to its final certification. We provide provenance, education,
                            and the confidence that you're investing in something truly exceptional.
                        </p>
                        <Link to="/shop" className="inline-block bg-gemRed text-white font-semibold uppercase tracking-widest text-sm px-8 py-3 hover:bg-gemRedDark transition-all duration-300 rounded">
                            Explore Collection
                        </Link>
                    </div>
                    <div className="relative group">
                        <div className="aspect-square bg-gradient-to-br from-gemRed/10 via-transparent to-gemRed/5 rounded-2xl overflow-hidden border border-gemBorder shadow-xl flex items-center justify-center">
                            <img
                                src={aboutMission}
                                alt="Ethical Gemstones"
                                className="w-full h-full object-cover rounded-2xl animate-fade-in group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gemRed/10 rounded-2xl -z-10 group-hover:-translate-x-3 group-hover:translate-y-3 transition-transform duration-500"></div>
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gemRed/5 rounded-full -z-10 group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform duration-500"></div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16 mb-20">
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-3xl md:text-4xl font-serif text-white mb-2">{stat.value}</p>
                            <p className="text-gray-400 text-xs uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Values */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="text-center mb-14">
                    <span className="text-gemRed tracking-[0.3em] text-xs uppercase font-semibold">Why Choose Us</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-gemText mt-3 mb-4">Our Core Values</h2>
                    <div className="h-0.5 w-24 bg-gemRed mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {VALUES.map((val, i) => (
                        <div key={i} className="bg-gemCard border border-gemBorder rounded-lg p-8 text-center hover:shadow-lg hover:border-gemRed/30 transition-all duration-500 group">
                            <div className="w-14 h-14 mx-auto mb-5 bg-gemRed/10 rounded-full flex items-center justify-center group-hover:bg-gemRed/20 transition-colors duration-500">
                                <val.icon size={24} className="text-gemRed" />
                            </div>
                            <h3 className="text-lg font-serif text-gemText mb-3">{val.title}</h3>
                            <p className="text-gemTextLight font-light text-sm leading-relaxed">{val.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-4xl mx-auto px-4 text-center">
                <div className="bg-gemCard border border-gemBorder rounded-2xl p-12 shadow-sm">
                    <h2 className="text-2xl md:text-3xl font-serif text-gemText mb-4">Ready to Find Your Perfect Gem?</h2>
                    <p className="text-gemTextLight font-light max-w-xl mx-auto mb-8">
                        Browse our curated collection of certified gemstones, each hand-selected for exceptional quality.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/shop" className="bg-gemRed text-white font-semibold uppercase tracking-widest text-sm px-8 py-3 hover:bg-gemRedDark transition-all duration-300 rounded">Shop Now</Link>
                        <Link to="/contact" className="border-2 border-gemBorder text-gemTextLight font-semibold uppercase tracking-widest text-sm px-8 py-3 hover:border-gemRed hover:text-gemRed transition-all duration-300 rounded">Get in Touch</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;

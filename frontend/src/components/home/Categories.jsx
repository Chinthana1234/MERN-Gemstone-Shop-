import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    name: 'Sapphires',
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=2000&auto=format&fit=crop',
    span: 'col-span-1 md:col-span-2 row-span-2' // Large featured category
  },
  {
    name: 'Rubies',
    image: 'https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=2000&auto=format&fit=crop',
    span: 'col-span-1 row-span-1'
  },
  {
    name: 'Emeralds',
    image: 'https://images.unsplash.com/photo-1584347526972-2292f7041a87?q=80&w=2000&auto=format&fit=crop',
    span: 'col-span-1 row-span-1'
  }
];

function Categories() {
  return (
    <section className="py-24 bg-gemDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Shop by Category</h2>
            <div className="h-0.5 w-24 bg-gemGold"></div>
          </div>
          <p className="text-gray-400 font-light max-w-md md:text-right">
            Explore our vast collection organized by gemstone type to find the perfect stone for your bespoke piece.
          </p>
        </div>

        {/* Categories Grid (Bento Box style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {CATEGORIES.map((cat, index) => (
            <Link 
              to={`/shop?category=${cat.name.toLowerCase()}`} 
              key={index}
              className={`relative overflow-hidden group ${cat.span}`}
            >
              {/* Background Image */}
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100 grayscale-[30%] group-hover:grayscale-0"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Text Content */}
              <div className="absolute bottom-8 left-8">
                <h3 className="text-3xl font-serif text-white mb-2">{cat.name}</h3>
                <span className="text-gemGold text-sm uppercase tracking-widest flex items-center gap-2 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  Discover Now <span className="text-lg">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Categories;

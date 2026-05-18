import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    name: 'Blue Sapphires',
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=600&auto=format&fit=crop',
    query: 'sapphire'
  },
  {
    name: 'Ruby',
    image: 'https://images.unsplash.com/photo-1601121853354-e6e866bd2aca?q=80&w=600&auto=format&fit=crop',
    query: 'ruby'
  },
  {
    name: 'Emerald',
    image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=600&auto=format&fit=crop',
    query: 'emerald'
  },
  {
    name: 'Padparadscha',
    image: 'https://images.unsplash.com/photo-1583937443573-bf382b52be17?q=80&w=600&auto=format&fit=crop',
    query: 'sapphire'
  },
  {
    name: 'Star Sapphires',
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=600&auto=format&fit=crop',
    query: 'sapphire'
  }
];

function Categories() {
  return (
    <section className="py-24 bg-gemBg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-gemTextMuted font-semibold mb-3">From Sri Lanka to the World</p>
          <h2 className="text-3xl md:text-4xl font-serif text-gemText mb-4">Shop by Category</h2>
          <div className="h-0.5 w-24 bg-gemRed mx-auto"></div>
        </div>

        {/* Categories Grid - Wijaya Gems inspired */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((cat, index) => (
            <Link 
              to={`/shop?category=${cat.query}`} 
              key={index}
              className="group text-center"
            >
              {/* Gemstone Image on light background */}
              <div className="relative overflow-hidden bg-gemBgMarble aspect-square rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 mb-4">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay with name */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-serif text-lg tracking-wide drop-shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
                    {cat.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Categories;

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';

const FEATURED_GEMS = [
  {
    id: 1,
    name: 'Ceylon Blue Sapphire',
    price: '$2,450',
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=2080&auto=format&fit=crop',
    category: 'Sapphire'
  },
  {
    id: 2,
    name: 'Pigeon Blood Ruby',
    price: '$3,800',
    image: 'https://images.unsplash.com/photo-1601121853354-e6e866bd2aca?q=80&w=1974&auto=format&fit=crop',
    category: 'Ruby'
  },
  {
    id: 3,
    name: 'Colombian Emerald',
    price: '$4,100',
    image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=2070&auto=format&fit=crop',
    category: 'Emerald'
  }
];

function FeaturedGems() {
  return (
    <section className="py-24 bg-gemDarker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Featured Collections</h2>
          <div className="h-0.5 w-24 bg-gemGold mx-auto"></div>
          <p className="mt-4 text-gray-400 font-light">Curated masterpieces for the discerning collector.</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {FEATURED_GEMS.map((gem) => (
            <div key={gem.id} className="group cursor-pointer">
              {/* Image Container */}
              <div className="relative overflow-hidden bg-gemCard aspect-[4/5] mb-4">
                <img 
                  src={gem.image} 
                  alt={gem.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                
                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white text-black p-3 rounded-full hover:bg-gemGold transition-colors">
                    <ShoppingBag size={20} />
                  </button>
                  <button className="bg-white text-black p-3 rounded-full hover:bg-gemGold transition-colors">
                    <Heart size={20} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center">
                <p className="text-gemGold text-xs uppercase tracking-widest mb-2">{gem.category}</p>
                <h3 className="text-lg font-serif text-gray-100 mb-1">{gem.name}</h3>
                <p className="text-gray-400 font-light">{gem.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link 
            to="/shop"
            className="inline-block border border-gemGold text-gemGold hover:bg-gemGold hover:text-black font-semibold tracking-widest uppercase text-sm px-10 py-3 transition-colors duration-300"
          >
            View All Products
          </Link>
        </div>

      </div>
    </section>
  );
}

export default FeaturedGems;

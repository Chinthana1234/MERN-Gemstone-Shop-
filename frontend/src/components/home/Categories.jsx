import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';

const GEM_TYPES = [
  'Blue Sapphire',
  'Yellow Sapphire',
  'White Sapphire',
  'Spessartine Garnet',
  'Ruby',
  'Emerald',
  "Cat's Eye"
];

const JEWELRY_TYPES = [
  'Rings',
  'Necklaces',
  'Earrings',
  'Bracelets'
];

const JEWELRY_FALLBACK_IMAGES = {
  'Rings': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80',
  'Necklaces': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80',
  'Earrings': 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=300&q=80',
  'Bracelets': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=300&q=80'
};

function Categories() {
  const [gemsData, setGemsData] = useState([]);
  const [jewelryData, setJewelryData] = useState([]);

  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        const { data } = await API.get('/products?fetchAll=true');
        const products = data.products || [];

        // Find one image for each gem type
        const gems = GEM_TYPES.map(type => {
          const product = products.find(p => p.category && p.category.trim().toLowerCase() === type.trim().toLowerCase());
          return {
            name: type,
            image: product ? product.imageUrl : '',
            query: type,
            type: 'gems'
          };
        }).filter(c => c.image !== '');

        // Find one image for each jewelry type
        const jewelry = JEWELRY_TYPES.map(type => {
          const product = products.find(p => {
            const cat = p.category ? p.category.trim().toLowerCase() : '';
            const cleanType = type.trim().toLowerCase();
            return cat === cleanType || cat === cleanType.replace(/s$/, '') || cleanType === cat.replace(/s$/, '');
          });
          return {
            name: type,
            image: product ? product.imageUrl : (JEWELRY_FALLBACK_IMAGES[type] || ''),
            query: type,
            type: 'jewelry'
          };
        }).filter(c => c.image !== '');

        setGemsData(gems);
        setJewelryData(jewelry);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategoryImages();
  }, []);

  return (
    <section className="py-24 bg-stone-50 border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500 font-semibold mb-3">From Sri Lanka to the World</p>
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Shop by Category</h2>
          <div className="h-0.5 w-24 bg-gemRed mx-auto"></div>
        </div>

        {/* Gemstones Section */}
        <div className="mb-16">
          <h3 className="text-sm uppercase tracking-widest text-stone-400 font-bold mb-8 text-center font-serif">Gemstone Collections</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 justify-center">
            {gemsData.map((cat, index) => (
              <Link
                to={`/shop?type=gems&category=${encodeURIComponent(cat.query)}`}
                key={index}
                className="group text-center flex flex-col items-center"
              >
                {/* Gemstone Image with Professional Styling */}
                <div className="w-full relative overflow-hidden bg-white aspect-square rounded-lg shadow-sm border border-stone-200 group-hover:border-gemRed transition-colors duration-300 mb-4 flex items-center justify-center p-6">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-xl"
                  />
                </div>
                <span className="text-stone-800 font-serif text-sm tracking-wide group-hover:text-gemRed transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Jewelry Section */}
        <div>
          <h3 className="text-sm uppercase tracking-widest text-stone-400 font-bold mb-8 text-center font-serif">Jewelry Collections</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto justify-center">
            {jewelryData.map((cat, index) => (
              <Link
                to={`/shop?type=jewelry&category=${encodeURIComponent(cat.query)}`}
                key={index}
                className="group text-center flex flex-col items-center"
              >
                {/* Jewelry Image with Professional Styling */}
                <div className="w-full relative overflow-hidden bg-white aspect-square rounded-lg shadow-sm border border-stone-200 group-hover:border-gemRed transition-colors duration-300 mb-4">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <span className="text-stone-800 font-serif text-sm tracking-wide group-hover:text-gemRed transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Categories;

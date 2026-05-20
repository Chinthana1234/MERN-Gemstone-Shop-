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

function Categories() {
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        const { data } = await API.get('/products?fetchAll=true');
        const products = data.products || [];
        
        // Find one image for each gem type
        const cats = GEM_TYPES.map(type => {
            const product = products.find(p => p.category === type);
            return {
                name: type,
                image: product ? product.imageUrl : '',
                query: type
            };
        }).filter(c => c.image !== ''); // Only keep categories that have an image
        
        setCategoriesData(cats);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategoryImages();
  }, []);

  return (
    <section className="py-24 bg-gemBg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-gemTextMuted font-semibold mb-3">From Sri Lanka to the World</p>
          <h2 className="text-3xl md:text-4xl font-serif text-gemText mb-4">Shop by Category</h2>
          <div className="h-0.5 w-24 bg-gemRed mx-auto"></div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
          {categoriesData.map((cat, index) => (
            <Link 
              to={`/shop?keyword=${encodeURIComponent(cat.query)}`} 
              key={index}
              className="group text-center flex flex-col items-center"
            >
              {/* Gemstone Image with Professional Styling */}
              <div className="w-full relative overflow-hidden bg-gradient-to-b from-[#151515] to-[#0a0a0a] aspect-square rounded-full shadow-lg border border-gemBorder group-hover:border-gemRed transition-colors duration-300 mb-4 flex items-center justify-center p-6">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-xl"
                />
              </div>
              <span className="text-gemText font-serif text-sm tracking-wide group-hover:text-gemRed transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Categories;

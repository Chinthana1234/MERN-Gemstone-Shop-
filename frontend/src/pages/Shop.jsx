import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ChevronDown, Filter, X, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import API from '../utils/api';

const GEM_TYPES = [
  'Sapphire',
  'Ruby',
  'Emerald',
  'Padparadscha',
  'Spessartine Garnet',
  'Garnet'
];

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Best selling', value: '' }, // Just visual placeholder for now
  { label: 'Title ascending', value: 'nameAsc' },
  { label: 'Title descending', value: 'nameDesc' },
  { label: 'Price ascending', value: 'priceAsc' },
  { label: 'Price descending', value: 'priceDesc' },
  { label: 'Created ascending', value: 'oldest' },
  { label: 'Created descending', value: 'newest' },
];

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  const { addToCart } = useCart();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [caratRange, setCaratRange] = useState({ min: '', max: '' });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sort, setSort] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, sort]); // Fetch automatically on category or sort change

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams();
      
      if (selectedCategories.length > 0) {
        queryParams.append('category', selectedCategories.join(','));
      }
      if (caratRange.min) queryParams.append('minCarat', caratRange.min);
      if (caratRange.max) queryParams.append('maxCarat', caratRange.max);
      if (priceRange.min) queryParams.append('minPrice', priceRange.min);
      if (priceRange.max) queryParams.append('maxPrice', priceRange.max);
      if (sort) queryParams.append('sort', sort);

      const queryString = queryParams.toString();
      const { data } = await API.get(`/products${queryString ? `?${queryString}` : ''}`);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchProducts();
    setIsMobileFilterOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setCaratRange({ min: '', max: '' });
    setPriceRange({ min: '', max: '' });
    setSort('');
    // fetchProducts is called automatically because selectedCategories and sort changed, 
    // but wait, carat and price might have changed without triggering useEffect.
    // We will just do a manual fetch if they hit apply or clear.
    setTimeout(fetchProducts, 0); 
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center lg:hidden mb-6">
        <h2 className="text-xl font-serif text-gemText">Filters</h2>
        <button onClick={() => setIsMobileFilterOpen(false)} className="text-gemTextLight">
          <X size={24} />
        </button>
      </div>

      {/* Carat Weight */}
      <div className="border-b border-gemBorder pb-8">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-gemText mb-4 flex items-center justify-between">
          Carat Weight
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <input 
            type="number" 
            placeholder="Min" 
            value={caratRange.min}
            onChange={(e) => setCaratRange({...caratRange, min: e.target.value})}
            className="w-full bg-gemBgAlt border border-gemBorder text-gemText p-2 text-center focus:outline-none focus:border-gemRed"
          />
          <span className="text-gemTextLight">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={caratRange.max}
            onChange={(e) => setCaratRange({...caratRange, max: e.target.value})}
            className="w-full bg-gemBgAlt border border-gemBorder text-gemText p-2 text-center focus:outline-none focus:border-gemRed"
          />
        </div>
        <button onClick={handleApplyFilters} className="w-full text-xs uppercase tracking-widest bg-gemCard border border-gemBorder hover:border-gemRed hover:text-gemRed text-gemTextLight py-2 transition-colors">
          Apply Range
        </button>
      </div>

      {/* Gem Type */}
      <div className="border-b border-gemBorder pb-8">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-gemText mb-4">
          Gem Type
        </h3>
        <div className="space-y-3">
          {GEM_TYPES.map(cat => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                selectedCategories.includes(cat) ? 'bg-gemRed border-gemRed' : 'border-gemBorder group-hover:border-gemRed'
              }`}>
                {selectedCategories.includes(cat) && <Check size={12} className="text-white" />}
              </div>
              <span className={`text-sm transition-colors ${selectedCategories.includes(cat) ? 'text-gemText' : 'text-gemTextLight group-hover:text-gemText'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="pb-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-gemText mb-4">
          Price ($)
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-full">
            <span className="absolute left-3 top-2.5 text-gemTextMuted text-sm">$</span>
            <input 
              type="number" 
              placeholder="Min" 
              value={priceRange.min}
              onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
              className="w-full bg-gemBgAlt border border-gemBorder text-gemText p-2 pl-7 focus:outline-none focus:border-gemRed"
            />
          </div>
          <span className="text-gemTextLight">-</span>
          <div className="relative w-full">
            <span className="absolute left-3 top-2.5 text-gemTextMuted text-sm">$</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={priceRange.max}
              onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
              className="w-full bg-gemBgAlt border border-gemBorder text-gemText p-2 pl-7 focus:outline-none focus:border-gemRed"
            />
          </div>
        </div>
        <button onClick={handleApplyFilters} className="w-full text-xs uppercase tracking-widest bg-gemCard border border-gemBorder hover:border-gemRed hover:text-gemRed text-gemTextLight py-2 transition-colors">
          Apply Price
        </button>
      </div>

      <button onClick={handleClearFilters} className="w-full text-xs uppercase tracking-widest text-gemRed hover:underline py-2">
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gemBgAlt">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="text-gemRed tracking-[0.3em] text-xs uppercase font-semibold">Our Collection</span>
          <h1 className="text-4xl md:text-5xl font-serif text-gemText mt-3 mb-4">Gemstone Gallery</h1>
          <div className="h-0.5 w-24 bg-gemRed mx-auto"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex justify-between items-center border-b border-gemBorder pb-4">
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 text-gemText uppercase tracking-widest text-sm font-semibold"
            >
              <Filter size={18} /> Filters
            </button>
            <div className="text-sm text-gemTextLight">{products.length} products</div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-1/4 shrink-0 pr-6">
            <FilterSidebar />
          </div>

          {/* Mobile Sidebar Overlay */}
          <div className={`fixed inset-0 z-50 bg-black/80 transition-opacity duration-300 lg:hidden ${isMobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className={`fixed inset-y-0 left-0 w-[80%] max-w-sm bg-gemCard p-6 overflow-y-auto transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <FilterSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            
            {/* Topbar: Sort & Count (Desktop) */}
            <div className="hidden lg:flex justify-between items-center mb-8 border-b border-gemBorder pb-4">
              <div className="text-sm text-gemTextLight uppercase tracking-widest">{products.length} products</div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gemText uppercase tracking-widest font-semibold">Sort By:</span>
                <div className="relative">
                  <select 
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-transparent border-none text-gemTextLight hover:text-gemText text-sm pr-6 focus:outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.label} value={opt.value} className="bg-gemCard text-gemText">{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gemTextLight pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Mobile Sort */}
            <div className="lg:hidden flex justify-between items-center mb-6">
               <span className="text-sm text-gemText uppercase tracking-widest font-semibold">Sort By:</span>
               <div className="relative">
                  <select 
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-transparent border-none text-gemTextLight text-sm pr-6 focus:outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.label} value={opt.value} className="bg-gemCard text-gemText">{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gemTextLight pointer-events-none" />
                </div>
            </div>

            {/* Loading Skeletons */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gemBorder aspect-[4/5] mb-4 rounded-lg"></div>
                    <div className="h-3 bg-gemBorder w-1/3 mx-auto mb-2 rounded"></div>
                    <div className="h-4 bg-gemBorder w-2/3 mx-auto mb-2 rounded"></div>
                    <div className="h-3 bg-gemBorder w-1/4 mx-auto rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Product Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                  <Link to={`/product/${product._id}`} key={product._id} className="group cursor-pointer block">
                    <div className="relative overflow-hidden bg-gemCard aspect-[4/5] mb-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                      <img src={product.imageUrl} alt={product.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
                      
                      {product.stock <= 3 && product.stock > 0 && (
                        <span className="absolute top-4 left-4 bg-gemRed text-white text-xs px-3 py-1 uppercase tracking-wider rounded">
                          Only {product.stock} Left
                        </span>
                      )}

                      <div className="absolute inset-0 bg-black/15 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={(e) => handleAddToCart(e, product)}
                          className={`p-3 rounded-full transition-colors shadow-lg ${
                            addedId === product._id ? 'bg-green-500 text-white' : 'bg-gemCard text-gemText hover:bg-gemRed hover:text-white'
                          }`}>
                          <ShoppingBag size={20} />
                        </button>
                        <button className="bg-gemCard text-gemText p-3 rounded-full hover:bg-gemRed hover:text-white transition-colors shadow-lg">
                          <Heart size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-gemRed text-xs uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="text-lg font-serif text-gemText mb-1 group-hover:text-gemRed transition-colors">{product.name}</h3>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < Math.round(product.rating) ? 'fill-gemGold text-gemGold' : 'text-gemBorder'} />
                        ))}
                        <span className="text-xs text-gemTextMuted ml-1">({product.numReviews})</span>
                      </div>
                      <p className="text-gemText font-medium">${product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-20 bg-gemCard rounded-lg border border-gemBorder">
                <p className="text-gemTextLight text-lg mb-4">No gemstones match your filters.</p>
                <button onClick={handleClearFilters} className="text-gemRed hover:underline uppercase tracking-widest text-sm font-semibold">
                  Clear Filters
                </button>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}

export default Shop;

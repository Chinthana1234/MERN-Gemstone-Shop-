import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ChevronDown, Filter, X, Check, LayoutGrid, List } from 'lucide-react';
import { useCart } from '../context/CartContext';
import API from '../utils/api';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// Custom styles for rc-slider to match dark luxury theme
const sliderStyles = {
  track: { backgroundColor: '#C41230', height: 4 }, // gemRed
  handle: {
    borderColor: '#C41230',
    backgroundColor: '#050505',
    opacity: 1,
    boxShadow: 'none',
    width: 16,
    height: 16,
    marginTop: -6,
  },
  rail: { backgroundColor: '#333333', height: 4 },
};

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
  { label: 'Best selling', value: '' }, 
  { label: 'Title ascending', value: 'nameAsc' },
  { label: 'Title descending', value: 'nameDesc' },
  { label: 'Price ascending', value: 'priceAsc' },
  { label: 'Price descending', value: 'priceDesc' },
  { label: 'Created ascending', value: 'oldest' },
  { label: 'Created descending', value: 'newest' },
];

function Shop() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Used for category counts
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  const { addToCart } = useCart();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [caratRange, setCaratRange] = useState([0, 15]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sort, setSort] = useState('');

  // Initial fetch for all products to get accurate category counts
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { data } = await API.get('/products');
        setAllProducts(data);
      } catch (err) {
        console.error("Error fetching all products for counts:", err);
      }
    };
    fetchAllProducts();
  }, []);

  const getCategoryCount = (cat) => {
    return allProducts.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;
  };

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
      queryParams.append('minCarat', caratRange[0]);
      queryParams.append('maxCarat', caratRange[1]);
      queryParams.append('minPrice', priceRange[0]);
      queryParams.append('maxPrice', priceRange[1]);
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
    setCaratRange([0, 15]);
    setPriceRange([0, 50000]);
    setSort('');
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
    <div className="space-y-10">
      <div className="flex justify-between items-center lg:hidden mb-6">
        <h2 className="text-xl font-serif text-gemText">Filters</h2>
        <button onClick={() => setIsMobileFilterOpen(false)} className="text-gemTextLight">
          <X size={24} />
        </button>
      </div>

      {/* Carat Weight Slider */}
      <div className="border-b border-gemBorder pb-10">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-gemText mb-6">
          Carat Weight
        </h3>
        
        <div className="flex justify-between items-center mb-6">
            <div className="border border-gemBorder px-4 py-2 w-20 text-center text-sm text-gemText font-serif bg-gemBgAlt">{caratRange[0]}</div>
            <span className="text-gemTextMuted">-</span>
            <div className="border border-gemBorder px-4 py-2 w-20 text-center text-sm text-gemText font-serif bg-gemBgAlt">{caratRange[1]}</div>
        </div>

        <div className="px-2 mb-2">
            <Slider 
              range 
              min={0} 
              max={15} 
              step={0.5} 
              value={caratRange} 
              onChange={setCaratRange}
              onAfterChange={fetchProducts}
              styles={sliderStyles}
            />
            <div className="flex justify-between mt-4 text-xs text-gemText font-serif font-bold">
              <span>0</span>
              <span>3</span>
              <span>6</span>
              <span>8</span>
              <span>15</span>
            </div>
        </div>
      </div>

      {/* Gem Type */}
      <div className="border-b border-gemBorder pb-10">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-gemText mb-6">
          Gem Type
        </h3>
        <div className="space-y-4">
          {GEM_TYPES.map(cat => (
            <div key={cat} className="flex justify-between items-center cursor-pointer group" onClick={() => toggleCategory(cat)}>
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                  selectedCategories.includes(cat) ? 'bg-gemRed border-gemRed' : 'border-gemBorder group-hover:border-gemRed'
                }`}>
                  {selectedCategories.includes(cat) && <Check size={12} className="text-white" />}
                </div>
                <span className={`text-sm font-serif font-bold transition-colors ${selectedCategories.includes(cat) ? 'text-gemText' : 'text-gemTextLight group-hover:text-gemText'}`}>
                  {cat}
                </span>
              </div>
              <span className="text-xs text-gemTextMuted font-serif font-bold">({getCategoryCount(cat)})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="pb-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-gemText mb-6">
          Price ($)
        </h3>
        
        <div className="flex justify-between items-center mb-6">
            <div className="border border-gemBorder px-4 py-2 w-24 text-center text-sm text-gemText font-serif bg-gemBgAlt">${priceRange[0].toLocaleString()}</div>
            <span className="text-gemTextMuted">-</span>
            <div className="border border-gemBorder px-4 py-2 w-24 text-center text-sm text-gemText font-serif bg-gemBgAlt">${priceRange[1].toLocaleString()}</div>
        </div>

        <div className="px-2 mb-2">
            <Slider 
              range 
              min={0} 
              max={50000} 
              step={500} 
              value={priceRange} 
              onChange={setPriceRange}
              onAfterChange={fetchProducts}
              styles={sliderStyles}
            />
            <div className="flex justify-between mt-4 text-xs text-gemText font-serif font-bold">
              <span>0</span>
              <span>10k</span>
              <span>25k</span>
              <span>50k</span>
            </div>
        </div>
      </div>

      <button onClick={handleClearFilters} className="w-full text-xs uppercase tracking-widest text-gemRed hover:underline py-2 text-center">
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border-r border-gemBorder pr-4">
                  <button onClick={() => setViewMode('grid')} className={`transition-colors ${viewMode === 'grid' ? 'text-gemText' : 'text-gemTextMuted'}`}><LayoutGrid size={18}/></button>
                  <button onClick={() => setViewMode('list')} className={`transition-colors ${viewMode === 'list' ? 'text-gemText' : 'text-gemTextMuted'}`}><List size={18}/></button>
              </div>
              <div className="text-sm font-serif font-bold text-gemText">{products.length} products</div>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-1/4 shrink-0 pr-6 border-r border-gemBorder">
            <FilterSidebar />
          </div>

          {/* Mobile Sidebar Overlay */}
          <div className={`fixed inset-0 z-50 bg-black/80 transition-opacity duration-300 lg:hidden ${isMobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className={`fixed inset-y-0 left-0 w-[80%] max-w-sm bg-gemCard p-6 overflow-y-auto transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <FilterSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 pl-0 lg:pl-4">
            
            {/* Topbar: Sort & Count (Desktop) */}
            <div className="hidden lg:flex justify-between items-center mb-8 border-b border-gemBorder pb-6">
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-serif font-bold text-gemText">View As</span>
                <button onClick={() => setViewMode('grid')} className={`transition-colors ${viewMode === 'grid' ? 'text-gemText' : 'text-gemTextMuted hover:text-gemTextLight'}`}><LayoutGrid size={20}/></button>
                <button onClick={() => setViewMode('list')} className={`transition-colors ${viewMode === 'list' ? 'text-gemText' : 'text-gemTextMuted hover:text-gemTextLight'}`}><List size={20}/></button>
              </div>

              <div className="text-sm font-serif font-bold text-gemText">{products.length} products</div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gemText uppercase tracking-widest font-semibold">Sort By:</span>
                <div className="relative">
                  <select 
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-transparent border-none text-gemTextLight hover:text-gemText text-sm font-serif font-bold pr-6 focus:outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.label} value={opt.value} className="bg-gemCard text-gemText font-sans">{opt.label}</option>
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
                    className="appearance-none bg-transparent border-none text-gemTextLight text-sm font-serif font-bold pr-6 focus:outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.label} value={opt.value} className="bg-gemCard text-gemText font-sans">{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gemTextLight pointer-events-none" />
                </div>
            </div>

            {/* Loading Skeletons */}
            {loading && (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`animate-pulse ${viewMode === 'list' ? 'flex gap-6' : ''}`}>
                    <div className={`bg-gemBorder rounded-lg ${viewMode === 'list' ? 'w-48 h-48 shrink-0' : 'aspect-[4/5] mb-4'}`}></div>
                    <div className={viewMode === 'list' ? 'flex-1 py-4' : ''}>
                        <div className={`h-3 bg-gemBorder mx-auto mb-2 rounded ${viewMode === 'list' ? 'w-1/4 mx-0' : 'w-1/3'}`}></div>
                        <div className={`h-4 bg-gemBorder mx-auto mb-2 rounded ${viewMode === 'list' ? 'w-2/3 mx-0' : 'w-2/3'}`}></div>
                        <div className={`h-3 bg-gemBorder mx-auto rounded ${viewMode === 'list' ? 'w-1/4 mx-0' : 'w-1/4'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Product Grid / List */}
            {!loading && (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
                {products.map(product => {
                  if (viewMode === 'list') {
                    return (
                      <Link to={`/product/${product._id}`} key={product._id} className="group cursor-pointer flex flex-col sm:flex-row gap-6 bg-gemCard p-4 rounded-lg shadow-sm border border-transparent hover:border-gemBorder transition-all">
                        <div className="w-full sm:w-56 h-56 shrink-0 relative overflow-hidden rounded">
                          <img src={product.imageUrl} alt={product.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                          {product.stock <= 3 && product.stock > 0 && (
                            <span className="absolute top-3 left-3 bg-gemRed text-white text-xs px-2 py-1 uppercase tracking-wider rounded">
                              Only {product.stock} Left
                            </span>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center py-2">
                          <p className="text-gemRed text-xs uppercase tracking-widest mb-2">{product.category}</p>
                          <h3 className="text-2xl font-serif text-gemText mb-3 group-hover:text-gemRed transition-colors">{product.name}</h3>
                          
                          <div className="flex items-center gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className={i < Math.round(product.rating) ? 'fill-gemGold text-gemGold' : 'text-gemBorder'} />
                            ))}
                            <span className="text-sm text-gemTextMuted ml-2">({product.numReviews} reviews)</span>
                          </div>

                          <p className="text-gemTextLight text-sm font-light line-clamp-2 mb-6">{product.description}</p>
                          
                          <div className="mt-auto flex items-center justify-between">
                            <p className="text-gemText font-medium text-xl font-serif">${product.price.toLocaleString()}</p>
                            <div className="flex items-center gap-3">
                                <button className="border border-gemBorder text-gemText p-3 rounded hover:border-gemRed hover:text-gemRed transition-colors">
                                  <Heart size={18} />
                                </button>
                                <button onClick={(e) => handleAddToCart(e, product)}
                                  className={`flex items-center gap-2 px-6 py-3 rounded text-sm uppercase tracking-widest font-semibold transition-all shadow-md ${
                                    addedId === product._id ? 'bg-green-600 text-white' : 'bg-gemRed text-white hover:bg-gemRedDark'
                                  }`}>
                                  {addedId === product._id ? 'Added' : 'Add to Cart'} <ShoppingBag size={16} />
                                </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  }

                  // Grid View Card
                  return (
                    <Link to={`/product/${product._id}`} key={product._id} className="group cursor-pointer block">
                      <div className="relative overflow-hidden bg-gemCard aspect-[4/5] mb-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-gemBorder">
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

                      <div className="text-center px-2">
                        <p className="text-gemRed text-xs uppercase tracking-widest mb-1">{product.category}</p>
                        <h3 className="text-lg font-serif text-gemText mb-1 group-hover:text-gemRed transition-colors truncate">{product.name}</h3>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < Math.round(product.rating) ? 'fill-gemGold text-gemGold' : 'text-gemBorder'} />
                          ))}
                          <span className="text-xs text-gemTextMuted ml-1">({product.numReviews})</span>
                        </div>
                        <p className="text-gemText font-medium font-serif">${product.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  );
                })}
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

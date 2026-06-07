import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ChevronDown, Filter, X, Check, Gem, Sparkles } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// Redux Actions & Thunks
import {
  fetchAllProducts,
  fetchFilteredProducts,
  toggleCategory,
  setCaratRange,
  setPriceRange,
  setSort,
  setPage,
  setKeyword,
  clearFilters,
  setShopType,
  GEM_TYPES,
  JEWELRY_TYPES
} from '../store/slices/productSlice';
import { setMobileFilterOpen } from '../store/slices/uiSlice';

// Custom styles for rc-slider to match dark luxury theme
const sliderStyles = {
  track: { backgroundColor: '#C41230', height: 4 }, // gemRed
  handle: {
    borderColor: '#C41230',
    backgroundColor: '#ffffff',
    opacity: 1,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: 16,
    height: 16,
    marginTop: -6,
  },
  rail: { backgroundColor: '#e5e5e5', height: 4 },
};



const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'priceAsc' },
  { label: 'Price: High to Low', value: 'priceDesc' },
];

function Shop() {
  const dispatch = useDispatch();
  const location = useLocation();

  // Selectors for productSlice
  const {
    products,
    allProducts,
    page,
    pages,
    totalCount,
    loading,
    maxPriceLimit,
    maxCaratLimit,
    caratRange,
    priceRange,
    selectedCategories,
    sort,
    keyword,
    shopType
  } = useSelector((state) => state.products);

  // Selectors for uiSlice
  const { isMobileFilterOpen } = useSelector((state) => state.ui);

  const [addedId, setAddedId] = useState(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const keywordFromUrl = new URLSearchParams(location.search).get('keyword') || '';

  // Synchronize URL search keyword with Redux store
  useEffect(() => {
    dispatch(setKeyword(keywordFromUrl));
  }, [keywordFromUrl, dispatch]);

  // Initial fetch for all products to get accurate category counts and max limits
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Fetch products automatically when filter/sort dependencies change
  useEffect(() => {
    dispatch(setPage(1));
    dispatch(fetchFilteredProducts(1));
  }, [selectedCategories, sort, caratRange, priceRange, keyword, shopType, dispatch]);

  const getCategoryCount = (cat) => {
    const cleanCat = cat.trim().toLowerCase().replace(/s$/, '');
    return allProducts.filter(p => {
      const cleanProdCat = p.category?.trim().toLowerCase().replace(/s$/, '');
      return cleanProdCat === cleanCat;
    }).length;
  };

  const handlePageChange = (pageNumber) => {
    dispatch(setPage(pageNumber));
    dispatch(fetchFilteredProducts(pageNumber));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleToggleCategory = (cat) => {
    dispatch(toggleCategory(cat));
  };

  const handleCaratRangeChange = (range) => {
    dispatch(setCaratRange(range));
  };

  const handlePriceRangeChange = (range) => {
    dispatch(setPriceRange(range));
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
        <h2 className="text-xl font-serif text-stone-900">Filters</h2>
        <button onClick={() => dispatch(setMobileFilterOpen(false))} className="text-stone-600">
          <X size={24} />
        </button>
      </div>

      {/* Carat Weight Slider */}
      {shopType === 'gems' && (
        <div className="border-b border-stone-200/80 pb-10">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-900 mb-6">
            Carat Weight
          </h3>

          <div className="flex justify-between items-center mb-6">
            <div className="border border-stone-200 px-4 py-2 w-20 text-center text-sm text-stone-800 font-serif bg-stone-50">{caratRange[0]}</div>
            <span className="text-stone-400">-</span>
            <div className="border border-stone-200 px-4 py-2 w-20 text-center text-sm text-stone-800 font-serif bg-stone-50">{caratRange[1]}</div>
          </div>

          <div className="px-2 mb-2">
            <Slider
              range
              min={0}
              max={maxCaratLimit}
              step={0.5}
              value={caratRange}
              onChange={handleCaratRangeChange}
              styles={sliderStyles}
            />
            <div className="flex justify-between mt-4 text-xs text-stone-700 font-serif font-bold">
              <span>0</span>
              <span>{Math.round(maxCaratLimit * 0.25)}</span>
              <span>{Math.round(maxCaratLimit * 0.5)}</span>
              <span>{Math.round(maxCaratLimit * 0.75)}</span>
              <span>{maxCaratLimit}</span>
            </div>
          </div>
        </div>
      )}

      {/* Gem/Jewelry Type */}
      <div className="border-b border-stone-200/80 pb-10">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-900 mb-6">
          {shopType === 'gems' ? 'Gem Type' : 'Jewelry Type'}
        </h3>
        <div className="space-y-4">
          {(shopType === 'gems' ? GEM_TYPES : JEWELRY_TYPES).map(cat => (
            <div key={cat} className="flex justify-between items-center cursor-pointer group" onClick={() => handleToggleCategory(cat)}>
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-gemRed border-gemRed' : 'border-stone-200 group-hover:border-gemRed'
                  }`}>
                  {selectedCategories.includes(cat) && <Check size={12} className="text-white" />}
                </div>
                <span className={`text-sm font-serif font-bold transition-colors ${selectedCategories.includes(cat) ? 'text-stone-800' : 'text-stone-600 group-hover:text-stone-800'}`}>
                  {cat}
                </span>
              </div>
              <span className="text-xs text-stone-400 font-serif font-bold">({getCategoryCount(cat)})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="pb-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-900 mb-6">
          Price ($)
        </h3>

        <div className="flex justify-between items-center mb-6">
          <div className="border border-stone-200 px-4 py-2 w-24 text-center text-sm text-stone-800 font-serif bg-stone-50">${priceRange[0].toLocaleString()}</div>
          <span className="text-stone-400">-</span>
          <div className="border border-stone-200 px-4 py-2 w-24 text-center text-sm text-stone-800 font-serif bg-stone-50">${priceRange[1].toLocaleString()}</div>
        </div>

        <div className="px-2 mb-2">
          <Slider
            range
            min={0}
            max={maxPriceLimit}
            step={500}
            value={priceRange}
            onChange={handlePriceRangeChange}
            styles={sliderStyles}
          />
          <div className="flex justify-between mt-4 text-xs text-stone-700 font-serif font-bold">
            <span>0</span>
            <span>{Math.round(maxPriceLimit * 0.25 / 1000)}k</span>
            <span>{Math.round(maxPriceLimit * 0.5 / 1000)}k</span>
            <span>{Math.round(maxPriceLimit * 0.75 / 1000)}k</span>
            <span>{Math.round(maxPriceLimit / 1000)}k</span>
          </div>
        </div>
      </div>

      <button onClick={handleClearFilters} className="w-full text-xs uppercase tracking-widest text-gemRed hover:underline py-2 text-center border-none bg-transparent cursor-pointer">
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-6">
          <span className="text-gemRed tracking-[0.3em] text-xs uppercase font-semibold">Our Collection</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mt-3 mb-4">
            {keyword ? `Search Results for "${keyword}"` : (shopType === 'gems' ? 'Gemstone Gallery' : 'Jewelry Gallery')}
          </h1>
          <div className="h-0.5 w-24 bg-gemRed mx-auto mb-6"></div>
        </div>

        {/* Gems / Jewelry Toggle Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-stone-100 p-1.5 rounded-full inline-flex border border-stone-200/60 shadow-inner">
            <button
              onClick={() => dispatch(setShopType('gems'))}
              className={`px-8 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                shopType === 'gems'
                  ? 'bg-gemRed text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/45'
              }`}
            >
              <Gem size={14} />
              Gemstones
            </button>
            <button
              onClick={() => dispatch(setShopType('jewelry'))}
              className={`px-8 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                shopType === 'jewelry'
                  ? 'bg-gemRed text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/45'
              }`}
            >
              <Sparkles size={14} />
              Jewelry
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Mobile Filter Button */}
          <div className="lg:hidden flex justify-between items-center border-b border-stone-200 pb-4">
            <button
              onClick={() => dispatch(setMobileFilterOpen(true))}
              className="flex items-center gap-2 text-stone-800 uppercase tracking-widest text-sm font-semibold border-none bg-transparent cursor-pointer"
            >
              <Filter size={18} /> Filters
            </button>
            <div className="flex items-center gap-4">
              <div className="text-sm font-serif font-bold text-stone-700">{totalCount} products</div>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-1/4 shrink-0 pr-6 border-r border-stone-200/80">
            <FilterSidebar />
          </div>

          {/* Mobile Sidebar Overlay */}
          <div className={`fixed inset-0 z-50 bg-black/80 transition-opacity duration-300 lg:hidden ${isMobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className={`fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white border-r border-stone-200 p-6 overflow-y-auto transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <FilterSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 pl-0 lg:pl-4">

            {/* Topbar: Sort & Count (Desktop) */}
            <div className="hidden lg:flex justify-between items-center mb-8 border-b border-stone-200/80 pb-6">

              <div className="text-sm font-serif font-bold text-stone-700">{totalCount} products</div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-stone-800 uppercase tracking-widest font-semibold">Sort By:</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => dispatch(setSort(e.target.value))}
                    className="appearance-none bg-transparent border-none text-stone-600 hover:text-stone-800 text-sm font-serif font-bold pr-6 focus:outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.label} value={opt.value} className="bg-white text-stone-800 font-sans">{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Mobile Sort */}
            <div className="lg:hidden flex justify-between items-center mb-6">
              <span className="text-sm text-stone-800 uppercase tracking-widest font-semibold">Sort By:</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => dispatch(setSort(e.target.value))}
                  className="appearance-none bg-transparent border-none text-stone-600 text-sm font-serif font-bold pr-6 focus:outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.label} value={opt.value} className="bg-white text-stone-800 font-sans">{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
              </div>
            </div>

            {/* Loading Skeletons */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-stone-200/60 rounded-lg aspect-[4/5] mb-4"></div>
                    <div>
                      <div className="h-3 bg-stone-200/60 mx-auto mb-2 rounded w-1/3"></div>
                      <div className="h-4 bg-stone-200/60 mx-auto mb-2 rounded w-2/3"></div>
                      <div className="h-3 bg-stone-200/60 mx-auto rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Product Grid */}
            {!loading && (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {products.map(product => {
                  const isJewelry = ['ring', 'necklace', 'earring', 'bracelet'].includes(product.category?.toLowerCase().replace(/s$/, '')) || product.carat === 0;
                  return (
                    <Link to={`/product/${product._id}`} key={product._id} className="group cursor-pointer block text-stone-800 no-underline">
                      <div className={`relative overflow-hidden bg-stone-50 border border-stone-200/50 hover:border-gemRed/40 shadow-sm hover:shadow-md transition-all duration-300 aspect-[4/5] mb-4 rounded-lg flex items-center justify-center ${isJewelry ? 'p-0' : 'p-6'}`}>
                        <img src={product.imageUrl} alt={product.name}
                          className={`${isJewelry ? 'w-full h-full object-cover' : 'max-w-[75%] max-h-[75%] object-contain'} object-center transition-transform duration-700 group-hover:scale-110 drop-shadow-xl`} />

                        {product.stock <= 3 && product.stock > 0 && (
                          <span className="absolute top-4 left-4 bg-gemRed text-white text-xs px-3 py-1 uppercase tracking-wider rounded">
                            Only {product.stock} Left
                          </span>
                        )}

                        <div className="absolute inset-0 bg-black/5 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button onClick={(e) => handleAddToCart(e, product)}
                            className={`p-3 rounded-full transition-colors shadow-md border-none cursor-pointer ${addedId === product._id ? 'bg-green-500 text-white' : 'bg-white text-stone-800 hover:bg-gemRed hover:text-white'
                              }`}>
                            <ShoppingCart size={20} />
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
                            className={`p-3 rounded-full transition-colors shadow-md border-none cursor-pointer ${isInWishlist(product._id) ? 'bg-gemRed text-white' : 'bg-white text-stone-800 hover:bg-gemRed hover:text-white'}`}>
                            <Heart size={20} className={isInWishlist(product._id) ? 'fill-white' : ''} />
                          </button>
                        </div>
                      </div>

                      <div className="text-center px-2">
                        <p className="text-gemRed text-xs uppercase tracking-widest mb-1 font-semibold">{product.category}</p>
                        <h3 className="text-lg font-serif text-stone-800 mb-1 group-hover:text-gemRed transition-colors truncate">{product.name}</h3>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < Math.round(product.rating) ? 'fill-gemGold text-gemGold' : 'text-stone-200'} />
                          ))}
                          <span className="text-xs text-stone-400 ml-1">({product.numReviews})</span>
                        </div>
                        <p className="text-stone-900 font-medium font-serif">${product.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && pages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                {[...Array(pages).keys()].map(x => (
                  <button
                    key={x + 1}
                    onClick={() => handlePageChange(x + 1)}
                    className={`w-10 h-10 flex items-center justify-center font-serif text-lg transition-colors border cursor-pointer ${x + 1 === page
                      ? 'border-gemRed bg-gemRed text-white'
                      : 'border-stone-200 text-stone-600 hover:border-gemRed hover:text-gemRed bg-white'
                      }`}
                  >
                    {x + 1}
                  </button>
                ))}
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-20 bg-stone-50 rounded-lg border border-stone-200/60">
                <p className="text-stone-600 text-lg mb-4">
                  {shopType === 'gems' ? 'No gemstones match your filters.' : 'No jewelry items match your filters.'}
                </p>
                <button onClick={handleClearFilters} className="text-gemRed hover:underline uppercase tracking-widest text-sm font-semibold border-none bg-transparent cursor-pointer">
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

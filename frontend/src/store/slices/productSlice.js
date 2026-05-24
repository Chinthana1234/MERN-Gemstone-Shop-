import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/products?fetchAll=true');
      return data.products || [];
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const fetchFilteredProducts = createAsyncThunk(
  'products/fetchFiltered',
  async (pageNumber = 1, { getState, rejectWithValue }) => {
    try {
      const { products: productState } = getState();
      const { selectedCategories, caratRange, priceRange, sort, keyword } = productState;

      const queryParams = new URLSearchParams();
      if (selectedCategories.length > 0) {
        queryParams.append('category', selectedCategories.join(','));
      }
      queryParams.append('minCarat', caratRange[0]);
      queryParams.append('maxCarat', caratRange[1]);
      queryParams.append('minPrice', priceRange[0]);
      queryParams.append('maxPrice', priceRange[1]);
      queryParams.append('pageNumber', pageNumber);
      if (sort) queryParams.append('sort', sort);
      if (keyword) queryParams.append('keyword', keyword);

      const queryString = queryParams.toString();
      const { data } = await API.get(`/products${queryString ? `?${queryString}` : ''}`);
      return {
        products: data.products || [],
        pages: data.pages || 1,
        count: data.count || 0,
        page: pageNumber
      };
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const initialState = {
  products: [],
  allProducts: [],
  page: 1,
  pages: 1,
  totalCount: 0,
  loading: false,
  error: null,
  
  // Filter Limits
  maxPriceLimit: 50000,
  maxCaratLimit: 15,

  // Selected Filters
  caratRange: [0, 15],
  priceRange: [0, 50000],
  selectedCategories: [],
  sort: '',
  keyword: '',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },
    toggleCategory: (state, action) => {
      const category = action.payload;
      if (state.selectedCategories.includes(category)) {
        state.selectedCategories = state.selectedCategories.filter(c => c !== category);
      } else {
        state.selectedCategories.push(category);
      }
    },
    setCaratRange: (state, action) => {
      state.caratRange = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    clearFilters: (state) => {
      state.selectedCategories = [];
      state.caratRange = [0, state.maxCaratLimit];
      state.priceRange = [0, state.maxPriceLimit];
      state.sort = '';
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allProducts = action.payload;
        if (action.payload.length > 0) {
          const prices = action.payload.map(p => p.price);
          const carats = action.payload.map(p => p.carat);
          const maxP = Math.max(...prices, 50000);
          const maxC = Math.max(...carats, 15);
          state.maxPriceLimit = maxP;
          state.maxCaratLimit = maxC;
          
          // Only adjust ranges if they are at default bounds
          if (state.priceRange[1] === 50000) {
            state.priceRange = [0, maxP];
          }
          if (state.caratRange[1] === 15) {
            state.caratRange = [0, maxC];
          }
        }
      })
      // Fetch Filtered/Paginated
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pages = action.payload.pages;
        state.totalCount = action.payload.count;
        state.page = action.payload.page;
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedCategories,
  toggleCategory,
  setCaratRange,
  setPriceRange,
  setSort,
  setPage,
  setKeyword,
  clearFilters,
} = productSlice.actions;

export default productSlice.reducer;

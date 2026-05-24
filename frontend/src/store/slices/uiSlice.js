import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMobileFilterOpen: false,
  viewMode: 'grid',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMobileFilterOpen: (state, action) => {
      state.isMobileFilterOpen = action.payload;
    },
    toggleMobileFilter: (state) => {
      state.isMobileFilterOpen = !state.isMobileFilterOpen;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
  },
});

export const { setMobileFilterOpen, toggleMobileFilter, setViewMode } = uiSlice.actions;
export default uiSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  restaurants: [],
  selectedRestaurant: null,
  loading: false,
  error: null,
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setRestaurants: (state, action) => {
      state.restaurants = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedRestaurant: (state, action) => {
      state.selectedRestaurant = action.payload;
    },
    addRestaurant: (state, action) => {
      state.restaurants.unshift(action.payload);
    },
    updateRestaurant: (state, action) => {
      const index = state.restaurants.findIndex(
        (restaurant) => restaurant.id === action.payload.id
      );
      if (index !== -1) {
        state.restaurants[index] = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setRestaurants,
  setSelectedRestaurant,
  addRestaurant,
  updateRestaurant
} = restaurantSlice.actions;
export default restaurantSlice.reducer;

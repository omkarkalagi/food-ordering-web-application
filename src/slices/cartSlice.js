import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  restaurantId: null,
  totalItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { restaurantId, item } = action.payload;

      // If adding from different restaurant, clear cart first
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      }

      const existingItem = state.items.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }

      state.restaurantId = restaurantId;
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    removeItem: (state, action) => {
      const { itemId } = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);

      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);

      if (state.items.length === 0) {
        state.restaurantId = null;
      }
    },
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== itemId);
      } else {
        const item = state.items.find((item) => item.id === itemId);
        if (item) {
          item.quantity = quantity;
        }
      }

      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);

      if (state.items.length === 0) {
        state.restaurantId = null;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

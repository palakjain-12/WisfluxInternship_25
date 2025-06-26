import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Initial state
const initialState = {
  items: [],
  total: 0,
  itemCount: 0
};

// Action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Helper function to calculate totals
const calculateTotals = (items) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

// Reducer function
const cartReducer = (state, action) => {
  let newItems;
  let totals;

  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // If item exists, increase quantity
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If new item, add to cart
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        total: totals.total,
        itemCount: totals.itemCount
      };
    }

    case CART_ACTIONS.REMOVE_ITEM:
      newItems = state.items.filter(item => item.id !== action.payload);
      totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        total: totals.total,
        itemCount: totals.itemCount
      };

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        newItems = state.items.filter(item => item.id !== id);
      } else {
        newItems = state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );
      }
      
      totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        total: totals.total,
        itemCount: totals.itemCount
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0
      };

    case CART_ACTIONS.LOAD_CART:
      newItems = action.payload;
      totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        total: totals.total,
        itemCount: totals.itemCount
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useLocalStorage('cart', []);
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount only
  useEffect(() => {
    if (cartData.length > 0 || state.items.length === 0) {
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
    }
  }, []); // Remove cartData dependency to prevent loops

  // Save cart to localStorage when items change
  useEffect(() => {
    // Only update localStorage if items have actually changed
    const currentItemsString = JSON.stringify(state.items);
    const storedItemsString = JSON.stringify(cartData);
    
    if (currentItemsString !== storedItemsString) {
      setCartData(state.items);
    }
  }, [state.items]); // Remove setCartData dependency

  // Action creators
  const addToCart = (product) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { id: productId, quantity } 
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
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

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // If item exists, increase quantity
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems
        };
      } else {
        // If new item, add to cart
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        };
      }
    }

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id)
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      };

    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload
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

  // Load cart from localStorage on mount
  useEffect(() => {
    dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
  }, [cartData]);

  // Save cart to localStorage when state changes
  useEffect(() => {
    setCartData(state.items);
  }, [state.items, setCartData]);

  // Calculate totals when items change
  useEffect(() => {
    const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update state with calculated values
    if (state.total !== total || state.itemCount !== itemCount) {
      dispatch({
        type: 'UPDATE_TOTALS',
        payload: { total, itemCount }
      });
    }
  }, [state.items, state.total, state.itemCount]);

  // Add UPDATE_TOTALS to reducer
  const enhancedCartReducer = (state, action) => {
    if (action.type === 'UPDATE_TOTALS') {
      return {
        ...state,
        total: action.payload.total,
        itemCount: action.payload.itemCount
      };
    }
    return cartReducer(state, action);
  };

  // Replace the reducer call
  const [enhancedState, enhancedDispatch] = useReducer(enhancedCartReducer, {
    ...initialState,
    items: state.items,
    total: state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0)
  });

  // Action creators
  const addToCart = (product) => {
    enhancedDispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });
  };

  const removeFromCart = (productId) => {
    enhancedDispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    enhancedDispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { id: productId, quantity } 
    });
  };

  const clearCart = () => {
    enhancedDispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const isInCart = (productId) => {
    return enhancedState.items.some(item => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = enhancedState.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    ...enhancedState,
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
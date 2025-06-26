import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null
};

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    image: '/images/headphones.jpg', // Add your image path here
    emoji: '🎧', // Keep emoji as fallback
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.'
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 299.99,
    image: '/images/smartwatch.jpg', // Add your image path here
    emoji: '⌚',
    description: 'Advanced smartwatch with health monitoring, GPS, and long battery life.'
  },
  {
    id: 3,
    name: 'Laptop',
    price: 899.99,
    image: '/images/laptop.jpg', // Add your image path here
    emoji: '💻',
    description: 'Powerful laptop perfect for work and gaming with fast processor and graphics.'
  },
  {
    id: 4,
    name: 'Smartphone',
    price: 699.99,
    image: '/images/smartphone.jpg', // Add your image path here
    emoji: '📱',
    description: 'Latest smartphone with advanced camera system and lightning-fast performance.'
  },
  {
    id: 5,
    name: 'Tablet',
    price: 449.99,
    image: '/images/tablet.jpg', // Add your image path here
    emoji: '📲',
    description: 'Versatile tablet perfect for productivity, entertainment, and creative work.'
  },
  {
    id: 6,
    name: 'Gaming Console',
    price: 499.99,
    image: '/images/gaming-console.jpg', // Add your image path here
    emoji: '🎮',
    description: 'Next-generation gaming console with stunning graphics and exclusive games.'
  }
];

// Action types
const PRODUCT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_ERROR: 'SET_ERROR',
  SET_SELECTED_PRODUCT: 'SET_SELECTED_PRODUCT'
};

// Reducer function
const productReducer = (state, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case PRODUCT_ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null
      };
    case PRODUCT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case PRODUCT_ACTIONS.SET_SELECTED_PRODUCT:
      return {
        ...state,
        selectedProduct: action.payload
      };
    default:
      return state;
  }
};

// Create context
const ProductContext = createContext();

// Provider component
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Simulate API call to fetch products
  const fetchProducts = async () => {
    dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch({ type: PRODUCT_ACTIONS.SET_PRODUCTS, payload: mockProducts });
    } catch (error) {
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Get product by ID
  const getProductById = (id) => {
    return state.products.find(product => product.id === parseInt(id));
  };

  // Set selected product
  const setSelectedProduct = (product) => {
    dispatch({ type: PRODUCT_ACTIONS.SET_SELECTED_PRODUCT, payload: product });
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    ...state,
    fetchProducts,
    getProductById,
    setSelectedProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use product context
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
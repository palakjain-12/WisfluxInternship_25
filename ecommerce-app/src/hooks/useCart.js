import { useCartContext } from '../context/CartContext';

// Custom hook for cart operations with additional logic
export const useCart = () => {
  const cartContext = useCartContext();

  // Enhanced add to cart with feedback
  const addToCartWithFeedback = (product) => {
    cartContext.addToCart(product);
    
    // You could add toast notifications here
    console.log(`${product.name} added to cart!`);
  };

  // Calculate cart summary
  const getCartSummary = () => {
    const { items, total, itemCount } = cartContext;
    
    return {
      items,
      total: total.toFixed(2),
      itemCount,
      isEmpty: itemCount === 0,
      subtotal: total.toFixed(2),
      tax: (total * 0.08).toFixed(2), // 8% tax
      finalTotal: (total * 1.08).toFixed(2)
    };
  };

  // Check if cart has items
  const hasItems = () => {
    return cartContext.itemCount > 0;
  };

  // Get cart total formatted
  const getFormattedTotal = () => {
    return `$${cartContext.total.toFixed(2)}`;
  };

  // Increment item quantity
  const incrementQuantity = (productId) => {
    const currentQuantity = cartContext.getItemQuantity(productId);
    cartContext.updateQuantity(productId, currentQuantity + 1);
  };

  // Decrement item quantity
  const decrementQuantity = (productId) => {
    const currentQuantity = cartContext.getItemQuantity(productId);
    if (currentQuantity > 1) {
      cartContext.updateQuantity(productId, currentQuantity - 1);
    } else {
      cartContext.removeFromCart(productId);
    }
  };

  return {
    ...cartContext,
    addToCartWithFeedback,
    getCartSummary,
    hasItems,
    getFormattedTotal,
    incrementQuantity,
    decrementQuantity
  };
};
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { getCartSummary, clearCart } = useCart();
  const cartSummary = getCartSummary();

  if (cartSummary.isEmpty) {
    return (
      <div className="cart-container">
        <h1 className="page-title">Shopping Cart</h1>
        
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link to="/products" className="btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 className="page-title" style={{ margin: 0 }}>
          Shopping Cart ({cartSummary.itemCount} items)
        </h1>
        
        <button 
          onClick={clearCart}
          className="btn btn-danger"
          style={{ width: 'auto' }}
        >
          Clear Cart
        </button>
      </div>
      
      {/* Cart Items */}
      <div>
        {cartSummary.items.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      
      {/* Cart Total */}
      <div className="cart-total">
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}>
            <span>Subtotal:</span>
            <span>Rs.{cartSummary.subtotal}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}>
            <span>Tax (8%):</span>
            <span>Rs.{cartSummary.tax}</span>
          </div>
          
          <hr style={{ margin: '1rem 0' }} />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            <span>Total:</span>
            <span>Rs.{cartSummary.finalTotal}</span>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <Link to="/products" className="btn" style={{ width: 'auto' }}>
            Continue Shopping
          </Link>
          
          <button 
            className="btn btn-success" 
            style={{ width: 'auto' }}
            onClick={() => alert('Checkout functionality would go here!')}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
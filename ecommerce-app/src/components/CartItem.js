import React from 'react';
import { useCart } from '../hooks/useCart';

const CartItem = ({ item }) => {
  const { incrementQuantity, decrementQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <div className="cart-item-image">
          {item.image}
        </div>
        
        <div className="cart-item-details">
          <h3>{item.name}</h3>
          <p>${item.price}</p>
        </div>
      </div>
      
      <div className="cart-item-controls">
        <div className="quantity-controls">
          <button 
            onClick={() => decrementQuantity(item.id)}
            className="quantity-btn"
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button 
            onClick={() => incrementQuantity(item.id)}
            className="quantity-btn"
          >
            +
          </button>
        </div>
        
        <div className="item-total">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
        
        <button 
          onClick={() => removeFromCart(item.id)}
          className="btn btn-danger"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';

const CartItem = ({ item }) => {
  const { incrementQuantity, decrementQuantity, removeFromCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <div className="cart-item-image">
          {!imageError && item.image ? (
            <img 
              src={item.image} 
              alt={item.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
              onError={handleImageError}
            />
          ) : (
            <span style={{ fontSize: '2rem' }}>
              {item.emoji || '📦'}
            </span>
          )}
        </div>
        
        <div className="cart-item-details">
          <h3>{item.name}</h3>
          <p>Rs.{item.price}</p>
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
          Rs.{(item.price * item.quantity).toFixed(2)}
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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const ProductCard = ({ product }) => {
  const { addToCartWithFeedback, isInCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartWithFeedback(product);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image">
        {!imageError && product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '4px'
            }}
            onError={handleImageError}
          />
        ) : (
          <span style={{ fontSize: '3rem' }}>
            {product.emoji || '📦'}
          </span>
        )}
      </div>
      
      <h3 className="product-title">{product.name}</h3>
      
      <div className="product-price">
        ${product.price}
      </div>
      
      <button 
        onClick={handleAddToCart}
        className={`btn ${isInCart(product.id) ? 'btn-success' : ''}`}
      >
        {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
      </button>
    </Link>
  );
};

export default ProductCard;
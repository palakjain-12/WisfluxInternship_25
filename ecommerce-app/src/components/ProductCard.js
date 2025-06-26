import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const ProductCard = ({ product }) => {
  const { addToCartWithFeedback, isInCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartWithFeedback(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image">
        {product.image}
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
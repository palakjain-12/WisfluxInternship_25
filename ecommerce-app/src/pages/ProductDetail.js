import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductContext } from '../context/ProductContext';
import { useCart } from '../hooks/useCart';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, loading } = useProductContext();
  const { addToCartWithFeedback, isInCart, getItemQuantity } = useCart();
  const [imageError, setImageError] = useState(false);
  
  const product = getProductById(id);

  useEffect(() => {
    if (!loading && !product) {
      navigate('/products');
    }
  }, [product, loading, navigate]);

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Loading product...</h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Product not found</h2>
          <button onClick={() => navigate('/products')} className="btn">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCartWithFeedback(product);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const quantity = getItemQuantity(product.id);

  return (
    <div>
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: '#3498db', 
          cursor: 'pointer',
          fontSize: '1rem',
          marginBottom: '2rem'
        }}
      >
        ← Back
      </button>
      
      <div className="product-detail">
        <div className="product-detail-image">
          {!imageError && product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
              onError={handleImageError}
            />
          ) : (
            <span style={{ fontSize: '6rem' }}>
              {product.emoji || '📦'}
            </span>
          )}
        </div>
        
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          
          <div className="product-detail-price">
            ${product.price}
          </div>
          
          <p className="product-description">
            {product.description}
          </p>
          
          {quantity > 0 && (
            <div style={{ 
              background: '#d4edda', 
              padding: '1rem', 
              borderRadius: '4px',
              marginBottom: '1rem',
              color: '#155724'
            }}>
              You have {quantity} of this item in your cart
            </div>
          )}
          
          <button 
            onClick={handleAddToCart}
            className={`btn ${isInCart(product.id) ? 'btn-success' : ''}`}
            style={{ width: 'auto', padding: '1rem 2rem' }}
          >
            {isInCart(product.id) ? 'Add Another to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
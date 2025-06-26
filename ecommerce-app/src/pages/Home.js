import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const { getFeaturedProducts, loading } = useProducts();
  const featuredProducts = getFeaturedProducts();

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        padding: '4rem 0', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        margin: '0 -20px 2rem -20px'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Welcome to ShopEasy
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Discover amazing products at great prices
        </p>
        <Link to="/products" className="btn" style={{ 
          background: 'white', 
          color: '#667eea',
          padding: '1rem 2rem',
          fontSize: '1.1rem'
        }}>
          Shop Now
        </Link>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="page-title">Featured Products</h2>
        
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/products" className="btn">
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
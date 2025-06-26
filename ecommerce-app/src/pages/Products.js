import React from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const { 
    filteredProducts, 
    loading, 
    searchTerm, 
    sortBy, 
    filterBy,
    searchProducts, 
    sortProducts, 
    filterProducts 
  } = useProducts();

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Loading products...</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">All Products</h1>
      
      {/* Search and Filter Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => searchProducts(e.target.value)}
          style={{
            padding: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            minWidth: '200px'
          }}
        />
        
        <select
          value={sortBy}
          onChange={(e) => sortProducts(e.target.value)}
          style={{
            padding: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="name">Sort by Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
        
        <select
          value={filterBy}
          onChange={(e) => filterProducts(e.target.value)}
          style={{
            padding: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      {/* Results Info */}
      <div style={{ marginBottom: '1rem', color: '#666' }}>
        Showing {filteredProducts.length} products
        {searchTerm && ` for "${searchTerm}"`}
      </div>
      
      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#666' }}>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Products;
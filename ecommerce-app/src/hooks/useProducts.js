import { useState, useMemo } from 'react';
import { useProductContext } from '../context/ProductContext';

// Custom hook for product operations with search and filter
export const useProducts = () => {
  const productContext = useProductContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, price-low, price-high
  const [filterBy, setFilterBy] = useState('all'); // all, electronics, accessories

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = productContext.products;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter (simplified)
    if (filterBy !== 'all') {
      // This is a simplified filter - in a real app you'd have categories
      filtered = filtered.filter(product => {
        if (filterBy === 'electronics') {
          return ['Laptop', 'Smartphone', 'Tablet', 'Gaming Console'].includes(product.name);
        }
        if (filterBy === 'accessories') {
          return ['Wireless Headphones', 'Smart Watch'].includes(product.name);
        }
        return true;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'name':
      default:
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [productContext.products, searchTerm, sortBy, filterBy]);

  // Get product statistics
  const getProductStats = () => {
    const products = productContext.products;
    if (products.length === 0) return null;

    const prices = products.map(p => p.price);
    return {
      total: products.length,
      averagePrice: (prices.reduce((sum, price) => sum + price, 0) / prices.length).toFixed(2),
      minPrice: Math.min(...prices).toFixed(2),
      maxPrice: Math.max(...prices).toFixed(2)
    };
  };

  // Get featured products (highest priced ones)
  const getFeaturedProducts = (count = 3) => {
    return [...productContext.products]
      .sort((a, b) => b.price - a.price)
      .slice(0, count);
  };

  // Search products
  const searchProducts = (term) => {
    setSearchTerm(term);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Sort products
  const sortProducts = (sortOption) => {
    setSortBy(sortOption);
  };

  // Filter products
  const filterProducts = (filterOption) => {
    setFilterBy(filterOption);
  };

  return {
    ...productContext,
    filteredProducts,
    searchTerm,
    sortBy,
    filterBy,
    searchProducts,
    clearSearch,
    sortProducts,
    filterProducts,
    getProductStats,
    getFeaturedProducts
  };
};
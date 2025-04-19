// src/pages/ProductsPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import './ProductsPage.css';

export default function ProductsPage() {
  const [products,   setProducts]   = useState([]);
  const [search,     setSearch]     = useState('');
  const [categories, setCategories] = useState([]);
  const [brands,     setBrands]     = useState([]);
  const [selCat,     setSelCat]     = useState('');
  const [selBrand,   setSelBrand]   = useState('');
  const [sortOrder,  setSortOrder]  = useState(''); // '' | 'priceAsc' | 'priceDesc'

  useEffect(() => {
    API.get('/products').then(r => setProducts(r.data));
    API.get('/admin/categories').then(r => setCategories(r.data));
    API.get('/admin/brands').then(r => setBrands(r.data));
  }, []);

  // apply filters
  const filtered = products
    .filter(p => selCat   === '' || p.category?.id === +selCat)
    .filter(p => selBrand === '' || p.brand?.id    === +selBrand)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  // then sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'priceAsc')  return a.price - b.price;
    if (sortOrder === 'priceDesc') return b.price - a.price;
    return 0;
  });

  return (
    <>
      <h2>All Products</h2>

      <div className="products-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select value={selCat} onChange={e => setSelCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select value={selBrand} onChange={e => setSelBrand(e.target.value)}>
          <option value="">All Brands</option>
          {brands.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="">Sort By Price</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
      </div>

      <ul className="product-list">
        {sorted.map(p => (
          <li key={p.id} className="product-item">
            {p.imageUrls?.[0] && (
              <img
                src={p.imageUrls[0]}
                alt={p.name}
                className="product-thumb"
              />
            )}
            <div className="product-info">
              <Link to={`/products/${p.id}`} className="product-name">
                {p.name}
              </Link>
              <span className="product-price">
                ${p.price.toFixed(2)}
              </span>
            </div>
          </li>
        ))}
        {sorted.length === 0 && (
          <li className="no-results">No products match your filters.</li>
        )}
      </ul>
    </>
  );
}

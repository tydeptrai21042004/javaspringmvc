// src/pages/admin/AdminProductPage.js
import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import './AdminProductPage.css';

export default function AdminProductPage() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    brandId: ''
  });
  const [images,      setImages]      = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [brands,      setBrands]      = useState([]);
  const [message,     setMessage]     = useState('');

  useEffect(() => {
    API.get('/admin/categories').then(r => setCategories(r.data));
    API.get('/admin/brands').then(r => setBrands(r.data));
  }, []);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onFileChange = e => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
  };

  const onSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const data = new FormData();
      data.append('name',        form.name);
      data.append('price',       form.price);
      data.append('description', form.description);
      data.append('categoryId',  form.categoryId);
      data.append('brandId',     form.brandId);
      images.forEach(file => data.append('images', file));

      await API.post('/admin/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Product added successfully!');
      setForm({ name:'', price:'', description:'', categoryId:'', brandId:'' });
      setImages([]);
      document.getElementById('product-images').value = '';
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add product.');
    }
  };

  return (
    <div className="admin-product-page">
      <h2>Add New Product</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={onSubmit} className="admin-product-form">
        <label>
          Name
          <input name="name" value={form.name} onChange={onChange} required />
        </label>

        <label>
          Price
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Category
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={onChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label>
          Brand
          <select
            name="brandId"
            value={form.brandId}
            onChange={onChange}
            required
          >
            <option value="">Select brand</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Images (up to 5)
          <input
            id="product-images"
            type="file"
            accept="image/*"
            multiple
            onChange={onFileChange}
          />
        </label>

        {images.length > 0 && (
          <div className="image-previews">
            {images.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                alt={`preview-${i}`}
                className="preview-img"
              />
            ))}
          </div>
        )}

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

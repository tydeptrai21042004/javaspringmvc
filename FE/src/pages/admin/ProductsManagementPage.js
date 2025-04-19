// src/pages/admin/ProductsManagementPage.js
import React, { useEffect, useState } from 'react'
import API, { getCategories, getBrands } from '../../services/api'
import './ProductsManagementPage.css'

export default function ProductsManagementPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [form, setForm] = useState({
    name: '',
    price: 0,
    description: '',
    categoryId: '',
    brandId: ''
  })

  // Load products, categories & brands on mount
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [pRes, cRes, bRes] = await Promise.all([
          API.get('/admin/products'),
          getCategories(),
          getBrands()
        ])
        setProducts(pRes.data)
        setCategories(cRes.data)
        setBrands(bRes.data)
      } catch (err) {
        console.error('Failed to load data', err)
      }
    }
    loadAll()
  }, [])

  const add = async e => {
    e.preventDefault()
    try {
      await API.post('/admin/products', {
        name: form.name,
        price: form.price,
        description: form.description,
        categoryId: form.categoryId,
        brandId: form.brandId
      })
      // clear form
      setForm({ name: '', price: 0, description: '', categoryId: '', brandId: '' })
      // reload products
      const r = await API.get('/admin/products')
      setProducts(r.data)
    } catch (err) {
      console.error('Add failed', err)
    }
  }

  return (
    <div className="products-management-page">
      <h2>Manage Products</h2>

      <form onSubmit={add} className="products-management-form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: +e.target.value })}
          required
        />

        <select
          value={form.categoryId}
          onChange={e => setForm({ ...form, categoryId: e.target.value })}
          required
        >
          <option value="" disabled>— Select Category —</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={form.brandId}
          onChange={e => setForm({ ...form, brandId: e.target.value })}
          required
        >
          <option value="" disabled>— Select Brand —</option>
          {brands.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <input
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <button type="submit">Add Product</button>
      </form>

      <ul className="products-list">
        {products.map(p => (
          <li key={p.id}>
            {p.name} – ${p.price.toFixed(2)}<br/>
            <small>
              Category: {p.category.name} | Brand: {p.brand.name}
            </small>
          </li>
        ))}
      </ul>
    </div>
  )
}

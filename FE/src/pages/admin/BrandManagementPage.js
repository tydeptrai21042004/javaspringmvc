// src/pages/admin/BrandManagementPage.js
import React, { useEffect, useState } from 'react';
import {
  getBrands,
  addBrand,
  deleteBrand
} from '../../services/api';
import './BrandManagementPage.css';

export default function BrandManagementPage() {
  const [brands, setBrands] = useState([]);
  const [name, setName]     = useState('');

  // Load brands on mount
  useEffect(() => {
    getBrands()
      .then(r => setBrands(r.data))
      .catch(console.error);
  }, []);

  const create = async e => {
    e.preventDefault();
    await addBrand({ name });
    setName('');
    // reload
    getBrands()
      .then(r => setBrands(r.data))
      .catch(console.error);
  };

  const remove = id => {
    deleteBrand(id)
      .then(() => getBrands().then(r => setBrands(r.data)))
      .catch(console.error);
  };

  return (
    <div className="brand-management">
      <h2>Quản Lý Nhãn Hàng</h2>
      <form onSubmit={create}>
        <input
          placeholder="Tên nhãn hàng"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button type="submit">Thêm</button>
      </form>
      <ul>
        {brands.map(b => (
          <li key={b.id}>
            {b.name}
            <button onClick={() => remove(b.id)}>
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// src/pages/admin/CategoryManagementPage.js
import React, { useEffect, useState } from 'react';
import {
  getCategories,
  addCategory,
  deleteCategory
} from '../../services/api';
import './CategoryManagementPage.css';

export default function CategoryManagementPage() {
  const [cats, setCats] = useState([]);
  const [name, setName] = useState('');

  // Load categories on mount
  useEffect(() => {
    getCategories()
      .then(r => setCats(r.data))
      .catch(console.error);
  }, []);

  const create = async e => {
    e.preventDefault();
    await addCategory({ name });
    setName('');
    // reload
    getCategories()
      .then(r => setCats(r.data))
      .catch(console.error);
  };

  const remove = id => {
    deleteCategory(id)
      .then(() => getCategories().then(r => setCats(r.data)))
      .catch(console.error);
  };

  return (
    <div className="category-management">
      <h2>Quản Lý Danh Mục</h2>
      <form onSubmit={create}>
        <input
          placeholder="Tên danh mục"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button type="submit">Thêm</button>
      </form>
      <ul>
        {cats.map(c => (
          <li key={c.id}>
            {c.name}
            <button onClick={() => remove(c.id)}>
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

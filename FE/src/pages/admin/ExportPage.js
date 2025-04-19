import React, { useEffect, useState } from 'react';
import { exportExcel } from '../../components/ExcelUtils';
import API from '../../services/api';
import './ExportPage.css';

export default function ExportPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    API.get('/admin/products').then(r => setProducts(r.data));
  }, []);
  return (
    <>
      <h2>Export Products to Excel</h2>
      <button onClick={() => exportExcel(products, 'products.xlsx')}>
        Download Excel
      </button>
    </>
  );
}

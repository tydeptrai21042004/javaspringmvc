import React from 'react';
import { importExcel } from '../../components/ExcelUtils';
import API from '../../services/api';
import './ImportPage.css';

export default function ImportPage() {
  const handleFile = file => {
    importExcel(file, data => {
      API.post('/admin/products/bulk', data).then(() => alert('Imported!'));
    });
  };

  return (
    <>
      <h2>Import Products from Excel</h2>
      <input type="file" accept=".xlsx, .xls" onChange={e => handleFile(e.target.files[0])}/>
    </>
  );
}

// src/pages/admin/RoutesPage.js
import React, { useEffect, useState } from 'react';
import { getAdminRoutes } from '../../services/api';
import './RoutesPage.css'; // optional, for styling your table

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    getAdminRoutes()
      .then(r => setRoutes(r.data))
      .catch(console.error);
  }, []);

  return (
    <div className="routes-page">
      <h2>Backend Routes</h2>
      <table className="routes-table">
        <thead>
          <tr>
            <th>Path(s)</th>
            <th>Method(s)</th>
            <th>Controller</th>
            <th>Handler</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((rt, i) => (
            <tr key={i}>
              <td>{Array.from(rt.patterns).join(', ')}</td>
              <td>{Array.from(rt.methods).join(', ')}</td>
              <td>{rt.bean}</td>
              <td>{rt.handler}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

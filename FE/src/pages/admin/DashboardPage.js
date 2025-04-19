// src/pages/admin/DashboardPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, CartesianGrid,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import * as XLSX from 'xlsx';
import { getAdminStats, getAdminUsers, banAdminUser } from '../../services/api';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers:    0,
    totalSales:    0,
    totalProducts: 0,
    newUsers:      [],
    newPayments:   []
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // 1) fetch stats
    getAdminStats()
      .then(r => setStats(r.data))
      .catch(err => {
        if (err.response?.status === 403) navigate('/login');
        else console.error(err);
      });

    // 2) fetch users
    getAdminUsers()
      .then(r => setUsers(r.data))
      .catch(err => {
        if (err.response?.status === 403) navigate('/login');
        else console.error(err);
      });
  }, [navigate]);

  // merge the two series into one array for the chart
  const chartData = stats.newUsers.map(u => {
    const match = stats.newPayments.find(p => p.date === u.date);
    return {
      date:        u.date,
      newUsers:    u.count,
      newPayments: match ? match.count : 0
    };
  });

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(chartData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Metrics');
    XLSX.writeFile(wb, 'dashboard_metrics.xlsx');
  };

  const handleBan = async id => {
    if (!window.confirm('Ban this user?')) return;
    try {
      await banAdminUser(id);
      setUsers(us => us.filter(u => u.id !== id));
    } catch {
      alert('Failed to ban user');
    }
  };

  return (
    <div className="dashboard-page">
      <h2>Admin Dashboard</h2>

      <div className="stats-cards">
        <div className="card">
          <h3>Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="card">
          <h3>Sales</h3>
          <p>${stats.totalSales.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Products</h3>
          <p>{stats.totalProducts}</p>
        </div>
      </div>

      <h3>Activity (Last 7 Days)</h3>
      <button className="export-btn" onClick={exportExcel}>
        Export Metrics to Excel
      </button>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, bottom: 20 }}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="newUsers"    name="New Users"    />
          <Line type="monotone" dataKey="newPayments" name="New Payments" />
        </LineChart>
      </ResponsiveContainer>

      <h3>User Management</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.role !== 'ROLE_ADMIN' && !u.banned && (
                  <button className="ban-btn" onClick={() => handleBan(u.id)}>
                    Ban
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

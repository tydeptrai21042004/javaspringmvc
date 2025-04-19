import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const role = localStorage.getItem('role');

  return (
    <header style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ margin: 0, paddingRight: '1rem' }}>🖥️ Computer Sales</h1>
        <nav>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/products" style={linkStyle}>Products</Link>
          {role === 'ADMIN' && <Link to="/admin/dashboard" style={linkStyle}>Admin</Link>}
          <Link to="/cart" style={linkStyle}>Cart</Link>
        </nav>
      </div>
      <div>
        {localStorage.getItem('token') ? (
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} style={btnStyle}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}
      </div>
    </header>
);

}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  backgroundColor: '#282c34',
  color: 'white'
};

const linkStyle = {
  color: 'white',
  marginRight: '1rem',
  textDecoration: 'none'
};

const btnStyle = {
  background: '#61dafb',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer'
};

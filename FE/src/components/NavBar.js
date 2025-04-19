// src/components/NavBar.js
import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(open => !open);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={handleLinkClick}>
          CompSales
        </Link>

        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-icon" />
          <span className="hamburger-icon" />
          <span className="hamburger-icon" />
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          {/* Common */}
          <NavLink to="/" end className="nav-link" onClick={handleLinkClick}>
            Home
          </NavLink>
          <NavLink to="/products" className="nav-link" onClick={handleLinkClick}>
            Products
          </NavLink>

          {/* Logged‑in User */}
          {role === 'ROLE_USER' && (
            <>
              <NavLink to="/cart" className="nav-link" onClick={handleLinkClick}>
                Cart
              </NavLink>
              <NavLink to="/orders" className="nav-link" onClick={handleLinkClick}>
                My Orders
              </NavLink>
              <NavLink to="/chat" className="nav-link" onClick={handleLinkClick}>
                Support Chat
              </NavLink>
            </>
          )}

          {/* Admin */}
          {role === 'ROLE_ADMIN' && (
            <>
              <NavLink to="/admin/dashboard" className="nav-link" onClick={handleLinkClick}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/products" className="nav-link" onClick={handleLinkClick}>
                Manage Products
              </NavLink>
              <NavLink to="/admin/categories" className="nav-link" onClick={handleLinkClick}>
                Categories
              </NavLink>
              <NavLink to="/admin/brands" className="nav-link" onClick={handleLinkClick}>
                Brands
              </NavLink>
              <NavLink to="/admin/import" className="nav-link" onClick={handleLinkClick}>
                Import
              </NavLink>
              <NavLink to="/admin/chat" className="nav-link" onClick={handleLinkClick}>
                Manage Chat
              </NavLink>
                  <NavLink to="/admin/routes" className="nav-link" onClick={handleLinkClick}>
      Routes
    </NavLink>
            </>
          )}

          {/* Auth */}
          <div className="nav-auth">
            {token ? (
              <>
                {username && <span className="nav-username">Hi, {username}!</span>}
                <button onClick={logout} className="nav-button logout-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-link auth-link" onClick={handleLinkClick}>
                  Login
                </NavLink>
                <NavLink to="/register" className="nav-link auth-link register-link" onClick={handleLinkClick}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

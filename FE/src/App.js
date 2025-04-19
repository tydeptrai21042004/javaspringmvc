// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import RoutesPage from './pages/admin/RoutesPage';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import Footer from './components/Footer';

import ChatPage from './pages/ChatPage';                    // user chat
import AdminChatPage from './pages/admin/AdminChatPage';    // admin chat

import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import BrandManagementPage from './pages/admin/BrandManagementPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsManagementPage from './pages/admin/ProductsManagementPage';
import AdminProductPage from './pages/admin/AdminProductPage';
import ImportPage from './pages/admin/ImportPage';
import ExportPage from './pages/admin/ExportPage';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        {/* User-only */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* Admin-only */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="ADMIN">
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="routes" element={<RoutesPage />} />
                <Route path="products" element={<ProductsManagementPage />} />
                <Route path="products/add" element={<AdminProductPage />} />
                <Route path="categories" element={<CategoryManagementPage />} />
                <Route path="brands" element={<BrandManagementPage />} />
                <Route path="import" element={<ImportPage />} />
                <Route path="export" element={<ExportPage />} />
                <Route path="chat" element={<AdminChatPage />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

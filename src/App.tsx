import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute.tsx';

// Public pages
import Home from './pages/Home.tsx';
import Shop from './pages/Shop.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import Cart from './pages/Cart.tsx';
import Login from './pages/Login.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import PrivacyPolicy from './pages/PrivacyPolicy.tsx';
import RefundPolicy from './pages/RefundPolicy.tsx';
import ShippingPolicy from './pages/ShippingPolicy.tsx';
import TermsAndConditions from './pages/TermsAndConditions.tsx';

// Protected pages
import Checkout from './pages/Checkout.tsx';
import OrderConfirmation from './pages/OrderConfirmation.tsx';
import Account from './pages/Account.tsx';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard.tsx';
import AdminProducts from './pages/admin/Products.tsx';
import AdminOrders from './pages/admin/Orders.tsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

          {/* Secure Patrons Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            <Route path="/account" element={<Account />} />
          </Route>

          {/* Supreme Curator Admin-Only Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

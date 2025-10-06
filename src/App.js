import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Pages
import Home from './pages/Home/Home';
import RestaurantList from './pages/Restaurant/RestaurantList';
import RestaurantDetail from './pages/Restaurant/RestaurantDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import RestaurantLogin from './pages/Auth/RestaurantLogin';
import RestaurantRegister from './pages/Auth/RestaurantRegister';
import RestaurantDashboard from './pages/Restaurant/RestaurantDashboard';
import RestaurantOrders from './pages/Restaurant/RestaurantOrders';
import Profile from './pages/Profile/Profile';
import Orders from './pages/Orders/Orders';

// Context
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <Routes location={location}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/restaurants" element={<RestaurantList />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/restaurant/login" element={<RestaurantLogin />} />
              <Route path="/restaurant/register" element={<RestaurantRegister />} />

              {/* Protected Routes - Customer */}
              <Route path="/cart" element={
                <ProtectedRoute userType="customer">
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute userType="customer">
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute userType="customer">
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute userType="customer">
                  <Orders />
                </ProtectedRoute>
              } />

              {/* Protected Routes - Restaurant */}
              <Route path="/restaurant/dashboard" element={
                <ProtectedRoute userType="restaurant">
                  <RestaurantDashboard />
                </ProtectedRoute>
              } />
              <Route path="/restaurant/orders" element={
                <ProtectedRoute userType="restaurant">
                  <RestaurantOrders />
                </ProtectedRoute>
              } />
            </Routes>
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;

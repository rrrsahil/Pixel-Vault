import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Upload from './pages/Upload';
import Gallery from './pages/Gallery';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import NotFound from './pages/NotFound';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
  const location = useLocation();

  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password"
  ];

  const isAuthPage =
    authRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/resetpassword");

  return (
    <div className="app-container">
      {!isAuthPage && <Navbar />}

      <main className="main-content">
        {children}
      </main>

      {!isAuthPage && <Footer />}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Protected Routes */}
            <Route path="/upload" element={
              <PrivateRoute>
                <Upload />
              </PrivateRoute>
            } />
            <Route path="/gallery" element={
              <PrivateRoute>
                <Gallery />
              </PrivateRoute>
            } />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />

            {/* System Routes */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check local storage for theme preference on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    closeMenu();
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container nav-content">
        
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <span className="brand-icon">
            <i className="fa-solid fa-cloud-arrow-up"></i>
          </span>
          <span className="brand-text">PixelVault</span>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          {isMenuOpen ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-bars"></i>}
        </button>

        {/* Links and Actions */}
        <div className={`nav-links-wrapper ${isMenuOpen ? 'mobile-open' : ''}`}>
          <div className="nav-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            {user && (
              <>
                <Link to="/upload" className={`nav-link ${isActive('/upload') ? 'active' : ''}`}>
                  Upload
                </Link>
                <Link to="/gallery" className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}>
                  Gallery
                </Link>
              </>
            )}
          </div>
          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Dark Mode">
              {isDarkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
            </button>
            {user ? (
               <div className="user-profile-actions">
                 <span className="user-greeting">Hello, {user.name.split(' ')[0]}</span>
                 <button onClick={logout} className="btn-logout" title="Logout">
                   <i className="fa-solid fa-arrow-right-from-bracket"></i>
                 </button>
               </div>
            ) : (
               <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

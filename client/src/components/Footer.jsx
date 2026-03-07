import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <h3>PixelVault</h3>
          <p>Secure, permanent image hosting for developers and creators.</p>
        </div>
        <div className="footer-links">
           <Link to="/terms">Terms</Link>
           <Link to="/privacy">Privacy</Link>
           <a href="https://github.com" target="_blank" rel="noreferrer">
             <i className="fa-brands fa-github"></i>
           </a>
           <a href="https://twitter.com" target="_blank" rel="noreferrer">
             <i className="fa-brands fa-twitter"></i>
           </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PixelVault. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

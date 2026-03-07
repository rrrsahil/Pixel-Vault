import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Reusing general typography

const NotFound = () => {
  return (
    <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <h1 style={{ fontSize: '6rem', color: 'var(--primary)', marginBottom: '0' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;

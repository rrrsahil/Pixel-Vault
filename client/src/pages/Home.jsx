import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import uploadIllustration from '../assets/upload-illustration.jpg';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>Host Your Images <br/><span className="highlight-text">Permanently & Securely</span></h1>
            <p>
              Upload images instantly and get permanent, fast public URLs for your projects, websites, or emails. No account required.
            </p>
            <div className="hero-buttons">
              <Link to="/upload" className="btn btn-primary">
                <i className="fa-solid fa-cloud-arrow-up"></i> Start Uploading
              </Link>
              <Link to="/gallery" className="btn btn-secondary">
                <i className="fa-solid fa-images"></i> View Gallery
              </Link>
            </div>
            
            <div className="features-list">
              <div className="feature-item">
                <i className="fa-solid fa-check-circle"></i> Up to 5MB
              </div>
              <div className="feature-item">
                <i className="fa-solid fa-check-circle"></i> Permanent URLs
              </div>
              <div className="feature-item">
                <i className="fa-solid fa-check-circle"></i> CDN Delivery
              </div>
            </div>
          </div>
          <div className="hero-image">
             {/* A placeholder for illustration. Or we can just build CSS shapes instead of missing assets */}
             <div className="illustration-wrapper">
                <div className="floating-card c1">
                   <div className="img-placeholder"></div>
                   <div className="lines">
                      <div className="l1"></div>
                      <div className="l2"></div>
                   </div>
                </div>
                <div className="floating-card c2">
                   <div className="upload-icon-large">
                      <i className="fa-solid fa-arrow-up-from-bracket"></i>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

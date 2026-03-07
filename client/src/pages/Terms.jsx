import React from 'react';

const Terms = () => {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', color: 'var(--text-main)' }}>
      <h1 style={{ marginBottom: '2rem' }}>Terms and Conditions</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Acceptance of Terms</h3>
      <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
        By accessing and using PixelVault, you agree to comply with and be bound by these Terms and Conditions.
      </p>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Acceptable Use</h3>
      <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
        You may only upload images that you own the rights to or have permission to distribute. Do not upload illegal, explicit, or copyrighted material without authorization. We reserve the right to delete any images that violate these terms.
      </p>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Service Availability</h3>
      <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
        While we strive for 100% uptime, the service is provided "as is" and "as available". We do not guarantee continuous, uninterrupted access to hosted URLs.
      </p>
    </div>
  );
};

export default Terms;

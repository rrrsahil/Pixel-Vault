import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', color: 'var(--text-main)' }}>
      <h1 style={{ marginBottom: '2rem' }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Information We Collect</h3>
      <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
        When you create an account, we collect your name and email address. When you upload files, we process the file and store anonymized file size, type, and hashing signatures. 
      </p>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. How We Use Information</h3>
      <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
        We utilize your data strictly to provide the image hosting services requested, prevent duplicate file loads, and secure your account. We do not sell your personal data to third parties.
      </p>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Data Retention</h3>
      <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
        Hosted images are kept until you manually initiate a delete request. You may request full account deletion via our support channels.
      </p>
    </div>
  );
};

export default PrivacyPolicy;

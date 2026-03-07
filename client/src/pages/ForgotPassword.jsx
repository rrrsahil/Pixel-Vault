import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
      setSent(true);
      toast.success('Password reset email sent (Check server logs in dev mode)');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Recover Password</h2>
          <p>We will send you an email with instructions.</p>
        </div>
        {!sent ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@example.com" 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <span className="spinner"></span> : 'Send Recovery Email'}
            </button>
          </form>
        ) : (
          <div className="alert-success" style={{textAlign: 'center', margin: '2rem 0'}}>
            <i className="fa-solid fa-envelope-circle-check" style={{fontSize: '3rem', color: 'var(--success)', marginBottom: '1rem'}}></i>
            <h3>Check your Inbox!</h3>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>We've sent a recovery link to {email}</p>
          </div>
        )}
        <div className="auth-footer">
          <p>Remember your password? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

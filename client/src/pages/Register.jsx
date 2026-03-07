import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error('Please enter all fields');
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const { ...postData } = formData;
      delete postData.confirmPassword;

      const success = await register(postData);
      if (success) {
          navigate('/login');
      }
    } catch (error) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Start hosting your images securely today.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="John Doe" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="name@example.com" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="••••••••" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              placeholder="••••••••" 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Sign Up'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;

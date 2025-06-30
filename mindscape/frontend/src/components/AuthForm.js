import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { setToken } from '../auth';

function AuthForm({ isLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (!username.trim()) {
      setError('Username is required');
      setLoading(false);
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      console.log('Making request to:', endpoint);
      console.log('Request data:', { username, password: '***' });
      
      const response = await fetch(`http://localhost:5000/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);
      
      if (response.ok) {
        if (isLogin && result.token) {
          setToken(result.token);
          setSuccess('Login successful!');
          setTimeout(() => navigate('/journal'), 1000);
        } else if (!isLogin) {
          setSuccess('Account created successfully! Please login.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('Unexpected response format');
        }
      } else {
        setError(result.error || `${isLogin ? 'Login' : 'Signup'} failed`);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Please check if the server is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            disabled={loading}
            minLength="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password (min 6 characters)"
            required
            disabled={loading}
            minLength="6"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <Link to="/" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                Sign up here
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                Login here
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default AuthForm;
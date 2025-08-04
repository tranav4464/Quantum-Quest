import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await onLogin(formData);
      if (!result.success) {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Welcome to FinSight AI</h1>
      <p className="text-center text-muted mb-3">
        Sign in to manage your finances with AI insights
      </p>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username or Email
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-input"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username or email"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full-width"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center mt-3">
        <p className="text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary">
            Sign up here
          </Link>
        </p>
      </div>

      {/* Demo Credentials Helper */}
      <div className="card mt-3" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="card-header">
          <h6 className="card-title">Demo Access</h6>
        </div>
        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
          <strong>Admin:</strong> admin / (create password)<br />
          <em>Or register a new account to get started</em>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone: '',
    monthly_income: '',
    currency: 'USD'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await onRegister(formData);
      if (!result.success) {
        if (typeof result.error === 'object') {
          setErrors(result.error);
        } else {
          setErrors({ general: result.error });
        }
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '500px' }}>
      <h1 className="form-title">Join FinSight AI</h1>
      <p className="text-center text-muted mb-3">
        Create your account to start managing your finances with AI
      </p>

      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="alert alert-error">
            {errors.general}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="first_name" className="form-label">
              First Name *
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="form-input"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="First name"
              disabled={loading}
            />
            {errors.first_name && <div className="form-error">{errors.first_name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="last_name" className="form-label">
              Last Name *
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="form-input"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Last name"
              disabled={loading}
            />
            {errors.last_name && <div className="form-error">{errors.last_name}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username *
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-input"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Choose a username"
            disabled={loading}
          />
          {errors.username && <div className="form-error">{errors.username}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com"
            disabled={loading}
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-input"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 (555) 123-4567"
            disabled={loading}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="monthly_income" className="form-label">
              Monthly Income
            </label>
            <input
              type="number"
              id="monthly_income"
              name="monthly_income"
              className="form-input"
              value={formData.monthly_income}
              onChange={handleInputChange}
              placeholder="5000"
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="currency" className="form-label">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              className="form-input"
              value={formData.currency}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Minimum 8 characters"
            disabled={loading}
          />
          {errors.password && <div className="form-error">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirm_password" className="form-label">
            Confirm Password *
          </label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            className="form-input"
            value={formData.confirm_password}
            onChange={handleInputChange}
            placeholder="Re-enter your password"
            disabled={loading}
          />
          {errors.confirm_password && <div className="form-error">{errors.confirm_password}</div>}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full-width"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center mt-3">
        <p className="text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-primary">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

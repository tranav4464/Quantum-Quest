import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TransactionsList from './components/TransactionsList';
import BudgetsList from './components/BudgetsList';
import GoalsList from './components/GoalsList';
import Navigation from './components/Navigation';

// API Configuration
import { getPlatformApiUrl } from './lib/platform-utils';

const DEFAULT_API_URL = 'http://127.0.0.1:8000';
const API_BASE_URL = getPlatformApiUrl(DEFAULT_API_URL);

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      // Verify token is still valid
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/users/profile/');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token validation failed:', error);
      // Remove invalid token
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login/', credentials);
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register/', userData);
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout/');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Clear local state regardless of API response
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading FinSight AI...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navigation user={user} onLogout={handleLogout} />}
        
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? (
                  <Login onLogin={handleLogin} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                !isAuthenticated ? (
                  <Register onRegister={handleRegister} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? (
                  <Dashboard user={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/transactions" 
              element={
                isAuthenticated ? (
                  <TransactionsList />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/budgets" 
              element={
                isAuthenticated ? (
                  <BudgetsList />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/goals" 
              element={
                isAuthenticated ? (
                  <GoalsList />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            {/* Default Route */}
            <Route 
              path="/" 
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

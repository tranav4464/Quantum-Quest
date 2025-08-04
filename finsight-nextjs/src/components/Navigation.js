import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-brand">
          FinSight AI
        </Link>

        <ul className="nav-links">
          <li>
            <Link 
              to="/dashboard" 
              className={isActive('/dashboard') ? 'active' : ''}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/transactions" 
              className={isActive('/transactions') ? 'active' : ''}
            >
              Transactions
            </Link>
          </li>
          <li>
            <Link 
              to="/budgets" 
              className={isActive('/budgets') ? 'active' : ''}
            >
              Budgets
            </Link>
          </li>
          <li>
            <Link 
              to="/goals" 
              className={isActive('/goals') ? 'active' : ''}
            >
              Goals
            </Link>
          </li>
        </ul>

        <div className="nav-user">
          <div className="nav-user-info">
            Welcome, {user?.first_name || user?.username}
          </div>
          <button 
            onClick={onLogout} 
            className="btn-logout"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

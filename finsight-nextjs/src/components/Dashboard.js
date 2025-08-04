import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Dashboard = ({ user }) => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/dashboard/');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="loading-spinner"></div>
        <p>Loading your financial dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        {error}
        <button 
          className="btn btn-primary mt-2" 
          onClick={fetchDashboardData}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Financial Dashboard</h1>
          <p className="card-subtitle">
            Welcome back, {user?.first_name || user?.username}! Here's your financial overview.
          </p>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-value text-success">
            {formatCurrency(dashboardData?.total_balance, user?.currency)}
          </div>
          <div className="stat-label">Total Balance</div>
        </div>

        <div className="card stat-card">
          <div className="stat-value text-primary">
            {dashboardData?.account_count || 0}
          </div>
          <div className="stat-label">Accounts</div>
        </div>

        <div className="card stat-card">
          <div className="stat-value text-info">
            {dashboardData?.recent_transactions?.length || 0}
          </div>
          <div className="stat-label">Recent Transactions</div>
        </div>

        <div className="card stat-card">
          <div className="stat-value text-warning">
            {dashboardData?.financial_health_score || 'N/A'}
          </div>
          <div className="stat-label">Financial Health Score</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Transactions</h2>
          <p className="card-subtitle">Your latest financial activities</p>
        </div>

        {dashboardData?.recent_transactions?.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recent_transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.category_name || 'Uncategorized'}</td>
                    <td className={transaction.transaction_type === 'credit' ? 'text-success' : 'text-danger'}>
                      {formatCurrency(transaction.amount, user?.currency)}
                    </td>
                    <td>
                      <span className={`badge ${transaction.transaction_type === 'credit' ? 'text-success' : 'text-danger'}`}>
                        {transaction.transaction_type === 'credit' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-muted">
            <p>No transactions found. Start by adding your first transaction!</p>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => navigate('/transactions')}
            >
              Add Transaction
            </button>
          </div>
        )}
      </div>

      {/* Budget Overview */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Budget Overview</h2>
          <p className="card-subtitle">Track your spending against budgets</p>
        </div>

        {dashboardData?.budget_overview?.length > 0 ? (
          <div className="dashboard-grid">
            {dashboardData.budget_overview.map((budget) => (
              <div key={budget.id} className="card">
                <h3 className="card-title">{budget.category?.name}</h3>
                <div className="budget-progress">
                  <div className="stat-value">
                    {formatCurrency(budget.spent, user?.currency)} / {formatCurrency(budget.amount, user?.currency)}
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%`,
                        backgroundColor: budget.spent > budget.amount ? 'var(--accent-color)' : 'var(--success-color)'
                      }}
                    ></div>
                  </div>
                  <div className="stat-label">
                    {budget.spent > budget.amount ? 'Over budget' : 'On track'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted">
            <p>No budgets set up yet. Create budgets to track your spending!</p>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => navigate('/budgets')}
            >
              Create Budget
            </button>
          </div>
        )}
      </div>

      {/* Goals Progress */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Financial Goals</h2>
          <p className="card-subtitle">Track your progress towards financial goals</p>
        </div>

        {dashboardData?.goals?.length > 0 ? (
          <div className="dashboard-grid">
            {dashboardData.goals.map((goal) => (
              <div key={goal.id} className="card">
                <h3 className="card-title">{goal.name}</h3>
                <div className="goal-progress">
                  <div className="stat-value">
                    {formatCurrency(goal.current_amount, user?.currency)} / {formatCurrency(goal.target_amount, user?.currency)}
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min((goal.current_amount / goal.target_amount) * 100, 100)}%`,
                        backgroundColor: 'var(--secondary-color)'
                      }}
                    ></div>
                  </div>
                  <div className="stat-label">
                    Target: {new Date(goal.target_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted">
            <p>No financial goals set yet. Create goals to track your progress!</p>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => navigate('/goals')}
            >
              Set Goal
            </button>
          </div>
        )}
      </div>

      {/* AI Insights */}
      {dashboardData?.ai_insights?.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">AI Insights</h2>
            <p className="card-subtitle">Personalized financial recommendations</p>
          </div>

          <div className="insights-container">
            {dashboardData.ai_insights.map((insight) => (
              <div key={insight.id} className="alert alert-info mb-2">
                <h4>{insight.title}</h4>
                <p>{insight.description}</p>
                {insight.recommendation && (
                  <div className="mt-2">
                    <strong>Recommendation:</strong> {insight.recommendation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BudgetsList = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  });

  useEffect(() => {
    Promise.all([
      fetchBudgets(),
      fetchCategories()
    ]);
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/budgets/');
      setBudgets(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
      setError('Failed to load budgets');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories/');
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate end date based on period
    if (name === 'period' || name === 'start_date') {
      const startDate = new Date(name === 'start_date' ? value : formData.start_date);
      let endDate = new Date(startDate);
      
      const period = name === 'period' ? value : formData.period;
      switch (period) {
        case 'weekly':
          endDate.setDate(startDate.getDate() + 7);
          break;
        case 'monthly':
          endDate.setMonth(startDate.getMonth() + 1);
          break;
        case 'quarterly':
          endDate.setMonth(startDate.getMonth() + 3);
          break;
        case 'yearly':
          endDate.setFullYear(startDate.getFullYear() + 1);
          break;
        default:
          break;
      }
      
      setFormData(prev => ({
        ...prev,
        end_date: endDate.toISOString().split('T')[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const budgetData = {
        ...formData,
        name: `${categories.find(c => c.id === formData.category)?.name || 'Budget'} - ${formData.period}`,
        amount: parseFloat(formData.amount)
      };
      await axios.post('/api/budgets/', budgetData);
      setShowForm(false);
      setFormData({
        category: '',
        amount: '',
        period: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        end_date: ''
      });
      await fetchBudgets();
    } catch (error) {
      console.error('Failed to create budget:', error);
      setError('Failed to create budget');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await axios.delete(`/api/budgets/${id}/`);
        await fetchBudgets();
      } catch (error) {
        console.error('Failed to delete budget:', error);
        setError('Failed to delete budget');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const calculateProgress = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    return Math.min(percentage, 100);
  };

  const getProgressColor = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 100) return 'var(--accent-color)';
    if (percentage > 80) return 'var(--warning-color)';
    return 'var(--success-color)';
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="loading-spinner"></div>
        <p>Loading budgets...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Budgets</h1>
          <p className="card-subtitle">Set spending limits and track your progress</p>
        </div>

        <div className="text-right mb-3">
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Create Budget'}
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {showForm && (
          <div className="card mb-3">
            <div className="card-header">
              <h2 className="card-title">Create New Budget</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select
                    id="category"
                    name="category"
                    className="form-input"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="amount" className="form-label">Budget Amount</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    className="form-input"
                    value={formData.amount}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="1000.00"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="period" className="form-label">Period</label>
                  <select
                    id="period"
                    name="period"
                    className="form-input"
                    value={formData.period}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="start_date" className="form-label">Start Date</label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    className="form-input"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_date" className="form-label">End Date</label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    className="form-input"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                    readOnly
                  />
                </div>
              </div>

              <div className="text-right">
                <button type="submit" className="btn btn-success">
                  Create Budget
                </button>
              </div>
            </form>
          </div>
        )}

        {budgets.length > 0 ? (
          <div className="dashboard-grid">
            {budgets.map((budget) => (
              <div key={budget.id} className="card">
                <div className="card-header">
                  <h3 className="card-title">{budget.category_name || 'Uncategorized'}</h3>
                  <p className="card-subtitle">{budget.period} budget</p>
                </div>

                <div className="budget-details">
                  <div className="budget-amounts">
                    <div className="stat-value">
                      {formatCurrency(budget.spent_amount || 0)} / {formatCurrency(budget.amount)}
                    </div>
                    <div className="stat-label">
                      {budget.spent_amount > budget.amount ? 'Over budget' : 'Remaining'}: {' '}
                      <span className={budget.spent_amount > budget.amount ? 'text-danger' : 'text-success'}>
                        {formatCurrency(Math.abs(budget.amount - (budget.spent_amount || 0)))}
                      </span>
                    </div>
                  </div>

                  <div className="progress-bar mt-2 mb-2">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${calculateProgress(budget.spent_amount || 0, budget.amount)}%`,
                        backgroundColor: getProgressColor(budget.spent_amount || 0, budget.amount)
                      }}
                    ></div>
                  </div>

                  <div className="budget-dates text-muted" style={{ fontSize: '0.875rem' }}>
                    <div>Start: {new Date(budget.start_date).toLocaleDateString()}</div>
                    <div>End: {new Date(budget.end_date).toLocaleDateString()}</div>
                  </div>

                  <div className="budget-actions mt-3">
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(budget.id)}
                      style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                    >
                      Delete Budget
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted">
            <p>No budgets created yet. Create your first budget to start tracking spending!</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .progress-bar {
          width: 100%;
          height: 8px;
          background-color: var(--border-color);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: var(--transition);
        }

        .budget-details {
          text-align: center;
        }

        .budget-amounts {
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default BudgetsList;

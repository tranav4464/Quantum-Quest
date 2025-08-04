import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GoalsList = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_amount: '',
    current_amount: '',
    target_date: '',
    goal_type: 'savings'
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/goals/');
      setGoals(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      setError('Failed to load goals');
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const goalData = {
        ...formData,
        target_amount: parseFloat(formData.target_amount),
        current_amount: parseFloat(formData.current_amount) || 0
      };
      await axios.post('http://localhost:8000/api/goals/', goalData);
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        target_amount: '',
        current_amount: '',
        target_date: '',
        goal_type: 'savings'
      });
      await fetchGoals();
    } catch (error) {
      console.error('Failed to create goal:', error);
      setError('Failed to create goal');
    }
  };

  const handleUpdateProgress = async (goalId, newAmount) => {
    try {
      await axios.patch(`/api/goals/${goalId}/`, {
        current_amount: newAmount
      });
      await fetchGoals();
    } catch (error) {
      console.error('Failed to update goal progress:', error);
      setError('Failed to update goal progress');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await axios.delete(`/api/goals/${id}/`);
        await fetchGoals();
      } catch (error) {
        console.error('Failed to delete goal:', error);
        setError('Failed to delete goal');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGoalStatus = (current, target, targetDate) => {
    const progress = (current / target) * 100;
    const daysRemaining = getDaysRemaining(targetDate);
    
    if (progress >= 100) return { status: 'completed', color: 'var(--success-color)' };
    if (daysRemaining < 0) return { status: 'overdue', color: 'var(--accent-color)' };
    if (daysRemaining < 30 && progress < 80) return { status: 'at-risk', color: 'var(--warning-color)' };
    return { status: 'on-track', color: 'var(--secondary-color)' };
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="loading-spinner"></div>
        <p>Loading goals...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Financial Goals</h1>
          <p className="card-subtitle">Set and track your financial objectives</p>
        </div>

        <div className="text-right mb-3">
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Create Goal'}
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
              <h2 className="card-title">Create New Goal</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Goal Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Emergency Fund"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="goal_type" className="form-label">Goal Type</label>
                  <select
                    id="goal_type"
                    name="goal_type"
                    className="form-input"
                    value={formData.goal_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="savings">Savings</option>
                    <option value="debt_payoff">Debt Payoff</option>
                    <option value="investment">Investment</option>
                    <option value="purchase">Purchase</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your goal..."
                  rows="3"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="target_amount" className="form-label">Target Amount</label>
                  <input
                    type="number"
                    id="target_amount"
                    name="target_amount"
                    className="form-input"
                    value={formData.target_amount}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="10000.00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="current_amount" className="form-label">Current Amount</label>
                  <input
                    type="number"
                    id="current_amount"
                    name="current_amount"
                    className="form-input"
                    value={formData.current_amount}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="target_date" className="form-label">Target Date</label>
                  <input
                    type="date"
                    id="target_date"
                    name="target_date"
                    className="form-input"
                    value={formData.target_date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="text-right">
                <button type="submit" className="btn btn-success">
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        )}

        {goals.length > 0 ? (
          <div className="dashboard-grid">
            {goals.map((goal) => {
              const goalStatus = getGoalStatus(goal.current_amount, goal.target_amount, goal.target_date);
              const progress = calculateProgress(goal.current_amount, goal.target_amount);
              const daysRemaining = getDaysRemaining(goal.target_date);

              return (
                <div key={goal.id} className="card">
                  <div className="card-header">
                    <h3 className="card-title">{goal.name}</h3>
                    <p className="card-subtitle">
                      <span style={{ color: goalStatus.color, fontWeight: 'bold' }}>
                        {goalStatus.status.replace('-', ' ').replace('_', ' ').toUpperCase()}
                      </span>
                      {' '} • {goal.goal_type.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="goal-details">
                    {goal.description && (
                      <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                        {goal.description}
                      </p>
                    )}

                    <div className="goal-progress">
                      <div className="stat-value">
                        {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                      </div>
                      <div className="stat-label">
                        {progress.toFixed(1)}% complete
                      </div>
                    </div>

                    <div className="progress-bar mt-2 mb-3">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${progress}%`,
                          backgroundColor: goalStatus.color
                        }}
                      ></div>
                    </div>

                    <div className="goal-timeline">
                      <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                        <div>Target Date: {new Date(goal.target_date).toLocaleDateString()}</div>
                        <div>
                          {daysRemaining > 0 ? (
                            `${daysRemaining} days remaining`
                          ) : daysRemaining === 0 ? (
                            'Target date is today!'
                          ) : (
                            `${Math.abs(daysRemaining)} days overdue`
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="goal-actions mt-3">
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input
                          type="number"
                          placeholder="Update amount"
                          className="form-input"
                          style={{ fontSize: '0.875rem' }}
                          onBlur={(e) => {
                            if (e.target.value && parseFloat(e.target.value) !== goal.current_amount) {
                              handleUpdateProgress(goal.id, parseFloat(e.target.value));
                              e.target.value = '';
                            }
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.target.blur();
                            }
                          }}
                        />
                      </div>
                      
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(goal.id)}
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', width: '100%' }}
                      >
                        Delete Goal
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted">
            <p>No financial goals set yet. Create your first goal to start tracking progress!</p>
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

        .goal-details {
          text-align: center;
        }

        .goal-progress {
          margin-bottom: 1rem;
        }

        .goal-timeline {
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default GoalsList;

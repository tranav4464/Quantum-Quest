import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    account: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    Promise.all([
      fetchTransactions(),
      fetchCategories(),
      fetchAccounts()
    ]);
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/transactions/');
      setTransactions(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError('Failed to load transactions');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories/');
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/accounts/');
      setAccounts(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
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
      // Map form data to backend format
      const transactionData = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category || null,
        account: formData.account || null,
        transaction_type: formData.type === 'income' ? 'credit' : 'debit',
        transaction_date: formData.date + 'T00:00:00Z'
      };
      
      await axios.post('http://localhost:8000/api/transactions/', transactionData);
      setShowForm(false);
      setFormData({
        amount: '',
        description: '',
        category: '',
        account: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      });
      await fetchTransactions();
    } catch (error) {
      console.error('Failed to create transaction:', error);
      setError('Failed to create transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`http://localhost:8000/api/transactions/${id}/`);
        await fetchTransactions();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        setError('Failed to delete transaction');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="loading-spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Transactions</h1>
          <p className="card-subtitle">Manage your income and expenses</p>
        </div>

        <div className="text-right mb-3">
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Transaction'}
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
              <h2 className="card-title">Add New Transaction</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="amount" className="form-label">Amount</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    className="form-input"
                    value={formData.amount}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type" className="form-label">Type</label>
                  <select
                    id="type"
                    name="type"
                    className="form-input"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="form-input"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Transaction description"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select
                    id="category"
                    name="category"
                    className="form-input"
                    value={formData.category}
                    onChange={handleInputChange}
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
                  <label htmlFor="account" className="form-label">Account</label>
                  <select
                    id="account"
                    name="account"
                    className="form-input"
                    value={formData.account}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date" className="form-label">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="form-input"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="text-right">
                <button type="submit" className="btn btn-success">
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        )}

        {transactions.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Account</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.category_name || 'Uncategorized'}</td>
                    <td>{transaction.account_name || 'No Account'}</td>
                    <td className={transaction.transaction_type === 'credit' ? 'text-success' : 'text-danger'}>
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td>
                      <span className={`badge ${transaction.transaction_type === 'credit' ? 'text-success' : 'text-danger'}`}>
                        {transaction.transaction_type === 'credit' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(transaction.id)}
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-muted">
            <p>No transactions found. Add your first transaction to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;

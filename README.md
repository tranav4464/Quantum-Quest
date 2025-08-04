# FinSight AI - Personal Finance Management System

A comprehensive personal finance management application with AI-powered insights, built with Django REST Framework backend and React frontend.

## Features

### ✅ Fully Functional Dashboard Features

- **User Authentication**: Complete registration, login, and logout functionality
- **Financial Overview**: Real-time display of account balances and financial metrics
- **Transaction Management**: Add, view, edit, and delete financial transactions
- **Budget Tracking**: Create budgets and monitor spending against limits
- **Goal Setting**: Set financial goals and track progress
- **Category Management**: Organize transactions with customizable categories
- **Account Management**: Manage multiple financial accounts
- **Responsive Design**: Works on desktop and mobile devices

### 🔧 Technical Features

- **RESTful API**: Complete Django REST Framework backend
- **Real-time Updates**: Automatic data refresh and synchronization
- **Data Validation**: Comprehensive input validation and error handling
- **Secure Authentication**: Token-based authentication system
- **Database Integration**: SQLite database with Django ORM
- **Modern UI**: Clean, intuitive React-based user interface

## Project Structure

```
Quest/
├── finsight_backend/          # Django REST API Backend
│   ├── apps/
│   │   ├── core/             # Core models, views, serializers
│   │   ├── ai/               # AI integration services
│   │   └── chat/             # Chat functionality
│   ├── config/               # Django settings and configuration
│   └── requirements/         # Python dependencies
├── finsight-nextjs/          # React Frontend Application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Application pages
│   │   └── lib/             # Utilities and services
│   └── public/              # Static assets
└── start-dev.bat            # Development server startup script
```

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### 1. Start Development Servers

Simply run the startup script:

```bash
start-dev.bat
```

This will automatically start both the Django backend (port 8000) and React frontend (port 3000).

### 2. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/

### 3. Create Your Account

1. Navigate to http://localhost:3000
2. Click "Register" to create a new account
3. Fill in your details and submit
4. You'll be automatically logged in

## Manual Setup (Alternative)

### Backend Setup

```bash
cd finsight_backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate

# Install dependencies
pip install -r requirements/development.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver 8000
```

### Frontend Setup

```bash
cd finsight-nextjs

# Install dependencies
npm install

# Start development server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

### Core Features
- `GET /api/dashboard/` - Dashboard data
- `GET/POST /api/accounts/` - Account management
- `GET/POST /api/transactions/` - Transaction management
- `GET/POST /api/categories/` - Category management
- `GET/POST /api/budgets/` - Budget management
- `GET/POST /api/goals/` - Goal management

### User Management
- `GET /api/users/profile/` - User profile
- `PATCH /api/users/profile/` - Update profile

## Usage Guide

### 1. Dashboard Overview
- View your financial summary at a glance
- See recent transactions, account balances, and key metrics
- Quick access to all major features

### 2. Managing Transactions
- Click "Transactions" in the navigation
- Use "Add Transaction" to record income or expenses
- Select appropriate categories and accounts
- View transaction history in an organized table

### 3. Setting Up Budgets
- Navigate to "Budgets" section
- Click "Create Budget" to set spending limits
- Choose categories and time periods
- Monitor progress with visual indicators

### 4. Tracking Goals
- Go to "Goals" section
- Create financial goals with target amounts and dates
- Update progress as you save money
- Visual progress tracking with status indicators

### 5. Account Management
- Add multiple bank accounts, credit cards, etc.
- Track balances across all accounts
- Organize transactions by account

## Development Features

### Backend (Django)
- **Models**: Complete data models for users, accounts, transactions, budgets, goals
- **Serializers**: DRF serializers for API data formatting
- **ViewSets**: RESTful API endpoints with full CRUD operations
- **Authentication**: Token-based authentication system
- **Permissions**: User-specific data access controls

### Frontend (React)
- **Components**: Modular, reusable React components
- **State Management**: React hooks for state management
- **API Integration**: Axios for backend communication
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Comprehensive error handling and user feedback

## Database Schema

### Core Models
- **User**: Extended Django user model with financial profile
- **Account**: Financial accounts (checking, savings, credit cards)
- **Category**: Transaction categories with icons and colors
- **Transaction**: Financial transactions with full details
- **Budget**: Spending budgets with period tracking
- **Goal**: Financial goals with progress tracking

## Security Features

- Token-based authentication
- User-specific data isolation
- Input validation and sanitization
- CORS configuration for frontend integration
- Secure password handling

## Troubleshooting

### Common Issues

1. **Backend won't start**
   - Ensure Python virtual environment is activated
   - Check that all dependencies are installed
   - Verify database migrations are applied

2. **Frontend won't start**
   - Ensure Node.js and npm are installed
   - Run `npm install` to install dependencies
   - Check for port conflicts (default: 3000)

3. **API connection issues**
   - Verify backend is running on port 8000
   - Check CORS settings in Django
   - Ensure API base URL is correct in frontend

### Development Tips

- Use browser developer tools to debug API calls
- Check Django logs for backend errors
- Use React Developer Tools for frontend debugging
- Monitor network requests in browser dev tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for errors
4. Verify both servers are running correctly

---

**FinSight AI** - Making personal finance management intelligent and accessible.
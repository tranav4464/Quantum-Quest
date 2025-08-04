#!/usr/bin/env python3
"""
FinSight API Test Script
Tests all major API endpoints to ensure functionality
"""

import requests
import json
import sys
from datetime import datetime, timedelta

# Configuration
BASE_URL = "http://127.0.0.1:8000"
API_URL = f"{BASE_URL}/api"

class FinSightAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.token = None
        self.user_id = None
        
    def test_health(self):
        """Test API health endpoint"""
        print("🔍 Testing API Health...")
        try:
            response = self.session.get(f"{BASE_URL}/api/health/")
            if response.status_code == 200:
                print("✅ API Health: OK")
                return True
            else:
                print(f"❌ API Health: Failed ({response.status_code})")
                return False
        except Exception as e:
            print(f"❌ API Health: Error - {e}")
            return False
    
    def test_registration(self):
        """Test user registration"""
        print("\n🔍 Testing User Registration...")
        
        # Generate unique test user
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        test_user = {
            "username": f"testuser_{timestamp}",
            "email": f"test_{timestamp}@example.com",
            "password": "testpass123",
            "password_confirm": "testpass123",
            "first_name": "Test",
            "last_name": "User",
            "monthly_income": "5000.00"
        }
        
        try:
            response = self.session.post(f"{API_URL}/auth/register/", json=test_user)
            if response.status_code == 201:
                data = response.json()
                self.token = data.get('token')
                self.user_id = data.get('user', {}).get('id')
                self.session.headers.update({'Authorization': f'Token {self.token}'})
                print("✅ User Registration: Success")
                print(f"   User ID: {self.user_id}")
                return True
            else:
                print(f"❌ User Registration: Failed ({response.status_code})")
                print(f"   Response: {response.text}")
                return False
        except Exception as e:
            print(f"❌ User Registration: Error - {e}")
            return False
    
    def test_dashboard(self):
        """Test dashboard endpoint"""
        print("\n🔍 Testing Dashboard...")
        try:
            response = self.session.get(f"{API_URL}/dashboard/")
            if response.status_code == 200:
                data = response.json()
                print("✅ Dashboard: Success")
                print(f"   Total Balance: ${data.get('total_balance', 0)}")
                print(f"   Account Count: {data.get('account_count', 0)}")
                print(f"   Recent Transactions: {len(data.get('recent_transactions', []))}")
                return True
            else:
                print(f"❌ Dashboard: Failed ({response.status_code})")
                return False
        except Exception as e:
            print(f"❌ Dashboard: Error - {e}")
            return False
    
    def test_accounts(self):
        """Test account management"""
        print("\n🔍 Testing Account Management...")
        
        # Create test account
        test_account = {
            "name": "Test Checking Account",
            "account_type": "checking",
            "balance": "1000.00",
            "bank_name": "Test Bank"
        }
        
        try:
            # Create account
            response = self.session.post(f"{API_URL}/accounts/", json=test_account)
            if response.status_code == 201:
                account_data = response.json()
                account_id = account_data.get('id')
                print("✅ Account Creation: Success")
                print(f"   Account ID: {account_id}")
                
                # List accounts
                response = self.session.get(f"{API_URL}/accounts/")
                if response.status_code == 200:
                    accounts = response.json()
                    account_list = accounts.get('results', accounts) if isinstance(accounts, dict) else accounts
                    print(f"✅ Account List: Success ({len(account_list)} accounts)")
                    return True
                else:
                    print(f"❌ Account List: Failed ({response.status_code})")
                    return False
            else:
                print(f"❌ Account Creation: Failed ({response.status_code})")
                print(f"   Response: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Account Management: Error - {e}")
            return False
    
    def test_categories(self):
        """Test category management"""
        print("\n🔍 Testing Category Management...")
        try:
            response = self.session.get(f"{API_URL}/categories/")
            if response.status_code == 200:
                categories = response.json()
                category_list = categories.get('results', categories) if isinstance(categories, dict) else categories
                print(f"✅ Categories: Success ({len(category_list)} categories)")
                
                # Show some default categories
                for cat in category_list[:3]:
                    print(f"   - {cat.get('name')} ({cat.get('category_type')})")
                return True
            else:
                print(f"❌ Categories: Failed ({response.status_code})")
                return False
        except Exception as e:
            print(f"❌ Categories: Error - {e}")
            return False
    
    def test_transactions(self):
        """Test transaction management"""
        print("\n🔍 Testing Transaction Management...")
        
        # Get accounts and categories first
        accounts_response = self.session.get(f"{API_URL}/accounts/")
        categories_response = self.session.get(f"{API_URL}/categories/")
        
        if accounts_response.status_code != 200 or categories_response.status_code != 200:
            print("❌ Transaction Test: Cannot get accounts/categories")
            return False
        
        accounts = accounts_response.json()
        categories = categories_response.json()
        
        account_list = accounts.get('results', accounts) if isinstance(accounts, dict) else accounts
        category_list = categories.get('results', categories) if isinstance(categories, dict) else categories
        
        if not account_list or not category_list:
            print("❌ Transaction Test: No accounts or categories available")
            return False
        
        # Create test transaction
        test_transaction = {
            "amount": 50.00,
            "description": "Test Transaction",
            "account": account_list[0]['id'],
            "category": category_list[0]['id'],
            "transaction_type": "debit",
            "transaction_date": datetime.now().isoformat()
        }
        
        try:
            response = self.session.post(f"{API_URL}/transactions/", json=test_transaction)
            if response.status_code == 201:
                transaction_data = response.json()
                print("✅ Transaction Creation: Success")
                print(f"   Transaction ID: {transaction_data.get('id')}")
                print(f"   Amount: ${transaction_data.get('amount')}")
                
                # List transactions
                response = self.session.get(f"{API_URL}/transactions/")
                if response.status_code == 200:
                    transactions = response.json()
                    transaction_list = transactions.get('results', transactions) if isinstance(transactions, dict) else transactions
                    print(f"✅ Transaction List: Success ({len(transaction_list)} transactions)")
                    return True
                else:
                    print(f"❌ Transaction List: Failed ({response.status_code})")
                    return False
            else:
                print(f"❌ Transaction Creation: Failed ({response.status_code})")
                print(f"   Response: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Transaction Management: Error - {e}")
            return False
    
    def test_budgets(self):
        """Test budget management"""
        print("\n🔍 Testing Budget Management...")
        
        # Get categories first
        categories_response = self.session.get(f"{API_URL}/categories/")
        if categories_response.status_code != 200:
            print("❌ Budget Test: Cannot get categories")
            return False
        
        categories = categories_response.json()
        category_list = categories.get('results', categories) if isinstance(categories, dict) else categories
        
        if not category_list:
            print("❌ Budget Test: No categories available")
            return False
        
        # Create test budget
        start_date = datetime.now().date()
        end_date = start_date + timedelta(days=30)
        
        test_budget = {
            "name": "Test Budget",
            "category": category_list[0]['id'],
            "amount": 500.00,
            "period": "monthly",
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat()
        }
        
        try:
            response = self.session.post(f"{API_URL}/budgets/", json=test_budget)
            if response.status_code == 201:
                budget_data = response.json()
                print("✅ Budget Creation: Success")
                print(f"   Budget ID: {budget_data.get('id')}")
                print(f"   Amount: ${budget_data.get('amount')}")
                return True
            else:
                print(f"❌ Budget Creation: Failed ({response.status_code})")
                print(f"   Response: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Budget Management: Error - {e}")
            return False
    
    def test_goals(self):
        """Test goal management"""
        print("\n🔍 Testing Goal Management...")
        
        # Create test goal
        target_date = datetime.now().date() + timedelta(days=365)
        
        test_goal = {
            "name": "Test Emergency Fund",
            "description": "Build emergency fund for financial security",
            "goal_type": "savings",
            "target_amount": 10000.00,
            "current_amount": 1000.00,
            "target_date": target_date.isoformat()
        }
        
        try:
            response = self.session.post(f"{API_URL}/goals/", json=test_goal)
            if response.status_code == 201:
                goal_data = response.json()
                print("✅ Goal Creation: Success")
                print(f"   Goal ID: {goal_data.get('id')}")
                print(f"   Target: ${goal_data.get('target_amount')}")
                print(f"   Progress: {goal_data.get('progress_percentage', 0):.1f}%")
                return True
            else:
                print(f"❌ Goal Creation: Failed ({response.status_code})")
                print(f"   Response: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Goal Management: Error - {e}")
            return False
    
    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting FinSight API Tests")
        print("=" * 50)
        
        tests = [
            self.test_health,
            self.test_registration,
            self.test_dashboard,
            self.test_accounts,
            self.test_categories,
            self.test_transactions,
            self.test_budgets,
            self.test_goals
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        print("\n" + "=" * 50)
        print(f"🏁 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! The API is fully functional.")
            return True
        else:
            print("⚠️  Some tests failed. Check the output above for details.")
            return False

def main():
    """Main function"""
    print("FinSight API Test Suite")
    print("Make sure the Django server is running on http://127.0.0.1:8000")
    print()
    
    tester = FinSightAPITester()
    success = tester.run_all_tests()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
import google.generativeai as genai
import os
import logging
import json
import re
from typing import Dict, List, Optional, Tuple
from django.conf import settings
from django.core.cache import cache
from django.utils import timezone
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class GeminiAIService:
    """
    Google Gemini AI service for financial conversations and analysis.
    Provides intelligent responses to user queries about their finances.
    """
    
    def __init__(self):
        # Configure Gemini API with your API key
        self.api_key = "AIzaSyD75z2P4cPm3OavxSZ2UvhKHKOwag3-KpI"
        genai.configure(api_key=self.api_key)
        
        # Initialize the model
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # AI configuration
        self.generation_config = {
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 40,
            "max_output_tokens": 2048,
        }
        
        self.safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
        
        logger.info("Gemini AI Service initialized successfully")
    
    def generate_response(self, prompt: str, context: str = "") -> str:
        """
        Generate AI response for given prompt.
        
        Args:
            prompt: User's question or message
            context: Additional context for better responses
            
        Returns:
            AI-generated response string
        """
        try:
            # Create cache key for similar queries
            cache_key = f"gemini_response_{hash(prompt + context)}"
            cached_response = cache.get(cache_key)
            
            if cached_response:
                logger.info("Returning cached response")
                return cached_response
            
            # Combine context and prompt
            full_prompt = f"""
            You are a helpful financial assistant AI for the FinSight app. 
            
            Context: {context}
            
            User Question: {prompt}
            
            Please provide a helpful, accurate, and friendly response about their financial situation.
            Keep your response concise but informative. Use specific numbers when available.
            """
            
            # Generate response
            response = self.model.generate_content(
                full_prompt,
                generation_config=self.generation_config,
                safety_settings=self.safety_settings
            )
            
            ai_response = response.text.strip()
            
            # Cache the response for 5 minutes
            cache.set(cache_key, ai_response, 300)
            
            logger.info(f"Generated AI response for prompt: {prompt[:50]}...")
            return ai_response
            
        except Exception as e:
            logger.error(f"Error generating AI response: {e}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."
    
    def generate_financial_response(self, user_message: str, financial_context: str) -> str:
        """
        Generate contextual financial response using user's data.
        
        Args:
            user_message: User's financial question
            financial_context: User's financial data context
            
        Returns:
            Contextual AI response
        """
        try:
            financial_prompt = f"""
            You are an expert financial advisor AI assistant for FinSight, a personal finance management app.
            
            User's Financial Context:
            {financial_context}
            
            User's Question: {user_message}
            
            Instructions:
            1. Analyze the user's financial context
            2. Provide specific, actionable advice based on their actual data
            3. Be encouraging but realistic
            4. Suggest concrete next steps when appropriate
            5. Use actual numbers from their context when relevant
            6. Keep responses conversational and friendly
            7. If asking about budgets, goals, or spending, reference their specific data
            
            Provide a helpful response:
            """
            
            response = self.model.generate_content(
                financial_prompt,
                generation_config=self.generation_config,
                safety_settings=self.safety_settings
            )
            
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Error generating financial response: {e}")
            return "I'm having trouble analyzing your financial data right now. Please try asking your question again."
    
    def categorize_expense(self, description: str) -> str:
        """
        Use AI to categorize an expense description.
        
        Args:
            description: Expense description text
            
        Returns:
            Predicted category name
        """
        try:
            categorization_prompt = f"""
            Categorize this expense description into one of these categories:
            
            Categories: food_dining, groceries, transportation, fuel, entertainment, 
            shopping, utilities, healthcare, education, travel, fitness, subscriptions, 
            insurance, banking, investment, miscellaneous
            
            Expense description: "{description}"
            
            Return only the category name, nothing else.
            """
            
            response = self.model.generate_content(
                categorization_prompt,
                generation_config={
                    "temperature": 0.3,  # Lower temperature for more consistent categorization
                    "max_output_tokens": 50,
                }
            )
            
            category = response.text.strip().lower()
            
            # Validate category
            valid_categories = [
                'food_dining', 'groceries', 'transportation', 'fuel', 'entertainment',
                'shopping', 'utilities', 'healthcare', 'education', 'travel', 
                'fitness', 'subscriptions', 'insurance', 'banking', 'investment', 'miscellaneous'
            ]
            
            if category in valid_categories:
                return category
            else:
                return 'miscellaneous'
                
        except Exception as e:
            logger.error(f"Error categorizing expense: {e}")
            return 'miscellaneous'
    
    def generate_insights(self, financial_data: Dict) -> List[str]:
        """
        Generate financial insights based on user data.
        
        Args:
            financial_data: Dictionary containing user's financial information
            
        Returns:
            List of insight strings
        """
        try:
            insights_prompt = f"""
            Analyze this financial data and provide 3-5 key insights and recommendations:
            
            Financial Data:
            {json.dumps(financial_data, indent=2)}
            
            Provide insights about:
            1. Spending patterns and trends
            2. Budget performance
            3. Goal progress
            4. Areas for improvement
            5. Positive financial behaviors to reinforce
            
            Format as a list of actionable insights. Each insight should be 1-2 sentences.
            """
            
            response = self.model.generate_content(
                insights_prompt,
                generation_config=self.generation_config,
                safety_settings=self.safety_settings
            )
            
            insights_text = response.text.strip()
            
            # Parse insights into list (simple approach)
            insights = [insight.strip() for insight in insights_text.split('\n') if insight.strip()]
            
            return insights[:5]  # Return top 5 insights
            
        except Exception as e:
            logger.error(f"Error generating insights: {e}")
            return ["I'm having trouble analyzing your financial data right now. Please try again later."]


class FinancialContextBuilder:
    """
    Build financial context for AI responses using user's data.
    """
    
    @staticmethod
    def build_user_context(user) -> str:
        """
        Build comprehensive financial context for a user.
        
        Args:
            user: Django User instance
            
        Returns:
            Formatted financial context string
        """
        try:
            from apps.transactions.models import Transaction
            from apps.budgets.models import Budget
            from apps.goals.models import Goal
            
            # Get recent transactions
            recent_transactions = Transaction.objects.filter(
                user=user
            ).order_by('-date')[:10]
            
            # Get active budgets
            active_budgets = Budget.objects.filter(
                user=user,
                is_active=True
            )
            
            # Get active goals
            active_goals = Goal.objects.filter(
                user=user,
                status='active'
            )
            
            # Calculate spending summary
            current_month = timezone.now().replace(day=1)
            monthly_spending = Transaction.objects.filter(
                user=user,
                date__gte=current_month,
                transaction_type='expense'
            ).aggregate(
                total=models.Sum('amount')
            )['total'] or 0
            
            # Build context string
            context = f"""
            User Financial Overview:
            - Monthly spending so far: ${monthly_spending:.2f}
            - Active budgets: {active_budgets.count()}
            - Active goals: {active_goals.count()}
            - Recent transactions: {recent_transactions.count()}
            
            Recent Transactions:
            """
            
            for transaction in recent_transactions[:5]:
                context += f"- {transaction.description}: ${transaction.amount} ({transaction.category})\n"
            
            if active_budgets.exists():
                context += "\nActive Budgets:\n"
                for budget in active_budgets[:3]:
                    spent = budget.calculate_spent()
                    remaining = budget.allocated_amount - spent
                    context += f"- {budget.category}: ${spent:.2f} spent / ${budget.allocated_amount:.2f} budget (${remaining:.2f} remaining)\n"
            
            if active_goals.exists():
                context += "\nActive Goals:\n"
                for goal in active_goals[:3]:
                    progress = (goal.current_amount / goal.target_amount) * 100 if goal.target_amount > 0 else 0
                    context += f"- {goal.title}: ${goal.current_amount:.2f} / ${goal.target_amount:.2f} ({progress:.1f}% complete)\n"
            
            return context
            
        except Exception as e:
            logger.error(f"Error building user context: {e}")
            return "Financial data is currently unavailable."


# Test function to verify API connection
def test_gemini_connection():
    """
    Test function to verify Gemini API is working correctly.
    """
    try:
        ai_service = GeminiAIService()
        
        # Test basic response
        test_response = ai_service.generate_response("Hello, how can you help me with my finances?")
        print(f"✓ API Connection Test Successful!")
        print(f"Response: {test_response[:100]}...")
        
        # Test categorization
        test_category = ai_service.categorize_expense("Coffee at Starbucks")
        print(f"✓ Categorization Test: 'Coffee at Starbucks' -> {test_category}")
        
        return True
        
    except Exception as e:
        print(f"✗ API Connection Test Failed: {e}")
        return False

import google.generativeai as genai
import logging
import json
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

class GeminiAIService:
    """
    Google Gemini AI service for financial conversations and analysis.
    """
    
    def __init__(self):
        # Configure Gemini API
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
        
        logger.info("Gemini AI Service initialized successfully")
    
    def generate_response(self, prompt: str, context: str = "") -> str:
        """Generate AI response for given prompt."""
        try:
            # Combine context and prompt
            full_prompt = f"""
            You are a helpful financial assistant AI for the FinSight app. 
            
            Context: {context}
            
            User Question: {prompt}
            
            Please provide a helpful, accurate, and friendly response about their financial situation.
            Keep your response concise but informative. Use specific numbers when available.
            """
            
            # Generate response
            response = self.model.generate_content(full_prompt)
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Error generating AI response: {e}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."
    
    def generate_financial_response(self, user_message: str, financial_context: str) -> str:
        """Generate contextual financial response using user's data."""
        try:
            financial_prompt = f"""
            You are an expert financial advisor AI assistant for FinSight.
            
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
            
            Provide a helpful response:
            """
            
            response = self.model.generate_content(financial_prompt)
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Error generating financial response: {e}")
            return "I'm having trouble analyzing your financial data right now. Please try asking your question again."
    
    def categorize_expense(self, description: str) -> str:
        """Use AI to categorize an expense description."""
        try:
            categorization_prompt = f"""
            Categorize this expense description into one of these categories:
            
            Categories: food_dining, groceries, transportation, fuel, entertainment, 
            shopping, utilities, healthcare, education, travel, fitness, subscriptions, 
            insurance, banking, investment, miscellaneous
            
            Expense description: "{description}"
            
            Return only the category name, nothing else.
            """
            
            response = self.model.generate_content(categorization_prompt)
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
        """Generate financial insights based on user data."""
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
            
            response = self.model.generate_content(insights_prompt)
            insights_text = response.text.strip()
            
            # Parse insights into list
            insights = [insight.strip() for insight in insights_text.split('\n') if insight.strip()]
            return insights[:5]  # Return top 5 insights
            
        except Exception as e:
            logger.error(f"Error generating insights: {e}")
            return ["I'm having trouble analyzing your financial data right now. Please try again later."]


def test_gemini_connection():
    """Test function to verify Gemini API is working correctly."""
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

if __name__ == "__main__":
    test_gemini_connection()

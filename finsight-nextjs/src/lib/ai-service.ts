import { AIMessage, AIConversation } from '@/types';
import { getPlatformApiUrl } from './platform-utils';

const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const API_BASE_URL = getPlatformApiUrl(DEFAULT_API_URL);

export class AIService {
  /**
   * Send a message to the AI backend and get a response
   */
  static async sendMessage(message: string): Promise<{ user_message: string; ai_response: string; timestamp: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      throw new Error('Failed to send message to AI service');
    }
  }

  /**
   * Categorize an expense using AI
   */
  static async categorizeExpense(description: string): Promise<{ category: string; confidence: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/categorize/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        category: data.category,
        confidence: data.confidence
      };
    } catch (error) {
      console.error('Error categorizing expense:', error);
      throw new Error('Failed to categorize expense');
    }
  }

  /**
   * Test AI connection
   */
  static async testConnection(): Promise<{ status: string; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/test/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error testing AI connection:', error);
      return { status: 'error', message: 'Failed to connect to AI service' };
    }
  }

  /**
   * Generate quick financial insights
   */
  static async generateInsights(financialData?: any): Promise<string[]> {
    try {
      // For now, use the chat endpoint to get insights
      const response = await this.sendMessage(
        "Can you give me 3 quick financial insights based on my current situation?"
      );
      
      // Parse the AI response into insights
      const insights = response.ai_response
        .split(/\d+[\.\)]\s*/)
        .filter(insight => insight.trim().length > 10)
        .slice(0, 3);
      
      return insights.length > 0 ? insights : [response.ai_response];
    } catch (error) {
      console.error('Error generating insights:', error);
      return ['Unable to generate insights at this time.'];
    }
  }

  /**
   * Get suggested questions for the user
   */
  static getSuggestedQuestions(): string[] {
    return [
      "How can I improve my credit score?",
      "What's the best way to start investing?",
      "Help me create a budget plan",
      "How much should I save for retirement?",
      "What are some ways to reduce my expenses?",
      "Should I pay off debt or save first?"
    ];
  }
}

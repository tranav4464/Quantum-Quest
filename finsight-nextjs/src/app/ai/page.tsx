'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/molecules/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Avatar from '@/components/atoms/Avatar';
import BottomTabNavigation from '@/components/molecules/BottomTabNavigation';
import { AIService } from '@/lib/ai-service';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'suggestion';
}

const suggestedQuestions = AIService.getSuggestedQuestions();

const quickInsights = [
  {
    id: '1',
    title: 'Budget Alert',
    message: 'You\'re 15% over your dining budget this month',
    type: 'warning',
    icon: '⚠️'
  },
  {
    id: '2',
    title: 'Savings Opportunity',
    message: 'You could save $120/month by reducing subscriptions',
    type: 'tip',
    icon: '💡'
  },
  {
    id: '3',
    title: 'Goal Progress',
    message: 'You\'re on track to reach your vacation goal!',
    type: 'success',
    icon: '🎯'
  }
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI financial assistant. I can help you with budgeting, saving, investing, and answer any financial questions you have. How can I help you today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Get AI response from backend
      const response = await AIService.sendMessage(content.trim());
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.ai_response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback response in case of error
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-medium">
        <div className="max-w-md mx-auto px-6 py-6">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="text-title-2 font-bold">AI Assistant</h1>
              <p className="text-callout opacity-90">Your personal finance advisor</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Insights */}
      {messages.length === 1 && (
        <motion.div 
          className="max-w-md mx-auto px-6 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-headline text-gray-900 mb-3">Quick Insights</h2>
          <div className="space-y-2">
            {quickInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  variant="default" 
                  clickable={true}
                  className="p-3"
                  onClick={() => handleSendMessage(`Tell me more about: ${insight.message}`)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{insight.icon}</span>
                    <div>
                      <h3 className="text-subhead font-semibold text-gray-900">{insight.title}</h3>
                      <p className="text-footnote text-gray-600">{insight.message}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 max-w-md mx-auto w-full px-6 py-4 overflow-y-auto">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar
                    name={message.role === 'user' ? 'You' : 'AI'}
                    size="sm"
                    className={message.role === 'assistant' ? 'bg-primary-500 text-white' : ''}
                  />
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white shadow-soft'
                    }`}
                  >
                    <p className={`text-body ${message.role === 'user' ? 'text-white' : 'text-gray-900'}`}>
                      {message.content}
                    </p>
                    <p className={`text-caption-2 mt-1 ${
                      message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar name="AI" size="sm" className="bg-primary-500 text-white" />
                  <div className="px-4 py-3 rounded-2xl bg-white shadow-soft">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <motion.div 
          className="max-w-md mx-auto px-6 pb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className="text-subhead text-gray-900 mb-3">Suggested Questions</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSuggestionClick(question)}
                  className="text-left whitespace-normal h-auto py-2"
                >
                  {question}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 shadow-soft">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Ask me anything about finance..."
                value={inputValue}
                onChange={setInputValue}
              />
            </div>
            <Button
              variant="primary"
              onClick={() => handleSendMessage(inputValue)}
              isDisabled={!inputValue.trim() || isTyping}
              className="px-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <BottomTabNavigation activeTab="ai-companion" />
    </div>
  );
}

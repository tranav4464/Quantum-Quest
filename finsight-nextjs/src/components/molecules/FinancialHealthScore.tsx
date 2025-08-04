'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HEALTH_SCORE_RANGES } from '@/constants';

export interface FinancialHealthScoreProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showDetails?: boolean;
  className?: string;
  components?: Array<{
    category: string;
    score: number;
    maxScore: number;
    color: string;
  }>;
}

const FinancialHealthScore: React.FC<FinancialHealthScoreProps> = ({
  score,
  maxScore = 850,
  size = 'md',
  showLabel = true,
  showDetails = false,
  className,
  components = [],
}) => {
  const percentage = Math.min((score / maxScore) * 100, 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine score range and color
  const getScoreInfo = () => {
    const ranges = Object.values(HEALTH_SCORE_RANGES);
    for (const range of ranges) {
      if (score >= range.min && score <= range.max) {
        return range;
      }
    }
    return HEALTH_SCORE_RANGES.poor;
  };

  const scoreInfo = getScoreInfo();

  const sizeClasses = {
    sm: { 
      container: 'w-24 h-24',
      text: 'text-lg',
      subtext: 'text-xs',
      strokeWidth: 6 
    },
    md: { 
      container: 'w-32 h-32',
      text: 'text-2xl',
      subtext: 'text-sm',
      strokeWidth: 8 
    },
    lg: { 
      container: 'w-40 h-40',
      text: 'text-3xl',
      subtext: 'text-base',
      strokeWidth: 10 
    },
  };

  const sizeConfig = sizeClasses[size];

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Circular Progress */}
      <div className={cn('relative', sizeConfig.container)}>
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={sizeConfig.strokeWidth}
            className="opacity-20"
          />
          
          {/* Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={scoreInfo.color}
            strokeWidth={sizeConfig.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset }}
            transition={{ 
              duration: 2, 
              ease: "easeOut",
              delay: 0.5 
            }}
            className="drop-shadow-sm"
          />
        </svg>

        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: 1,
              type: "spring",
              damping: 15 
            }}
            className="text-center"
          >
            <div className={cn('font-bold text-gray-900', sizeConfig.text)}>
              {score}
            </div>
            <div className={cn('text-gray-500 font-medium', sizeConfig.subtext)}>
              / {maxScore}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Score Label */}
      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.3 }}
          className="mt-4 text-center"
        >
          <div 
            className="text-lg font-semibold mb-1"
            style={{ color: scoreInfo.color }}
          >
            {scoreInfo.label}
          </div>
          <div className="text-sm text-gray-500">
            Financial Health Score
          </div>
        </motion.div>
      )}

      {/* Score Components Breakdown */}
      {showDetails && components.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.3 }}
          className="mt-6 w-full max-w-xs space-y-3"
        >
          <div className="text-sm font-medium text-gray-700 mb-3">
            Score Breakdown
          </div>
          
          {components.map((component, index) => {
            const componentPercentage = (component.score / component.maxScore) * 100;
            
            return (
              <div key={component.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">
                    {component.category}
                  </span>
                  <span className="font-medium text-gray-900">
                    {component.score}/{component.maxScore}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: component.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${componentPercentage}%` }}
                    transition={{ 
                      duration: 1, 
                      delay: 2.5 + (index * 0.1),
                      ease: "easeOut" 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default FinancialHealthScore;

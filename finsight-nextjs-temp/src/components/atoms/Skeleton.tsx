import React from 'react';
import { cn } from '@/lib/utils';

// Loading skeleton components as per Phase 1 specifications
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'shimmer' | 'pulse' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'shimmer'
}) => {
  const baseStyles = 'bg-gray-200 dark:bg-gray-700';
  
  const variantStyles = {
    text: 'h-4 rounded',
    rectangular: 'rounded',
    circular: 'rounded-full',
    rounded: 'rounded-lg'
  };

  const animationStyles = {
    shimmer: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]',
    pulse: 'animate-pulse',
    none: ''
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};

// Financial Health Score Skeleton
export const FinancialHealthScoreSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
    <div className="flex items-center justify-center">
      <Skeleton variant="circular" width={120} height={120} />
    </div>
    <div className="text-center space-y-2">
      <Skeleton variant="text" width="50%" height={20} className="mx-auto" />
      <Skeleton variant="text" width="70%" height={16} className="mx-auto" />
    </div>
  </div>
);

// Quick Actions Grid Skeleton
export const QuickActionsGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 gap-4">
    {[...Array(4)].map((_, i) => (
      <Skeleton 
        key={i} 
        variant="rounded" 
        height={80} 
        className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"
      />
    ))}
  </div>
);

// Chart Skeleton
export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 200 }) => (
  <div className="space-y-4">
    <div className="flex justify-between">
      <Skeleton variant="text" width="30%" height={20} />
      <Skeleton variant="text" width="20%" height={16} />
    </div>
    <Skeleton variant="rounded" height={height} />
    <div className="flex justify-center space-x-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center space-x-2">
          <Skeleton variant="circular" width={12} height={12} />
          <Skeleton variant="text" width={60} height={14} />
        </div>
      ))}
    </div>
  </div>
);

// Goal Card Skeleton
export const GoalCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="space-y-2">
          <Skeleton variant="text" width={120} height={18} />
          <Skeleton variant="text" width={80} height={14} />
        </div>
      </div>
      <Skeleton variant="text" width={60} height={16} />
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between">
        <Skeleton variant="text" width={80} height={14} />
        <Skeleton variant="text" width={60} height={14} />
      </div>
      <Skeleton variant="rounded" height={8} />
    </div>
    
    <div className="flex justify-between">
      <Skeleton variant="text" width={70} height={14} />
      <Skeleton variant="text" width={50} height={14} />
    </div>
  </div>
);

// Navigation Skeleton
export const NavigationSkeleton: React.FC = () => (
  <div className="flex justify-around py-4 border-t border-gray-200 bg-white">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex flex-col items-center space-y-2">
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width={40} height={12} />
      </div>
    ))}
  </div>
);

// Budget Category Skeleton
export const BudgetCategorySkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-100">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton variant="text" width={100} height={16} />
            <Skeleton variant="text" width={60} height={16} />
          </div>
          <Skeleton variant="rounded" height={6} />
          <div className="flex justify-between">
            <Skeleton variant="text" width={80} height={12} />
            <Skeleton variant="text" width={40} height={12} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Page Loading Skeleton
export const PageLoadingSkeleton: React.FC<{ variant?: 'dashboard' | 'goals' | 'budget' | 'ai' | 'learn' }> = ({ 
  variant = 'dashboard' 
}) => {
  const skeletons = {
    dashboard: (
      <div className="space-y-6 p-4">
        <FinancialHealthScoreSkeleton />
        <QuickActionsGridSkeleton />
        <ChartSkeleton height={160} />
        <div className="space-y-4">
          <Skeleton variant="text" width="40%" height={20} />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-100">
                <Skeleton variant="circular" width={32} height={32} />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" width="70%" height={14} />
                  <Skeleton variant="text" width="50%" height={12} />
                </div>
                <Skeleton variant="text" width={60} height={14} />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    goals: (
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="rounded" width={100} height={36} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 text-center space-y-2">
              <Skeleton variant="text" width="60%" height={14} className="mx-auto" />
              <Skeleton variant="text" width="80%" height={20} className="mx-auto" />
              <Skeleton variant="text" width="40%" height={12} className="mx-auto" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <GoalCardSkeleton key={i} />
          ))}
        </div>
      </div>
    ),
    budget: (
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <Skeleton variant="text" width={150} height={32} />
          <Skeleton variant="rounded" width={120} height={36} />
        </div>
        <ChartSkeleton height={200} />
        <BudgetCategorySkeleton />
      </div>
    ),
    ai: (
      <div className="space-y-4 p-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <Skeleton variant="text" width={150} height={24} />
          <Skeleton variant="circular" width={32} height={32} />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-xs space-y-2 ${i % 2 === 0 ? 'bg-gray-100' : 'bg-primary-100'} rounded-lg p-3`}>
                <Skeleton variant="text" width="100%" height={14} />
                <Skeleton variant="text" width="80%" height={14} />
                <Skeleton variant="text" width="60%" height={12} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2 p-4 border-t border-gray-200">
          <Skeleton variant="rounded" width="100%" height={40} />
          <Skeleton variant="circular" width={40} height={40} />
        </div>
      </div>
    ),
    learn: (
      <div className="space-y-6 p-4">
        <div className="text-center space-y-4">
          <Skeleton variant="text" width="60%" height={32} className="mx-auto" />
          <Skeleton variant="text" width="80%" height={16} className="mx-auto" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
              <Skeleton variant="rounded" height={120} />
              <Skeleton variant="text" width="90%" height={16} />
              <Skeleton variant="text" width="70%" height={14} />
              <div className="flex justify-between">
                <Skeleton variant="text" width={60} height={12} />
                <Skeleton variant="text" width={40} height={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {skeletons[variant]}
    </div>
  );
};

export default Skeleton;

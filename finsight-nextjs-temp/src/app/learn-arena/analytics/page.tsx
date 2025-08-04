'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { learningService, LearningAnalytics } from '@/services/learningService';
import { Card } from '@/components/molecules/Card';
import Button from '@/components/atoms/Button';
import BottomTabNavigation from '@/components/molecules/BottomTabNavigation';

// Animation constants
const springConfig = {
  type: 'spring',
  damping: 25,
  stiffness: 300,
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: springConfig
  }
};

const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="p-6">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${color}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className="text-[var(--color-text-secondary)] text-sm">{title}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const ProgressBar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="text-[var(--color-text-secondary)]">{value} / {max}</span>
      </div>
      <div className="w-full h-3 bg-[var(--color-background-secondary)] rounded-full overflow-hidden">
        <div 
          className={`h-full ${color}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const ActivityCalendar = ({ data }: { data: Record<string, number> }) => {
  // Get dates for the last 3 months
  const getCalendarDates = () => {
    const today = new Date();
    const dates = [];
    
    // Go back 90 days
    for (let i = 90; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    
    return dates;
  };
  
  const dates = getCalendarDates();
  
  // Group dates by week for display
  const weeks = [];
  let currentWeek = [];
  
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    currentWeek.push(date);
    
    if (date.getDay() === 6 || i === dates.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  // Get activity level for a date
  const getActivityLevel = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const activityCount = data[dateString] || 0;
    
    if (activityCount === 0) return 'bg-[var(--color-background-secondary)]';
    if (activityCount < 2) return 'bg-blue-200 dark:bg-blue-900';
    if (activityCount < 4) return 'bg-blue-300 dark:bg-blue-700';
    if (activityCount < 6) return 'bg-blue-400 dark:bg-blue-600';
    return 'bg-blue-500 dark:bg-blue-500';
  };
  
  return (
    <div className="overflow-x-auto pb-2">
      <div className="min-w-max">
        <div className="flex text-xs text-[var(--color-text-secondary)] mb-2">
          <div className="w-8"></div>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <div key={day} className="w-4 mx-1 text-center">{day[0]}</div>
          ))}
        </div>
        
        {weeks.map((week, weekIndex) => {
          // Only show weeks with at least one day in the current month
          const hasCurrentMonth = week.some(date => {
            const today = new Date();
            return date.getMonth() === today.getMonth();
          });
          
          if (!hasCurrentMonth && weekIndex % 2 === 0) return null;
          
          const monthLabel = weekIndex % 4 === 0 ? new Intl.DateTimeFormat('en-US', { month: 'short' }).format(week[0]) : '';
          
          return (
            <div key={weekIndex} className="flex items-center h-6">
              <div className="w-8 text-xs text-[var(--color-text-secondary)]">{monthLabel}</div>
              {Array(7).fill(0).map((_, dayIndex) => {
                const date = week[dayIndex];
                if (!date) return <div key={dayIndex} className="w-4 h-4 mx-1"></div>;
                
                const dateString = date.toISOString().split('T')[0];
                const count = data[dateString] || 0;
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`w-4 h-4 mx-1 rounded-sm ${getActivityLevel(date)}`}
                    title={`${dateString}: ${count} activities`}
                  />
                );
              })}
            </div>
          );
        })}
        
        <div className="flex items-center mt-2 text-xs text-[var(--color-text-secondary)]">
          <div className="w-8 mr-1">Less</div>
          <div className="w-4 h-4 mx-1 rounded-sm bg-[var(--color-background-secondary)]"></div>
          <div className="w-4 h-4 mx-1 rounded-sm bg-blue-200 dark:bg-blue-900"></div>
          <div className="w-4 h-4 mx-1 rounded-sm bg-blue-300 dark:bg-blue-700"></div>
          <div className="w-4 h-4 mx-1 rounded-sm bg-blue-400 dark:bg-blue-600"></div>
          <div className="w-4 h-4 mx-1 rounded-sm bg-blue-500 dark:bg-blue-500"></div>
          <div className="ml-1">More</div>
        </div>
      </div>
    </div>
  );
};

const TopicDistributionChart = ({ data }: { data: Record<string, number> }) => {
  const topics = Object.keys(data);
  const values = Object.values(data);
  const total = values.reduce((sum, val) => sum + val, 0);
  
  // Calculate cumulative percentages for stacked bar
  let cumulative = 0;
  const cumulativePercentages = values.map(value => {
    const percentage = (value / total) * 100;
    cumulative += percentage;
    return cumulative;
  });
  
  // Colors for different topics
  const colors = [
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-teal-500',
    'bg-cyan-500',
  ];
  
  return (
    <div>
      <div className="h-8 w-full bg-[var(--color-background-secondary)] rounded-full overflow-hidden flex">
        {topics.map((topic, index) => {
          const percentage = (values[index] / total) * 100;
          return (
            <div 
              key={topic}
              className={`h-full ${colors[index % colors.length]}`}
              style={{ width: `${percentage}%` }}
              title={`${topic}: ${values[index]} (${percentage.toFixed(1)}%)`}
            />
          );
        })}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        {topics.map((topic, index) => (
          <div key={topic} className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-2`} />
            <span className="text-sm truncate">{topic}</span>
            <span className="text-xs text-[var(--color-text-secondary)] ml-auto">
              {((values[index] / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const analyticsData = await learningService.getLearningAnalytics(timeRange);
        setAnalytics(analyticsData);
      } catch (err: any) {
        console.error('Error fetching learning analytics:', err);
        setError(err.message || 'Failed to load learning analytics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [timeRange]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background-primary)]">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-[var(--color-background-secondary)] rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-[var(--color-background-secondary)] rounded w-2/3 mb-8"></div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-[var(--color-background-secondary)] rounded"></div>
              ))}
            </div>
            
            <div className="h-40 bg-[var(--color-background-secondary)] rounded mb-8"></div>
            <div className="h-40 bg-[var(--color-background-secondary)] rounded"></div>
          </div>
        </div>
        <BottomTabNavigation activeTab="learn-arena" />
      </div>
    );
  }
  
  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-[var(--color-background-primary)]">
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              {error || 'Analytics data not available'}
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              We couldn't load your learning analytics. Please try again later.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push('/learn-arena')}
            >
              Return to Learn Arena
            </Button>
          </div>
        </div>
        <BottomTabNavigation activeTab="learn-arena" />
      </div>
    );
  }
  
  // Mock data for activity calendar if not provided
  const activityData = analytics.activity_by_date || {
    '2023-06-01': 2,
    '2023-06-02': 1,
    '2023-06-05': 3,
    '2023-06-10': 5,
    '2023-06-15': 4,
    '2023-06-20': 2,
    '2023-06-25': 6,
    '2023-07-01': 3,
    '2023-07-05': 4,
    '2023-07-10': 2,
  };
  
  // Mock data for topic distribution if not provided
  const topicDistribution = analytics.topic_distribution || {
    'Investing': 35,
    'Budgeting': 25,
    'Retirement': 15,
    'Taxes': 10,
    'Debt Management': 15,
  };
  
  return (
    <div className="min-h-screen bg-[var(--color-background-primary)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springConfig}
          >
            <Button
              variant="text"
              size="sm"
              className="text-white mb-4 -ml-2"
              onClick={() => router.push('/learn-arena')}
            >
              ← Back to Learn Arena
            </Button>
            
            <h1 className="text-2xl font-semibold mb-2">Learning Analytics</h1>
            <p className="opacity-90">Track your progress and learning habits</p>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Time Range Selector */}
        <div className="flex justify-end mb-6">
          <div className="flex space-x-2">
            <Button
              variant={timeRange === 'week' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTimeRange('week')}
            >
              Week
            </Button>
            <Button
              variant={timeRange === 'month' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTimeRange('month')}
            >
              Month
            </Button>
            <Button
              variant={timeRange === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTimeRange('all')}
            >
              All Time
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard 
            title="Courses Completed" 
            value={analytics.completed_courses || 0}
            icon={<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>}
            color="bg-blue-500"
          />
          
          <StatCard 
            title="Lessons Completed" 
            value={analytics.completed_lessons || 0}
            icon={<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>}
            color="bg-indigo-500"
          />
          
          <StatCard 
            title="Current Streak" 
            value={`${analytics.current_streak || 0} days`}
            icon={<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>}
            color="bg-purple-500"
          />
          
          <StatCard 
            title="Total Points" 
            value={analytics.total_points || 0}
            icon={<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>}
            color="bg-pink-500"
          />
        </motion.div>
        
        {/* Progress Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
          
          <Card className="p-6">
            <ProgressBar 
              label="Courses" 
              value={analytics.completed_courses || 0} 
              max={analytics.total_courses || 10} 
              color="bg-blue-500" 
            />
            
            <ProgressBar 
              label="Lessons" 
              value={analytics.completed_lessons || 0} 
              max={analytics.total_lessons || 50} 
              color="bg-indigo-500" 
            />
            
            <ProgressBar 
              label="Achievements" 
              value={analytics.unlocked_achievements || 0} 
              max={analytics.total_achievements || 20} 
              color="bg-purple-500" 
            />
            
            <ProgressBar 
              label="Daily Challenges" 
              value={analytics.completed_challenges || 0} 
              max={analytics.total_challenges || 30} 
              color="bg-pink-500" 
            />
          </Card>
        </div>
        
        {/* Activity Calendar */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Activity Calendar</h2>
          
          <Card className="p-6">
            <ActivityCalendar data={activityData} />
          </Card>
        </div>
        
        {/* Topic Distribution */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Topic Distribution</h2>
          
          <Card className="p-6">
            <TopicDistributionChart data={topicDistribution} />
          </Card>
        </div>
        
        {/* Learning Time */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Learning Time</h2>
          
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Total Learning Time</h3>
                <div className="flex items-center">
                  <svg className="w-10 h-10 text-[var(--color-primary)] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-3xl font-bold">
                      {analytics.total_time_spent_hours || 0}
                    </div>
                    <div className="text-sm text-[var(--color-text-secondary)]">hours</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Average Session Length</h3>
                <div className="flex items-center">
                  <svg className="w-10 h-10 text-[var(--color-primary)] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-3xl font-bold">
                      {analytics.average_session_minutes || 0}
                    </div>
                    <div className="text-sm text-[var(--color-text-secondary)]">minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomTabNavigation activeTab="learn-arena" />
    </div>
  );
}
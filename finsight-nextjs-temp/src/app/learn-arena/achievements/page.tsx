'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { learningService, Achievement } from '@/services/learningService';
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

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const isLocked = !achievement.unlocked;
  
  return (
    <motion.div variants={itemVariants}>
      <Card className={`p-6 ${isLocked ? 'opacity-60' : ''}`}>
        <div className="flex items-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${isLocked ? 'bg-[var(--color-background-secondary)]' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
            {isLocked ? (
              <svg className="w-8 h-8 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{achievement.title}</h3>
            <p className="text-[var(--color-text-secondary)] text-sm">{achievement.description}</p>
            
            {achievement.unlocked && achievement.unlocked_date && (
              <div className="mt-2 text-xs text-[var(--color-text-secondary)]">
                Unlocked on {new Date(achievement.unlocked_date).toLocaleDateString()}
              </div>
            )}
          </div>
          
          {achievement.points > 0 && (
            <div className="ml-4 bg-[var(--color-background-secondary)] px-3 py-1 rounded-full text-sm font-medium">
              {achievement.points} pts
            </div>
          )}
        </div>
        
        {achievement.progress !== undefined && achievement.progress < 100 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-1">
              <span>Progress</span>
              <span>{achievement.progress}%</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-background-secondary)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--color-primary)]" 
                style={{ width: `${achievement.progress}%` }}
              />
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

const AchievementBadge = ({ achievement }: { achievement: Achievement }) => {
  const isLocked = !achievement.unlocked;
  
  return (
    <motion.div 
      variants={itemVariants}
      className="flex flex-col items-center"
    >
      <div 
        className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 ${isLocked ? 'bg-[var(--color-background-secondary)]' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}
      >
        {isLocked ? (
          <svg className="w-10 h-10 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ) : (
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      
      <h4 className="font-medium text-center text-sm">
        {isLocked ? '???' : achievement.title}
      </h4>
      
      {achievement.points > 0 && (
        <span className="text-xs text-[var(--color-text-secondary)]">
          {achievement.points} pts
        </span>
      )}
    </motion.div>
  );
};

export default function AchievementsPage() {
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<'all' | 'unlocked' | 'locked'>('all');
  
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const achievementsData = await learningService.getAchievements();
        setAchievements(achievementsData);
        
        // Calculate total points from unlocked achievements
        const points = achievementsData
          .filter(a => a.unlocked)
          .reduce((sum, a) => sum + (a.points || 0), 0);
        setTotalPoints(points);
      } catch (err: any) {
        console.error('Error fetching achievements:', err);
        setError(err.message || 'Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAchievements();
  }, []);
  
  const filteredAchievements = achievements.filter(achievement => {
    if (filterMode === 'all') return true;
    if (filterMode === 'unlocked') return achievement.unlocked;
    if (filterMode === 'locked') return !achievement.unlocked;
    return true;
  });
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background-primary)]">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-[var(--color-background-secondary)] rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-[var(--color-background-secondary)] rounded w-2/3 mb-8"></div>
            
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-[var(--color-background-secondary)] rounded mb-4"></div>
            ))}
          </div>
        </div>
        <BottomTabNavigation activeTab="learn-arena" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-background-primary)]">
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              {error}
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              We couldn't load your achievements. Please try again later.
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
  
  return (
    <div className="min-h-screen bg-[var(--color-background-primary)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
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
            
            <h1 className="text-2xl font-semibold mb-2">Your Achievements</h1>
            <p className="opacity-90">Track your progress and earn badges</p>
            
            <div className="mt-4 bg-white/10 rounded-lg p-4 flex items-center">
              <div className="mr-6">
                <div className="text-3xl font-bold">{totalPoints}</div>
                <div className="text-sm opacity-80">Total Points</div>
              </div>
              
              <div className="mr-6">
                <div className="text-3xl font-bold">
                  {achievements.filter(a => a.unlocked).length}
                </div>
                <div className="text-sm opacity-80">Unlocked</div>
              </div>
              
              <div>
                <div className="text-3xl font-bold">
                  {achievements.filter(a => !a.unlocked).length}
                </div>
                <div className="text-sm opacity-80">Locked</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Button
              variant={filterMode === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterMode('all')}
            >
              All
            </Button>
            <Button
              variant={filterMode === 'unlocked' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterMode('unlocked')}
            >
              Unlocked
            </Button>
            <Button
              variant={filterMode === 'locked' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterMode('locked')}
            >
              Locked
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Achievements */}
        {viewMode === 'list' ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredAchievements.length > 0 ? (
              filteredAchievements.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))
            ) : (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                No achievements found for the selected filter.
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4"
          >
            {filteredAchievements.length > 0 ? (
              filteredAchievements.map(achievement => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))
            ) : (
              <div className="text-center py-8 text-[var(--color-text-secondary)] col-span-full">
                No achievements found for the selected filter.
              </div>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <BottomTabNavigation activeTab="learn-arena" />
    </div>
  );
}
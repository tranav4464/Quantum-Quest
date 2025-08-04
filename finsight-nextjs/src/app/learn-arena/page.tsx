'use client';

import React, { useState, useMemo } from 'react';
import { Course, UserAchievement } from '@/services/learningService';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import BottomTabNavigation from '@/components/molecules/BottomTabNavigation';
import { useLearnArena } from '@/hooks/useLearning';

// Animation constants
const springConfig = {
  type: 'spring',
  damping: 25,
  stiffness: 300,
} as const;

// Generate random values for client-only effects
function useClientParticles(count: number) {
  return useMemo(() => {
    if (typeof window === 'undefined') return [];
    return Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 0.5,
      duration: 6 + Math.random() * 4,
    }));
  }, [count]);
}

export default function LearnArenaPage() {
  const {
    courses,
    currentCourse,
    analytics,
    recentAchievements,
    todayChallenge,
    loading,
    error,
    enrollInCourse,
    enrolling,
    attemptChallenge
  } = useLearnArena();

  const [challengeAnswer, setChallengeAnswer] = useState<string>('');
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [challengeResult, setChallengeResult] = useState<any>(null);
  const [submittingChallenge, setSubmittingChallenge] = useState(false);

  // Handle course enrollment
  const handleEnrollCourse = async (courseId: string) => {
    try {
      await enrollInCourse(courseId);
      // Show success message or redirect
    } catch (error) {
      console.error('Enrollment failed:', error);
    }
  };

  // Handle challenge submission
  const handleChallengeAttempt = async (challengeId: string, answer: string) => {
    if (challengeSubmitted || submittingChallenge) return;
    
    try {
      setSubmittingChallenge(true);
      const result = await attemptChallenge(challengeId, answer);
      setChallengeResult(result);
      setChallengeSubmitted(true);
    } catch (error) {
      console.error('Challenge submission failed:', error);
    } finally {
      setSubmittingChallenge(false);
    }
  };

  // Format difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': 
        return 'bg-[var(--color-success)]/20 text-[var(--color-success)]';
      case 'in_progress':
        return 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]';
      default:
        return 'bg-[var(--color-text-secondary)]/20 text-[var(--color-text-secondary)]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-background-primary)] to-[var(--color-background-secondary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading your learning progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-background-primary)] to-[var(--color-background-secondary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--color-error)] mb-4">{error}</p>
          <Button variant="primary" onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.reload();
            }
          }}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background-primary)] to-[var(--color-background-secondary)]">
      {/* Removed Debug Component */}
      
      {/* Header */}
      <div className="border-b border-[var(--color-divider)]">
        <div className="w-full px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springConfig}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                Learn Arena
              </h1>
              <p className="text-[var(--color-text-secondary)] mt-1">
                Master financial literacy through interactive learning
              </p>
            </div>
            {currentCourse && (
              <Button 
                variant="primary" 
                size="md"
                onClick={() => {
                  // Navigate to current course or lesson
                  console.log('Continue learning:', currentCourse);
                }}
              >
                Continue Learning
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Current Course */}
            {currentCourse && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                    Current Course: {currentCourse.course_title}
                  </h2>
                  
                  <div className="bg-[var(--color-background-secondary)] rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[var(--color-text-secondary)]">Progress</span>
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {Math.round(currentCourse.completion_percentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-3 mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${currentCourse.completion_percentage}%` }}
                        transition={{ ...springConfig, delay: 0.3 }}
                        className="h-3 rounded-full bg-[var(--color-primary)]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[var(--color-primary)]">
                          {currentCourse.lessons_completed}
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)]">Lessons Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[var(--color-warning)]">
                          {analytics ? analytics.total_time_spent_hours.toFixed(1) : 0}h
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)]">Time Spent</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      variant="primary" 
                      size="md"
                      onClick={() => {
                        // Navigate to current lesson
                        console.log('Continue lesson:', currentCourse.current_lesson);
                      }}
                    >
                      Continue Lesson
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="md"
                      onClick={() => {
                        // Navigate to course overview
                        console.log('Course overview:', currentCourse.course);
                      }}
                    >
                      Course Overview
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Learning Modules */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    Available Courses
                  </h3>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      // Navigate to all courses
                      console.log('Browse all courses');
                    }}
                  >
                    Browse All
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course: Course, index: number) => {
                    const userCourseProgress = course.user_progress;
                    const isEnrolled = !!userCourseProgress;
                    const progressPercentage = userCourseProgress?.completion_percentage || 0;
                    
                    return (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...springConfig, delay: 0.2 + index * 0.1 }}
                      >
                        <Card 
                          variant="default" 
                          clickable={isEnrolled}
                          className="h-full"
                          onClick={() => {
                            if (isEnrolled) {
                              // Navigate to course or current lesson
                              console.log('Open course:', course);
                            }
                          }}
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] bg-opacity-20 flex items-center justify-center">
                                  <span className="text-lg">📚</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-[var(--color-text-primary)]">
                                    {course.title}
                                  </h4>
                                  <p className="text-xs text-[var(--color-text-secondary)]">
                                    {course.difficulty} • {course.estimated_duration_hours}h
                                  </p>
                                </div>
                              </div>
                              {isEnrolled && (
                                <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)]">
                                  Enrolled
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                              {course.description}
                            </p>
                            
                            {isEnrolled && (
                              <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-[var(--color-text-secondary)]">Progress</span>
                                  <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                                    {Math.round(progressPercentage)}%
                                  </span>
                                </div>
                                <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ ...springConfig, delay: 0.5 + index * 0.1 }}
                                    className="h-2 rounded-full bg-[var(--color-primary)]"
                                  />
                                </div>
                              </div>
                            )}
                            
                            <Button 
                              variant={isEnrolled ? (progressPercentage === 100 ? 'success' : 'primary') : 'primary'} 
                              size="sm" 
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isEnrolled) {
                                  // Navigate to course or current lesson
                                  console.log('Continue course:', course);
                                } else {
                                  enrollInCourse(course.id);
                                }
                              }}
                              disabled={!isEnrolled && enrolling}
                            >
                              {!isEnrolled 
                                ? (enrolling ? 'Enrolling...' : 'Enroll') 
                                : progressPercentage === 100 
                                ? 'Review' 
                                : 'Continue'
                              }
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                  
                  {courses.length === 0 && !loading && (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-[var(--color-text-secondary)]">No courses available</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Achievement Stats */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Your Achievements
                </h3>
                
                <div className="space-y-4">
                  <div className="text-center bg-[var(--color-background-secondary)] rounded-xl p-4">
                    <p className="text-3xl font-bold text-[var(--color-primary)]">
                      {analytics?.total_points_earned || 0}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">Learning Points</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center bg-[var(--color-background-secondary)] rounded-lg p-3">
                      <p className="text-xl font-bold text-[var(--color-success)]">
                        {analytics?.total_courses_completed || 0}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">Courses</p>
                    </div>
                    <div className="text-center bg-[var(--color-background-secondary)] rounded-lg p-3">
                      <p className="text-xl font-bold text-[var(--color-warning)]">
                        {analytics?.total_lessons_completed || 0}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">Lessons</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Badges */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Recent Badges
                </h3>
                
                <div className="space-y-3">
                  {recentAchievements.length > 0 ? (
                    recentAchievements.map((userAchievement: UserAchievement, index: number) => (
                      <motion.div
                        key={userAchievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...springConfig, delay: 0.3 + index * 0.1 }}
                        className="flex items-center space-x-3 bg-[var(--color-background-secondary)] rounded-lg p-3"
                      >
                        <span className="text-2xl">🏆</span>
                        <div>
                          <p className="font-medium text-[var(--color-text-primary)]">
                            {userAchievement.achievement.title}
                          </p>
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            {userAchievement.achievement.description}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        No achievements yet. Complete courses to earn badges!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Daily Challenge */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Daily Challenge
                </h3>
                
                {todayChallenge ? (
                  <div className="bg-[var(--color-background-secondary)] rounded-xl p-4">
                    <h4 className="font-medium text-[var(--color-text-primary)] mb-2">
                      {todayChallenge.title}
                    </h4>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                      {todayChallenge.question}
                    </p>
                    
                    <div className="space-y-3">
                      {todayChallenge.options?.map((option: string, index: number) => (
                        <Button 
                          key={index}
                          variant="outlined" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleChallengeAttempt(todayChallenge.id, option)}
                          disabled={submittingChallenge}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-[var(--color-divider)]">
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        Complete to earn {todayChallenge.points_reward} points
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[var(--color-background-secondary)] rounded-xl p-4 text-center">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      No daily challenge available
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomTabNavigation activeTab="learn-arena" />
    </div>
  );
}

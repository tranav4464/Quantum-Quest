'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { learningService, Course, UserAchievement, DailyChallenge, LearningAnalytics } from '@/services/learningService';

/**
 * Custom hook for Learn Arena functionality
 * Provides data and functions for the Learn Arena page
 */
export function useLearnArena() {
  const router = useRouter();
  
  // State for learning data
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [recentAchievements, setRecentAchievements] = useState<UserAchievement[]>([]);
  const [todayChallenge, setTodayChallenge] = useState<DailyChallenge | null>(null);
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null);
  
  // Loading and error states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  
  // Fetch all learning data on component mount
  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Initialize auth if needed
        await learningService.initializeAuth();
        
        // Fetch courses
        const coursesData = await learningService.getCourses();
        // Ensure coursesData is an array
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        
        // Fetch user progress to find current course
        const progressData = await learningService.getUserProgress();
        if (progressData && progressData.length > 0) {
          // Find the most recently accessed course
          const sortedProgress = [...progressData].sort(
            (a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime()
          );
          
          if (sortedProgress.length > 0) {
            setCurrentCourse(sortedProgress[0]);
          }
        }
        
        // Fetch analytics
        const analyticsData = await learningService.getLearningAnalytics();
        setAnalytics(analyticsData);
        setRecentAchievements(analyticsData.recent_achievements || []);
        
        // Fetch daily challenge
        const challenges = await learningService.getDailyChallenges();
        if (challenges && challenges.length > 0) {
          // Find today's challenge
          const today = new Date().toISOString().split('T')[0];
          const todaysChallenge = challenges.find(
            (challenge) => challenge.date_available.split('T')[0] === today
          );
          
          if (todaysChallenge) {
            setTodayChallenge(todaysChallenge);
          }
        }
      } catch (err: any) {
        console.error('Error fetching learning data:', err);
        setError(err.message || 'Failed to load learning content');
        // Initialize courses as empty array in case of error
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLearningData();
  }, []);
  
  // Function to enroll in a course
  const enrollInCourse = async (courseId: string) => {
    try {
      setEnrolling(true);
      const result = await learningService.enrollInCourse(courseId);
      
      // Update current course after enrollment
      if (result && result.progress) {
        setCurrentCourse(result.progress);
        
        // Refresh courses to update enrollment status
        const updatedCourses = await learningService.getCourses();
        // Ensure updatedCourses is an array
        setCourses(Array.isArray(updatedCourses) ? updatedCourses : []);
      }
      
      return result;
    } catch (err: any) {
      console.error('Error enrolling in course:', err);
      throw err;
    } finally {
      setEnrolling(false);
    }
  };
  
  // Function to attempt a daily challenge
  const attemptChallenge = async (challengeId: string, answer: any) => {
    try {
      const result = await learningService.attemptDailyChallenge(challengeId, answer);
      
      // Update challenge with attempt result
      if (todayChallenge && todayChallenge.id === challengeId) {
        setTodayChallenge({
          ...todayChallenge,
          user_attempt: result.attempt,
          is_completed: true
        });
      }
      
      // Refresh analytics to update points
      const updatedAnalytics = await learningService.getLearningAnalytics();
      setAnalytics(updatedAnalytics);
      
      return result;
    } catch (err: any) {
      console.error('Error attempting challenge:', err);
      throw err;
    }
  };
  
  // Navigate to course detail page
  const navigateToCourse = (courseId: string) => {
    router.push(`/learn-arena/course/${courseId}`);
  };
  
  // Navigate to lesson detail page
  const navigateToLesson = (courseId: string, lessonId: string) => {
    router.push(`/learn-arena/course/${courseId}/lesson/${lessonId}`);
  };
  
  return {
    courses,
    currentCourse,
    analytics,
    recentAchievements,
    todayChallenge,
    loading,
    error,
    enrollInCourse,
    enrolling,
    attemptChallenge,
    navigateToCourse,
    navigateToLesson
  };
}
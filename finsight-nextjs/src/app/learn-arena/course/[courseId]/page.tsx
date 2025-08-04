'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { learningService, Course, Lesson } from '@/services/learningService';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import BottomTabNavigation from '@/components/molecules/BottomTabNavigation';

// Animation constants
const springConfig = {
  type: 'spring',
  damping: 25,
  stiffness: 300,
} as const;

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch course details
        const courseData = await learningService.getCourse(courseId);
        setCourse(courseData);
        
        // Fetch lessons for this course
        const lessonsData = await learningService.getLessons(courseId);
        setLessons(lessonsData);
      } catch (err: any) {
        console.error('Error fetching course details:', err);
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);
  
  const handleStartLesson = async (lessonId: string) => {
    try {
      // Start the lesson
      await learningService.startLesson(lessonId);
      
      // Navigate to lesson page
      router.push(`/learn-arena/course/${courseId}/lesson/${lessonId}`);
    } catch (err: any) {
      console.error('Error starting lesson:', err);
      // Show error message to user
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background-primary)]">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-[var(--color-background-secondary)] rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-[var(--color-background-secondary)] rounded w-2/3 mb-8"></div>
            
            <div className="h-40 bg-[var(--color-background-secondary)] rounded mb-6"></div>
            
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-[var(--color-background-secondary)] rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <BottomTabNavigation activeTab="learn-arena" />
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="min-h-screen bg-[var(--color-background-primary)]">
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              {error || 'Course not found'}
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              We couldn't load this course. Please try again later.
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
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
            
            <h1 className="text-2xl font-semibold mb-2">{course.title}</h1>
            <p className="opacity-90 mb-4">{course.description}</p>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {course.estimated_duration_formatted}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {course.total_lessons} Lessons
              </span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig, delay: 0.1 }}
        >
          {/* Learning Objectives */}
          <Card className="mb-8">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                Learning Objectives
              </h3>
              <ul className="space-y-2">
                {course.learning_objectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[var(--color-primary)] mr-2">✓</span>
                    <span className="text-[var(--color-text-secondary)]">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
          
          {/* Lessons */}
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            Course Content
          </h3>
          
          <div className="space-y-4 mb-8">
            {lessons.map((lesson, index) => {
              const isCompleted = course.user_progress?.lesson_progress?.some(
                (progress) => progress.lesson === lesson.id && progress.status === 'completed'
              );
              
              const isInProgress = course.user_progress?.lesson_progress?.some(
                (progress) => progress.lesson === lesson.id && progress.status === 'in_progress'
              );
              
              return (
                <Card key={lesson.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <span className="w-6 h-6 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center mr-3 text-sm">
                            {index + 1}
                          </span>
                          <h4 className="text-[var(--color-text-primary)] font-medium">
                            {lesson.title}
                          </h4>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1 ml-9">
                          {lesson.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center">
                        {isCompleted ? (
                          <span className="text-[var(--color-success)] text-sm mr-4 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Completed
                          </span>
                        ) : isInProgress ? (
                          <span className="text-[var(--color-warning)] text-sm mr-4 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            In Progress
                          </span>
                        ) : null}
                        
                        <Button
                          variant={isCompleted ? "secondary" : "primary"}
                          size="sm"
                          onClick={() => handleStartLesson(lesson.id)}
                        >
                          {isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 ml-9 flex items-center text-xs text-[var(--color-text-secondary)]">
                      <span className="flex items-center mr-4">
                        <svg className="w-4 h-4 mr-1 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {lesson.estimated_duration_formatted}
                      </span>
                      
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        {lesson.lesson_type.charAt(0).toUpperCase() + lesson.lesson_type.slice(1)}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomTabNavigation activeTab="learn-arena" />
    </div>
  );
}
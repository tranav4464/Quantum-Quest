// Learning API Service - Frontend integration with learning management system
import axios, { AxiosInstance } from 'axios';
import { initializeDemoAuth } from '../lib/demo-auth';

// API Configuration - Use same pattern as existing API service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types for learning system
export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration_hours: number;
  estimated_duration_formatted: string;
  status: 'draft' | 'active' | 'archived';
  learning_objectives: string[];
  tags: string[];
  order: number;
  lessons: Lesson[];
  total_lessons: number;
  user_progress?: UserCourseProgress;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  lesson_type: 'video' | 'reading' | 'interactive' | 'quiz';
  order: number;
  content: any;
  estimated_duration_minutes: number;
  estimated_duration_formatted: string;
  is_required: boolean;
  passing_score: number;
}

export interface UserCourseProgress {
  id: string;
  course: string;
  course_title: string;
  course_icon: string;
  status: 'not_started' | 'in_progress' | 'completed';
  lessons_completed: number;
  total_time_spent_minutes: number;
  current_lesson?: string;
  current_lesson_title?: string;
  started_at?: string;
  completed_at?: string;
  last_accessed: string;
  average_score: number;
  completion_percentage: number;
  lesson_progress: UserLessonProgress[];
}

export interface UserLessonProgress {
  id: string;
  lesson: string;
  lesson_title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  time_spent_minutes: number;
  attempts: number;
  passed: boolean;
  started_at?: string;
  completed_at?: string;
  last_accessed: string;
  user_responses: any;
  notes: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  achievement_type: string;
  requirements: any;
  points: number;
  points_awarded: number;
  unlocked: boolean;
  is_earned: boolean;
  unlocked_date?: string;
  earned_date?: string;
  progress?: number;
}

export interface UserAchievement {
  id: string;
  achievement: Achievement;
  earned_at: string;
  points_earned: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  question: string;
  challenge_type: 'multiple_choice' | 'true_false' | 'input';
  options: string[];
  explanation: string;
  points: number;
  points_reward: number;
  date_available: string;
  due_date?: string;
  user_attempt?: UserChallengeAttempt;
  is_completed: boolean;
  completed: boolean;
  completed_date?: string;
  is_today: boolean;
  locked: boolean;
  content?: any;
}

export interface UserChallengeAttempt {
  id: string;
  challenge: string;
  challenge_title: string;
  user_answer: any;
  is_correct: boolean;
  points_earned: number;
  time_taken_seconds: number;
  attempted_at: string;
}

export interface LearningAnalytics {
  total_courses_enrolled: number;
  total_courses_completed: number;
  completed_courses: number;
  total_courses: number;
  total_lessons_completed: number;
  completed_lessons: number;
  total_lessons: number;
  total_time_spent_hours: number;
  average_session_minutes: number;
  total_points_earned: number;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  unlocked_achievements: number;
  total_achievements: number;
  completed_challenges: number;
  total_challenges: number;
  recent_achievements: UserAchievement[];
  course_progress: UserCourseProgress[];
  activity_by_date?: Record<string, number>;
  topic_distribution?: Record<string, number>;
}

// API Service Class
class LearningService {
  private apiClient: AxiosInstance;
  private isInitialized = false;

  constructor() {
    this.apiClient = axios.create({
      baseURL: `${API_BASE_URL}/learning`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.apiClient.interceptors.request.use(async (config) => {
      // Only run in browser environment
      if (typeof window !== 'undefined') {
        // Auto-initialize demo auth if no token exists
        await this.ensureAuthenticated();
        
        const token = localStorage.getItem('auth_token'); // Use same key as main API service
        if (token) {
          config.headers.Authorization = `Token ${token}`; // Use same format as main API service
        }
      }
      return config;
    });

    // Response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          console.log('Authentication error, trying to initialize demo auth...');
          try {
            await initializeDemoAuth();
            // Retry the original request with the new token
            const token = localStorage.getItem('auth_token');
            if (token) {
              error.config.headers.Authorization = `Token ${token}`;
              return this.apiClient.request(error.config);
            }
          } catch (authError) {
            console.error('Failed to initialize demo auth:', authError);
          }
        }
        console.error('Learning API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // Ensure user is authenticated before making API calls
  private async ensureAuthenticated(): Promise<void> {
    if (this.isInitialized) return;
    
    // Only run in browser environment
    if (typeof window === 'undefined') {
      this.isInitialized = true;
      return;
    }
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('No auth token found, initializing demo authentication...');
      try {
        await initializeDemoAuth();
        console.log('Demo authentication initialized successfully');
      } catch (error) {
        console.error('Failed to initialize demo authentication:', error);
      }
    }
    this.isInitialized = true;
  }

  // Public method to manually initialize authentication
  async initializeAuth(): Promise<void> {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    this.isInitialized = false; // Force re-initialization
    await this.ensureAuthenticated();
  }

  private async handleRequest<T>(request: Promise<any>): Promise<T> {
    try {
      const response = await request;
      return response.data;
    } catch (error: any) {
      throw new Error(handleLearningApiError(error));
    }
  }

  // Course Management
  async getCourses(): Promise<Course[]> {
    return this.handleRequest(this.apiClient.get('/api/courses/'));
  }

  async getCourse(courseId: string): Promise<Course> {
    return this.handleRequest(this.apiClient.get(`/api/courses/${courseId}/`));
  }

  async enrollInCourse(courseId: string): Promise<{ message: string; progress: UserCourseProgress }> {
    return this.handleRequest(this.apiClient.post(`/api/courses/${courseId}/enroll/`));
  }

  async getCourseProgress(courseId: string): Promise<UserCourseProgress> {
    return this.handleRequest(this.apiClient.get(`/api/courses/${courseId}/progress/`));
  }

  // Lesson Management
  async getLessons(courseId?: string): Promise<Lesson[]> {
    const query = courseId ? `?course=${courseId}` : '';
    return this.handleRequest(this.apiClient.get(`/api/lessons/${query}`));
  }

  async startLesson(lessonId: string): Promise<{ message: string; progress: UserLessonProgress }> {
    return this.handleRequest(this.apiClient.post(`/api/lessons/${lessonId}/start/`));
  }

  async completeLesson(
    lessonId: string, 
    data: {
      score?: number;
      time_spent_minutes?: number;
      user_responses?: any;
      notes?: string;
    }
  ): Promise<{
    message: string;
    lesson_progress: UserLessonProgress;
    course_progress: UserCourseProgress;
  }> {
    return this.handleRequest(this.apiClient.post(`/api/lessons/${lessonId}/complete/`, data));
  }

  // Progress Tracking
  async getUserProgress(): Promise<UserCourseProgress[]> {
    return this.handleRequest(this.apiClient.get('/api/progress/'));
  }

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    return this.handleRequest(this.apiClient.get('/api/achievements/'));
  }

  async getUserAchievements(): Promise<UserAchievement[]> {
    return this.handleRequest(this.apiClient.get('/api/my-achievements/'));
  }

  // Daily Challenges
  async getDailyChallenges(): Promise<DailyChallenge[]> {
    return this.handleRequest(this.apiClient.get('/api/daily-challenges/'));
  }

  async attemptDailyChallenge(
    challengeId: string, 
    answer: any
  ): Promise<{
    message: string;
    is_correct: boolean;
    points_earned: number;
    explanation: string;
    attempt: UserChallengeAttempt;
  }> {
    return this.handleRequest(this.apiClient.post(`/api/daily-challenges/${challengeId}/attempt/`, { answer }));
  }

  // Analytics
  async getLearningAnalytics(timeRange?: 'week' | 'month' | 'all'): Promise<LearningAnalytics> {
    const query = timeRange ? `?time_range=${timeRange}` : '';
    return this.handleRequest(this.apiClient.get(`/api/analytics/${query}`));
  }
}

// Export singleton instance
export const learningService = new LearningService();

// Error handler for learning API calls
export const handleLearningApiError = (error: any) => {
  console.error('Learning API Error Details:', {
    message: error?.message,
    response: error?.response?.data,
    status: error?.response?.status,
    config: {
      url: error?.config?.url,
      method: error?.config?.method,
      baseURL: error?.config?.baseURL
    }
  });
  
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return 'Network error. Please check your connection and ensure the backend server is running.';
  }
  
  if (error.response?.status === 401 || error.message?.includes('Authentication')) {
    return 'Authentication failed. Please refresh the page to try again.';
  }
  
  if (error.response?.status === 404 || error.message?.includes('404')) {
    return 'API endpoint not found. Please check backend configuration.';
  }
  
  if (error.response?.status === 403 || error.message?.includes('403')) {
    return 'Access denied to this content';
  }
  
  if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  }
  
  return 'Unable to load learning content. Please try again later.';
};

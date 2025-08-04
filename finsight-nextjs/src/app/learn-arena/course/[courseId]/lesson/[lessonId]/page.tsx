'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { learningService, Lesson, Course } from '@/services/learningService';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import BottomTabNavigation from '@/components/molecules/BottomTabNavigation';

// Animation constants
const springConfig = {
  type: 'spring',
  damping: 25,
  stiffness: 300,
} as const;

// Lesson content components based on type
const VideoLesson = ({ content }: { content: any }) => (
  <div className="space-y-4">
    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
      {content.video_url ? (
        <iframe 
          className="w-full h-full rounded-lg" 
          src={content.video_url} 
          title="Lesson Video"
          allowFullScreen
        />
      ) : (
        <div className="text-white text-center p-8">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          <p>Video demonstration would be displayed here</p>
        </div>
      )}
    </div>
    
    {content.topics && content.topics.length > 0 && (
      <div className="mt-4">
        <h4 className="font-medium mb-2">Topics Covered:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {content.topics.map((topic: string, index: number) => (
            <li key={index} className="text-[var(--color-text-secondary)]">{topic}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const ReadingLesson = ({ content }: { content: any }) => (
  <div className="prose prose-sm max-w-none">
    {content.sections && content.sections.map((section: any, index: number) => (
      <div key={index} className="mb-6">
        {section.title && <h3 className="text-lg font-medium mb-3">{section.title}</h3>}
        {section.content && (
          <div className="text-[var(--color-text-secondary)] space-y-4">
            {section.content.split('\n\n').map((paragraph: string, pIndex: number) => (
              <p key={pIndex}>{paragraph}</p>
            ))}
          </div>
        )}
        {section.image_url && (
          <img 
            src={section.image_url} 
            alt={section.image_alt || section.title} 
            className="my-4 rounded-lg w-full max-w-2xl"
          />
        )}
      </div>
    ))}
  </div>
);

const InteractiveLesson = ({ content }: { content: any }) => (
  <div className="space-y-6">
    {content.interactive_type === 'simulation' && (
      <div className="bg-[var(--color-background-secondary)] p-6 rounded-lg text-center">
        <p className="text-[var(--color-text-secondary)] mb-4">
          Interactive financial simulation would be displayed here
        </p>
        <div className="flex justify-center">
          <Button variant="primary" size="md">
            Start Simulation
          </Button>
        </div>
      </div>
    )}
    
    {content.interactive_type === 'calculator' && (
      <div className="bg-[var(--color-background-secondary)] p-6 rounded-lg">
        <h4 className="font-medium mb-4">Financial Calculator</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Initial Investment</label>
            <input 
              type="number" 
              className="w-full p-2 border border-[var(--color-divider)] rounded-md bg-[var(--color-background-primary)]"
              placeholder="$1,000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Annual Return (%)</label>
            <input 
              type="number" 
              className="w-full p-2 border border-[var(--color-divider)] rounded-md bg-[var(--color-background-primary)]"
              placeholder="7"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time Period (years)</label>
            <input 
              type="number" 
              className="w-full p-2 border border-[var(--color-divider)] rounded-md bg-[var(--color-background-primary)]"
              placeholder="10"
            />
          </div>
          <Button variant="primary" size="md" className="w-full">
            Calculate
          </Button>
        </div>
      </div>
    )}
  </div>
);

const QuizLesson = ({ content, onComplete }: { content: any; onComplete: (score: number) => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  const handleAnswer = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };
  
  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    content.questions.forEach((question: any, index: number) => {
      if (answers[index] === question.correct_answer) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / content.questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
    onComplete(finalScore);
  };
  
  if (!content.questions || content.questions.length === 0) {
    return (
      <div className="text-center p-8 bg-[var(--color-background-secondary)] rounded-lg">
        <p className="text-[var(--color-text-secondary)]">No quiz questions available</p>
      </div>
    );
  }
  
  if (submitted) {
    return (
      <div className="p-6 bg-[var(--color-background-secondary)] rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-2">Quiz Completed!</h3>
        <p className="text-[var(--color-text-secondary)] mb-4">
          Your score: {score}%
        </p>
        <div className="w-full max-w-xs mx-auto h-4 bg-[var(--color-background-primary)] rounded-full overflow-hidden mb-6">
          <div 
            className={`h-full ${score >= 70 ? 'bg-[var(--color-success)]' : 'bg-[var(--color-warning)]'}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <Button 
          variant="primary" 
          size="md"
          onClick={() => {
            setSubmitted(false);
            setCurrentQuestion(0);
            setAnswers({});
          }}
        >
          Retake Quiz
        </Button>
      </div>
    );
  }
  
  const question = content.questions[currentQuestion];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Question {currentQuestion + 1} of {content.questions.length}</h4>
        <span className="text-sm text-[var(--color-text-secondary)]">
          {Object.keys(answers).length} of {content.questions.length} answered
        </span>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option: string, index: number) => (
            <button
              key={index}
              className={`w-full p-3 rounded-lg text-left transition-colors ${answers[currentQuestion] === option ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-background-secondary)] hover:bg-[var(--color-background-secondary-hover)]'}`}
              onClick={() => handleAnswer(currentQuestion, option)}
            >
              {option}
            </button>
          ))}
        </div>
      </Card>
      
      <div className="flex justify-between">
        <Button
          variant="secondary"
          size="md"
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(prev => prev - 1)}
        >
          Previous
        </Button>
        
        {currentQuestion < content.questions.length - 1 ? (
          <Button
            variant="primary"
            size="md"
            disabled={!answers[currentQuestion]}
            onClick={() => setCurrentQuestion(prev => prev + 1)}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            disabled={Object.keys(answers).length !== content.questions.length}
            onClick={handleSubmit}
          >
            Submit Quiz
          </Button>
        )}
      </div>
    </div>
  );
};

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [completing, setCompleting] = useState<boolean>(false);
  
  // Timer for tracking time spent
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch course details
        const courseData = await learningService.getCourse(courseId);
        setCourse(courseData);
        
        // Find the specific lesson
        const lessonsData = await learningService.getLessons(courseId);
        const lessonData = lessonsData.find(l => l.id === lessonId);
        
        if (lessonData) {
          setLesson(lessonData);
        } else {
          setError('Lesson not found');
        }
      } catch (err: any) {
        console.error('Error fetching lesson details:', err);
        setError(err.message || 'Failed to load lesson details');
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId && lessonId) {
      fetchLessonDetails();
    }
  }, [courseId, lessonId]);
  
  const handleCompleteLesson = async (score?: number) => {
    if (!lesson) return;
    
    try {
      setCompleting(true);
      
      // Complete the lesson
      await learningService.completeLesson(lessonId, {
        score: score,
        time_spent_minutes: timeSpent,
      });
      
      // Navigate back to course page
      router.push(`/learn-arena/course/${courseId}`);
    } catch (err: any) {
      console.error('Error completing lesson:', err);
      // Show error message to user
    } finally {
      setCompleting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background-primary)]">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-[var(--color-background-secondary)] rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-[var(--color-background-secondary)] rounded w-2/3 mb-8"></div>
            
            <div className="h-80 bg-[var(--color-background-secondary)] rounded mb-6"></div>
          </div>
        </div>
        <BottomTabNavigation activeTab="learn-arena" />
      </div>
    );
  }
  
  if (error || !lesson || !course) {
    return (
      <div className="min-h-screen bg-[var(--color-background-primary)]">
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              {error || 'Lesson not found'}
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              We couldn't load this lesson. Please try again later.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push(`/learn-arena/course/${courseId}`)}
            >
              Return to Course
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
              onClick={() => router.push(`/learn-arena/course/${courseId}`)}
            >
              ← Back to Course
            </Button>
            
            <div className="flex items-center mb-2">
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full mr-3">
                {lesson.lesson_type.charAt(0).toUpperCase() + lesson.lesson_type.slice(1)}
              </span>
              <h1 className="text-2xl font-semibold">{lesson.title}</h1>
            </div>
            
            <p className="opacity-90">{lesson.description}</p>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="mb-8">
            <div className="p-6">
              {/* Render different content based on lesson type */}
              {lesson.lesson_type === 'video' && (
                <VideoLesson content={lesson.content} />
              )}
              
              {lesson.lesson_type === 'reading' && (
                <ReadingLesson content={lesson.content} />
              )}
              
              {lesson.lesson_type === 'interactive' && (
                <InteractiveLesson content={lesson.content} />
              )}
              
              {lesson.lesson_type === 'quiz' && (
                <QuizLesson 
                  content={lesson.content} 
                  onComplete={handleCompleteLesson} 
                />
              )}
            </div>
          </Card>
          
          {/* Action buttons */}
          {lesson.lesson_type !== 'quiz' && (
            <div className="flex justify-between">
              <Button
                variant="secondary"
                size="md"
                onClick={() => router.push(`/learn-arena/course/${courseId}`)}
              >
                Back to Course
              </Button>
              
              <Button
                variant="primary"
                size="md"
                onClick={() => handleCompleteLesson()}
                isLoading={completing}
              >
                Mark as Completed
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomTabNavigation activeTab="learn-arena" />
    </div>
  );
}
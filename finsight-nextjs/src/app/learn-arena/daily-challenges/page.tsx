'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { learningService, DailyChallenge } from '@/services/learningService';
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

const ChallengeCard = ({ 
  challenge, 
  onAttempt 
}: { 
  challenge: DailyChallenge; 
  onAttempt: (challenge: DailyChallenge) => void;
}) => {
  const isCompleted = challenge.completed;
  const isAvailable = !challenge.locked;
  
  return (
    <motion.div variants={itemVariants}>
      <Card className={`p-6 ${!isAvailable ? 'opacity-60' : ''}`}>
        <div className="flex items-start">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${isCompleted ? 'bg-[var(--color-success)]' : isAvailable ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-background-secondary)]'}`}>
            {isCompleted ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : isAvailable ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg mb-1">{challenge.title}</h3>
              
              {challenge.points > 0 && (
                <div className="ml-2 bg-[var(--color-background-secondary)] px-3 py-1 rounded-full text-sm font-medium">
                  {challenge.points} pts
                </div>
              )}
            </div>
            
            <p className="text-[var(--color-text-secondary)] text-sm mb-3">{challenge.description}</p>
            
            {challenge.due_date && (
              <div className="text-xs text-[var(--color-text-secondary)] mb-3">
                Available until: {new Date(challenge.due_date).toLocaleDateString()}
              </div>
            )}
            
            {isCompleted ? (
              <div className="flex items-center text-[var(--color-success)] text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Completed
                {challenge.completed_date && (
                  <span className="ml-1">on {new Date(challenge.completed_date).toLocaleDateString()}</span>
                )}
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                disabled={!isAvailable}
                onClick={() => onAttempt(challenge)}
              >
                {isAvailable ? 'Attempt Challenge' : 'Locked'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const ChallengeAttemptModal = ({ 
  challenge, 
  onClose, 
  onComplete 
}: { 
  challenge: DailyChallenge; 
  onClose: () => void; 
  onComplete: (success: boolean) => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  
  const handleAnswer = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };
  
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Submit answers to the backend
      const result = await learningService.attemptDailyChallenge(challenge.id, {
        answers: Object.values(answers)
      });
      
      onComplete(result.is_correct);
    } catch (error) {
      console.error('Error submitting challenge:', error);
      onComplete(false);
    }
  };
  
  // Mock challenge content structure
  const questions = challenge.content?.questions || [
    {
      question: "What is the primary purpose of diversification in investing?",
      options: [
        "To maximize returns",
        "To reduce risk",
        "To avoid taxes",
        "To increase dividend income"
      ],
      correct_answer: "To reduce risk"
    },
    {
      question: "Which of the following is NOT typically considered a defensive stock?",
      options: [
        "Utilities",
        "Healthcare",
        "Technology",
        "Consumer staples"
      ],
      correct_answer: "Technology"
    }
  ];
  
  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={springConfig}
        className="bg-[var(--color-background-primary)] rounded-xl max-w-md w-full max-h-[90vh] overflow-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{challenge.title}</h2>
            <button 
              onClick={onClose}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mb-2">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Object.keys(answers).length} answered</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-background-secondary)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--color-primary)]" 
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option: string, index: number) => (
                <button
                  key={index}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${answers[currentStep] === option ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-background-secondary)] hover:bg-[var(--color-background-secondary-hover)]'}`}
                  onClick={() => handleAnswer(currentStep, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="secondary"
              size="md"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              Previous
            </Button>
            
            {!isLastQuestion ? (
              <Button
                variant="primary"
                size="md"
                disabled={!answers[currentStep]}
                onClick={() => setCurrentStep(prev => prev + 1)}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                disabled={!answers[currentStep] || submitting}
                isLoading={submitting}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ChallengeResultModal = ({ 
  success, 
  onClose 
}: { 
  success: boolean; 
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={springConfig}
        className="bg-[var(--color-background-primary)] rounded-xl max-w-md w-full"
      >
        <div className="p-6 text-center">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${success ? 'bg-[var(--color-success)]' : 'bg-[var(--color-error)]'}`}>
            {success ? (
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          
          <h2 className="text-xl font-semibold mb-2">
            {success ? 'Challenge Completed!' : 'Challenge Failed'}
          </h2>
          
          <p className="text-[var(--color-text-secondary)] mb-6">
            {success 
              ? 'Congratulations! You have successfully completed this challenge and earned points.'
              : 'You didn\'t pass this challenge. Don\'t worry, you can try again tomorrow with a new challenge.'}
          </p>
          
          <Button
            variant="primary"
            size="md"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default function DailyChallengesPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<DailyChallenge | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [challengeSuccess, setChallengeSuccess] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const challengesData = await learningService.getDailyChallenges();
        setChallenges(challengesData);
        
        // Get streak information
        const analyticsData = await learningService.getLearningAnalytics();
        setStreak(analyticsData.current_streak || 0);
      } catch (err: any) {
        console.error('Error fetching daily challenges:', err);
        setError(err.message || 'Failed to load daily challenges');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChallenges();
  }, []);
  
  const handleAttemptChallenge = (challenge: DailyChallenge) => {
    setSelectedChallenge(challenge);
  };
  
  const handleCloseAttempt = () => {
    setSelectedChallenge(null);
  };
  
  const handleChallengeComplete = async (success: boolean) => {
    setSelectedChallenge(null);
    setChallengeSuccess(success);
    setShowResultModal(true);
    
    if (success) {
      // Refresh challenges to update the completed status
      try {
        const challengesData = await learningService.getDailyChallenges();
        setChallenges(challengesData);
        
        // Update streak information
        const analyticsData = await learningService.getLearningAnalytics();
        setStreak(analyticsData.current_streak || 0);
      } catch (err) {
        console.error('Error refreshing challenges:', err);
      }
    }
  };
  
  const handleCloseResult = () => {
    setShowResultModal(false);
  };
  
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
              We couldn't load your daily challenges. Please try again later.
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
  
  const todayChallenge = challenges.find(c => c.is_today);
  const pastChallenges = challenges.filter(c => !c.is_today && c.completed);
  const upcomingChallenges = challenges.filter(c => !c.is_today && !c.completed);
  
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
            
            <h1 className="text-2xl font-semibold mb-2">Daily Challenges</h1>
            <p className="opacity-90">Complete daily challenges to earn points and maintain your streak</p>
            
            <div className="mt-4 bg-white/10 rounded-lg p-4 flex items-center">
              <div className="mr-6 flex items-center">
                <svg className="w-8 h-8 mr-2 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="text-2xl font-bold">{streak}</div>
                  <div className="text-xs opacity-80">Day Streak</div>
                </div>
              </div>
              
              <div className="mr-6">
                <div className="text-2xl font-bold">
                  {challenges.filter(c => c.completed).length}
                </div>
                <div className="text-xs opacity-80">Completed</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold">
                  {challenges.reduce((sum, c) => sum + (c.completed ? c.points : 0), 0)}
                </div>
                <div className="text-xs opacity-80">Points Earned</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Today's Challenge */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Today's Challenge</h2>
          
          {todayChallenge ? (
            <ChallengeCard 
              challenge={todayChallenge} 
              onAttempt={handleAttemptChallenge} 
            />
          ) : (
            <Card className="p-6 text-center">
              <svg className="w-16 h-16 mx-auto text-[var(--color-text-secondary)] mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-medium mb-2">No Challenge Available</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                There is no challenge available for today. Check back tomorrow!
              </p>
            </Card>
          )}
        </div>
        
        {/* Past Challenges */}
        {pastChallenges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Past Challenges</h2>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {pastChallenges.map(challenge => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  onAttempt={handleAttemptChallenge} 
                />
              ))}
            </motion.div>
          </div>
        )}
        
        {/* Upcoming Challenges */}
        {upcomingChallenges.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Challenges</h2>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {upcomingChallenges.map(challenge => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  onAttempt={handleAttemptChallenge} 
                />
              ))}
            </motion.div>
          </div>
        )}
      </div>
      
      {/* Challenge Attempt Modal */}
      {selectedChallenge && (
        <ChallengeAttemptModal 
          challenge={selectedChallenge}
          onClose={handleCloseAttempt}
          onComplete={handleChallengeComplete}
        />
      )}
      
      {/* Challenge Result Modal */}
      {showResultModal && (
        <ChallengeResultModal 
          success={challengeSuccess}
          onClose={handleCloseResult}
        />
      )}
      
      {/* Bottom Navigation */}
      <BottomTabNavigation activeTab="learn-arena" />
    </div>
  );
}
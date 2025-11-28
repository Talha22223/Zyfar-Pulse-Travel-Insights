import React, { useState, useRef, useEffect } from 'react';
import { SurveyCategory } from '../../types';
import { api } from '../../services/api';
import styles from './SurveySection.module.scss';

interface SurveySectionProps {
  category: SurveyCategory;
  onComplete: (insight: string) => void;
  onBack: () => void;
}

const SurveySection: React.FC<SurveySectionProps> = ({ category, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [categoryWithQuestions, setCategoryWithQuestions] = useState<SurveyCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const questionContainerRef = useRef<HTMLDivElement>(null);

  // Use loaded questions if available, otherwise fall back to category.questions
  const questions = categoryWithQuestions?.questions || category.questions || [];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isCityInput = currentQuestion === questions.length;

  // Load questions when category changes
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await api.getCategoryQuestions(category.id);
        if (response.success && response.category) {
          setCategoryWithQuestions(response.category);
        }
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [category.id]);

  // Auto-scroll to question when it changes
  useEffect(() => {
    if (questionContainerRef.current) {
      questionContainerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [currentQuestion]);

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    
    // Auto-advance after selection with smooth transition
    setTimeout(() => {
      handleNext();
    }, 600); // Delay to show selection animation
  };

  const handleNext = () => {
    if (!selectedOption || !questions || questions.length === 0) return;

    setIsTransitioning(true);
    
    setTimeout(() => {
      const newAnswers = [...answers, selectedOption];
      setAnswers(newAnswers);
      setSelectedOption('');

      if (isLastQuestion) {
        setCurrentQuestion(currentQuestion + 1); // Move to city input
      } else {
        setCurrentQuestion(currentQuestion + 1);
      }
      
      setIsTransitioning(false);
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestion === 0) {
      onBack();
    } else if (isCityInput) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1] || '');
      setAnswers((prev) => prev?.slice(0, -1) || []);
    }
  };

  const handleSubmit = async () => {
    if (!city.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await api.submitSurvey({
        category: category.id,
        questions: (questions || []).map(q => q?.id || '').filter(Boolean),
        answers,
        city: city.trim()
      });

      if (response.success) {
        onComplete(response.insight || 'Thanks! Your pulse is added.');
      } else {
        alert('Failed to submit survey. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles['survey-section']} ref={questionContainerRef}>
      <div className="container">
        <div className={`${styles['survey-container']} ${isTransitioning ? styles.transitioning : ''}`}>
          <div className={styles['category-header']}>
            <span className={styles['category-emoji']}>{category.emoji}</span>
            <h2 className={styles['category-title']}>{category.title}</h2>
          </div>

          <div className={styles['progress-container']}>
            {(questions || []).map((_, index) => (
              <div
                key={index}
                className={`${styles['progress-dot']} ${
                  index === currentQuestion ? styles.active : ''
                } ${index < currentQuestion ? styles.completed : ''}`}
              />
            ))}
          </div>

          {isLoading && (
            <div className={styles['question-container']}>
              <p>Loading questions...</p>
            </div>
          )}

          {!isCityInput && !isLoading ? (
            <div className={`${styles['question-container']} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`} key={currentQuestion}>
              <h3 className={styles['question-text']}>
                {questions?.[currentQuestion]?.text || 'Loading question...'}
              </h3>

              <div className={styles['options-container']}>
                {(questions?.[currentQuestion]?.options || []).map((option, index) => (
                  <button
                    key={index}
                    className={`${styles['option-button']} ${
                      selectedOption === option ? styles.selected : ''
                    }`}
                    onClick={() => handleSelectOption(option)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className={styles['button-container']}>
                <button className={styles['nav-button']} onClick={handleBack}>
                  Back
                </button>
                <button
                  className={`${styles['nav-button']} ${styles.primary}`}
                  onClick={handleNext}
                  disabled={!selectedOption}
                  style={{ opacity: selectedOption ? 1 : 0.4 }}
                >
                  {isLastQuestion ? 'Continue' : 'Next'}
                </button>
              </div>
            </div>
          ) : (
            <div className={`${styles['city-input-container']} ${styles.fadeIn}`}>
              <h3 className={styles['question-text']}>
                Which city are you from?
              </h3>
              <input
                type="text"
                className={styles['city-input']}
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && city.trim()) {
                    handleSubmit();
                  }
                }}
              />
              <div className={styles['button-container']}>
                <button className={styles['nav-button']} onClick={handleBack}>
                  Back
                </button>
                <button
                  className={`${styles['nav-button']} ${styles.primary}`}
                  onClick={handleSubmit}
                  disabled={!city.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SurveySection;


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
  const [answers, setAnswers] = useState<(string | string[])[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textInput, setTextInput] = useState<string>('');
  const [locationText, setLocationText] = useState<string>('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [categoryWithQuestions, setCategoryWithQuestions] = useState<SurveyCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const questionContainerRef = useRef<HTMLDivElement>(null);

  // Use loaded questions if available, otherwise fall back to category.questions
  const questions = categoryWithQuestions?.questions || category.questions || [];
  const hasQuestions = questions.length > 0;
  const isLastQuestion = hasQuestions && currentQuestion === questions.length - 1;
  const isCityInput = hasQuestions && currentQuestion === questions.length;

  // Load questions when category changes
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Loading questions for category:', category.id);
        const response = await api.getCategoryQuestions(category.id);
        console.log('Full API response:', JSON.stringify(response, null, 2));
        
        if (response.success && response.category) {
          console.log('Setting category with questions:', response.category);
          console.log('Questions array:', response.category.questions);
          setCategoryWithQuestions(response.category);
        } else {
          console.error('Invalid response structure:', response);
          setError('Failed to load questions - invalid response');
        }
      } catch (err) {
        console.error('Failed to load questions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load questions');
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

  // Get current question type
  const getCurrentQuestionType = () => {
    if (!questions || questions.length === 0 || currentQuestion >= questions.length) return 'single';
    return questions[currentQuestion]?.type || 'single';
  };

  // Handle multiple selection toggle
  const handleToggleOption = (option: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(o => o !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  // Check if option needs additional text input
  const needsTextInput = (option: string) => {
    return option === 'Specific area (text option)' || 
           option === 'Landmark (text option)' || 
           option === 'Others (specify)';
  };

  const handleSelectOption = (option: string) => {
    const questionType = getCurrentQuestionType();
    
    if (questionType === 'multiple') {
      handleToggleOption(option);
    } else {
      setSelectedOption(option);
      
      // Don't auto-advance if option needs text input
      if (!needsTextInput(option)) {
        // Auto-advance after selection with smooth transition for single/rating
        setTimeout(() => {
          handleNext();
        }, 600);
      }
    }
  };

  const handleNext = () => {
    const questionType = getCurrentQuestionType();
    
    // Validate based on question type
    if (questionType === 'text' && !textInput.trim()) return;
    if (questionType === 'multiple' && selectedOptions.length === 0) return;
    if ((questionType === 'single' || questionType === 'rating') && !selectedOption) return;
    
    if (!questions || questions.length === 0) return;

    setIsTransitioning(true);
    
    setTimeout(() => {
      let answerToSave: string | string[];
      
      if (questionType === 'text') {
        answerToSave = textInput.trim();
      } else if (questionType === 'multiple') {
        // Check if "Others (specify)" is selected and has additional text
        const othersSelected = selectedOptions.includes('Others (specify)');
        if (othersSelected && locationText.trim()) {
          const filteredOptions = selectedOptions.filter(o => o !== 'Others (specify)');
          answerToSave = [...filteredOptions, `Others: ${locationText.trim()}`];
        } else {
          answerToSave = [...selectedOptions];
        }
      } else if (questionType === 'single' && needsTextInput(selectedOption)) {
        // Handle location with text input or Others
        if (selectedOption === 'Others (specify)') {
          answerToSave = locationText.trim() ? `Others: ${locationText.trim()}` : 'Others';
        } else {
          answerToSave = locationText.trim() ? `${selectedOption.replace(' (text option)', '')}: ${locationText.trim()}` : selectedOption;
        }
      } else {
        answerToSave = selectedOption;
      }
      
      const newAnswers = [...answers, answerToSave];
      setAnswers(newAnswers);
      
      // Reset all input states
      setSelectedOption('');
      setSelectedOptions([]);
      setTextInput('');
      setLocationText('');

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
      const prevAnswer = answers[currentQuestion - 1];
      setCurrentQuestion(currentQuestion - 1);
      
      // Restore previous answer based on question type
      const prevQuestionType = questions?.[currentQuestion - 1]?.type || 'single';
      if (prevQuestionType === 'text') {
        setTextInput(typeof prevAnswer === 'string' ? prevAnswer : '');
      } else if (prevQuestionType === 'multiple') {
        setSelectedOptions(Array.isArray(prevAnswer) ? prevAnswer : []);
      } else {
        setSelectedOption(typeof prevAnswer === 'string' ? prevAnswer : '');
      }
      
      setAnswers((prev) => prev?.slice(0, -1) || []);
    }
  };

  const handleSubmit = async () => {
    if (!city.trim()) return;

    setIsSubmitting(true);

    try {
      // Flatten answers for submission (convert arrays to comma-separated strings)
      const flattenedAnswers = answers.map(answer => 
        Array.isArray(answer) ? answer.join(', ') : answer
      );

      const response = await api.submitSurvey({
        category: category.id,
        questions: (questions || []).map(q => q?.id || '').filter(Boolean),
        answers: flattenedAnswers,
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

  // Check if current question has valid input
  const hasValidInput = () => {
    const questionType = getCurrentQuestionType();
    if (questionType === 'text') return textInput.trim().length > 0;
    if (questionType === 'multiple') {
      // If "Others (specify)" is selected, require text input
      if (selectedOptions.includes('Others (specify)')) {
        return selectedOptions.length > 0 && locationText.trim().length > 0;
      }
      return selectedOptions.length > 0;
    }
    if (questionType === 'single' && needsTextInput(selectedOption)) {
      return selectedOption && locationText.trim().length > 0;
    }
    return !!selectedOption;
  };

  // Check if location/other text input is needed for current selection
  const showAdditionalTextInput = () => {
    const questionType = getCurrentQuestionType();
    if (questionType === 'single') {
      return needsTextInput(selectedOption);
    }
    if (questionType === 'multiple') {
      return selectedOptions.includes('Others (specify)');
    }
    return false;
  };

  // Get placeholder text for additional input
  const getAdditionalInputPlaceholder = () => {
    if (selectedOption === 'Specific area (text option)' || selectedOptions.includes('Specific area (text option)')) {
      return 'Enter specific area name...';
    }
    if (selectedOption === 'Landmark (text option)' || selectedOptions.includes('Landmark (text option)')) {
      return 'Enter landmark name...';
    }
    if (selectedOption === 'Others (specify)' || selectedOptions.includes('Others (specify)')) {
      return 'Please specify...';
    }
    return 'Enter details...';
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

          {!isLoading && !hasQuestions && (
            <div className={styles['question-container']}>
              <p>{error || 'No questions available for this category.'}</p>
              <button className={styles['nav-button']} onClick={onBack}>
                Go Back
              </button>
            </div>
          )}

          {!isLoading && hasQuestions && !isCityInput && (
            <div className={`${styles['question-container']} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`} key={currentQuestion}>
              <h3 className={styles['question-text']}>
                {questions?.[currentQuestion]?.text || 'Loading question...'}
              </h3>
              
              {/* Hint for multiple selection */}
              {getCurrentQuestionType() === 'multiple' && (
                <p className={styles['question-hint']}>Select one or more options</p>
              )}

              {/* Text Input Type */}
              {getCurrentQuestionType() === 'text' && (
                <div className={styles['text-input-container']}>
                  <textarea
                    className={styles['text-area-input']}
                    placeholder="Type your description here..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={4}
                  />
                </div>
              )}

              {/* Rating Type */}
              {getCurrentQuestionType() === 'rating' && (
                <div className={styles['rating-container']}>
                  {(questions?.[currentQuestion]?.options || []).map((option, index) => (
                    <button
                      key={index}
                      className={`${styles['rating-button']} ${
                        selectedOption === option ? styles.selected : ''
                      }`}
                      onClick={() => handleSelectOption(option)}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <span className={styles['rating-number']}>{index + 1}</span>
                      <span className={styles['rating-label']}>{option.split('–')[1]?.trim() || option}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Single Selection Options */}
              {getCurrentQuestionType() === 'single' && (
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
                  
                  {/* Additional text input for location/others options */}
                  {showAdditionalTextInput() && (
                    <input
                      type="text"
                      className={styles['location-input']}
                      placeholder={getAdditionalInputPlaceholder()}
                      value={locationText}
                      onChange={(e) => setLocationText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && hasValidInput()) {
                          handleNext();
                        }
                      }}
                      autoFocus
                    />
                  )}
                </div>
              )}

              {/* Multiple Selection Options */}
              {getCurrentQuestionType() === 'multiple' && (
                <div className={styles['options-container']}>
                  {(questions?.[currentQuestion]?.options || []).map((option, index) => (
                    <button
                      key={index}
                      className={`${styles['option-button']} ${styles['checkbox-option']} ${
                        selectedOptions.includes(option) ? styles.selected : ''
                      }`}
                      onClick={() => handleSelectOption(option)}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <span className={styles['checkbox-indicator']}>
                        {selectedOptions.includes(option) ? '✓' : ''}
                      </span>
                      {option}
                    </button>
                  ))}
                  
                  {/* Additional text input for "Others (specify)" in multiple selection */}
                  {showAdditionalTextInput() && (
                    <input
                      type="text"
                      className={styles['location-input']}
                      placeholder={getAdditionalInputPlaceholder()}
                      value={locationText}
                      onChange={(e) => setLocationText(e.target.value)}
                      autoFocus
                    />
                  )}
                </div>
              )}

              <div className={styles['button-container']}>
                <button className={styles['nav-button']} onClick={handleBack}>
                  Back
                </button>
                <button
                  className={`${styles['nav-button']} ${styles.primary}`}
                  onClick={handleNext}
                  disabled={!hasValidInput()}
                  style={{ opacity: hasValidInput() ? 1 : 0.4 }}
                >
                  {isLastQuestion ? 'Continue' : 'Next'}
                </button>
              </div>
            </div>
          )}

          {!isLoading && hasQuestions && isCityInput && (
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
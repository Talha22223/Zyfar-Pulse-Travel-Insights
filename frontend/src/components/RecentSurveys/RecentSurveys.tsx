import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { SURVEY_CATEGORIES } from '../../config/categories';
import styles from './RecentSurveys.module.scss';

interface Survey {
  id: string;
  category: string;
  city: string;
  timestamp: string;
  answers: string[];
}

const RecentSurveys: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    loadRecentSurveys();
  }, []);

  const loadRecentSurveys = async () => {
    try {
      const response = await api.getRecentSurveys(20);
      if (response.success) {
        setSurveys(response.data);
      }
    } catch (error) {
      console.error('Failed to load recent surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return SURVEY_CATEGORIES[categoryId] || {
      emoji: '📋',
      title: categoryId,
      tagline: 'Survey Response'
    };
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
  };

  const getCityColor = (index: number) => {
    const colors = ['#40E0D0', '#FF6B9D', '#FFD93D', '#A78BFA', '#34D399', '#F97316'];
    return colors[index % (colors?.length ?? 1)];
  };

  if (loading) {
    return (
      <section className={styles['recent-surveys']}>
        <div className="container">
          <div className={styles['loading']}>
            <div className={styles['spinner']}></div>
            <p>Loading recent surveys...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!surveys || surveys.length === 0) {
    return null;
  }

  return (
    <section className={styles['recent-surveys']}>
      <div className="container">
        <div className={styles['section-header']}>
          <div className={styles['header-content']}>
            <h2 className={styles['section-title']}>
              <span className={styles['title-icon']}>🎯</span>
              Recent Surveys
            </h2>
            <p className={styles['section-subtitle']}>
              See what others are sharing about their travel experiences
            </p>
          </div>
          <div className={styles['stats-badge']}>
            <span className={styles['count']}>{surveys?.length || 0}</span>
            <span className={styles['label']}>Responses</span>
          </div>
        </div>

        <div className={styles['surveys-grid']}>
          {(surveys || []).slice(0, visibleCount).map((survey, index) => {
            const categoryInfo = getCategoryInfo(survey.category);
            return (
              <div 
                key={survey.id} 
                className={styles['survey-card']}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles['card-header']}>
                  <div className={styles['category-badge']}>
                    <span className={styles['category-emoji']}>{categoryInfo.emoji}</span>
                    <span className={styles['category-name']}>{categoryInfo.title}</span>
                  </div>
                  <div className={styles['timestamp']}>
                    {formatTimeAgo(survey.timestamp)}
                  </div>
                </div>

                <div className={styles['card-body']}>
                  <div className={styles['city-info']}>
                    <span className={styles['city-icon']}>📍</span>
                    <span 
                      className={styles['city-name']}
                      style={{ color: getCityColor(index) }}
                    >
                      {survey.city}
                    </span>
                  </div>
                  
                  {survey?.answers?.[0] && (
                    <div className={styles['answer-preview']}>
                      <div className={styles['answer-label']}>Response:</div>
                      <div className={styles['answer-text']}>"{survey.answers[0]}"</div>
                    </div>
                  )}
                </div>

                <div className={styles['card-footer']}>
                  <div className={styles['pulse-indicator']}>
                    <span className={styles['pulse-dot']}></span>
                    <span className={styles['pulse-text']}>Live</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {visibleCount < (surveys?.length || 0) && (
          <div className={styles['load-more-container']}>
            <button 
              className={styles['load-more-btn']}
              onClick={() => setVisibleCount(prev => prev + 6)}
            >
              <span>Show More Surveys</span>
              <span className={styles['arrow']}>↓</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentSurveys;

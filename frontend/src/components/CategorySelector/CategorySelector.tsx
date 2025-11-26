import React, { useEffect, useState, useRef } from 'react';
import { SurveyCategory } from '../../types';
import { api } from '../../services/api';
import styles from './CategorySelector.module.scss';

interface CategorySelectorProps {
  onSelectCategory: (category: SurveyCategory) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<SurveyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Scroll reveal for cards
    if (!loading && sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll(`.${styles['category-card']}`);
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('revealed');
        }, index * 100);
      });
    }
  }, [loading]);

  const loadCategories = async () => {
    try {
      const response = await api.getCategories();
      if (response.success && response.categories) {
        // Fetch full details for each category
        const categoriesWithQuestions = await Promise.all(
          response.categories.map(async (cat: any) => {
            const details = await api.getCategoryQuestions(cat.id);
            return details.category;
          })
        );
        setCategories(categoriesWithQuestions);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={styles['category-selector']}>
        <div className="container">
          <p style={{ textAlign: 'center' }}>Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles['category-selector']} ref={sectionRef}>
      <div className="container">
        <h2 className={`${styles['section-title']} scroll-reveal`}>Choose Your Pulse Topic</h2>
        <p className={`${styles['section-subtitle']} scroll-reveal`}>
          Select a category that resonates with your travel experience
        </p>

        <div className={styles['cards-container']}>
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`${styles['category-card']} scroll-reveal-scale`}
              onClick={() => onSelectCategory(category)}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <span className={styles['card-emoji']}>{category.emoji}</span>
              <h3 className={styles['card-title']}>{category.title}</h3>
              <p className={styles['card-tagline']}>{category.tagline}</p>
              <p className={styles['card-questions']}>
                {category.questions.length} question{category.questions.length > 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySelector;

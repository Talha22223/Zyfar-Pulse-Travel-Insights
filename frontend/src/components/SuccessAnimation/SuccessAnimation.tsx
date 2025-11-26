import React from 'react';
import styles from './SuccessAnimation.module.scss';

interface SuccessAnimationProps {
  message: string;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ message }) => {
  return (
    <div className={styles['success-container']}>
      <div className={styles['success-checkmark']}>
        <div className={styles['check-icon']}>
          <span className={styles['icon-line']}></span>
          <span className={styles['icon-line-tip']}></span>
          <div className={styles['icon-circle']}></div>
          <div className={styles['icon-fix']}></div>
        </div>
      </div>
      <h3 className={styles['success-title']}>Survey Submitted!</h3>
      <p className={styles['success-message']}>{message}</p>
      <div className={styles['confetti']}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className={styles['confetti-piece']} style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            background: ['#40E0D0', '#FF6B9D', '#FFD93D', '#A78BFA', '#34D399'][i % 5]
          }} />
        ))}
      </div>
    </div>
  );
};

export default SuccessAnimation;

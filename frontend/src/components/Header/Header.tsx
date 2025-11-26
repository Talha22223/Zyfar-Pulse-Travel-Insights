import React from 'react';
import styles from './Header.module.scss';

interface HeaderProps {
  onStartSurvey: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStartSurvey }) => {
  return (
    <header className={styles.header}>
      <div className={styles['header-content']}>
        <h1 className={styles['header-title']}>
          Zyfar Pulse – What's on every traveller's mind?
        </h1>
        <p className={styles['header-subtitle']}>
          Answer quick 30-sec questions and see how your city or favourite place is trending.
        </p>
        
        <div className={styles['pulse-animation']}>
          <div className={styles['pulse-line']}></div>
          <div className={styles['pulse-dot']}></div>
          <div className={styles['pulse-dot']}></div>
          <div className={styles['pulse-dot']}></div>
          <div className={styles['pulse-dot']}></div>
          <div className={styles['pulse-dot']}></div>
        </div>

        <button className={styles['cta-button']} onClick={onStartSurvey}>
          Start Survey Now
        </button>
      </div>
    </header>
  );
};

export default Header;

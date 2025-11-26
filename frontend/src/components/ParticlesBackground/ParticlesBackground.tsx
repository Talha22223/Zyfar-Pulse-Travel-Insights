import React from 'react';
import styles from './ParticlesBackground.module.scss';

const ParticlesBackground: React.FC = () => {
  return (
    <div className={styles['particles-background']}>
      {[...Array(10)].map((_, i) => (
        <div key={i} className={styles.particle} />
      ))}
    </div>
  );
};

export default ParticlesBackground;

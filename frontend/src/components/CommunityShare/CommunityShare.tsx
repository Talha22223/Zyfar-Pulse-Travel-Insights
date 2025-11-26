import React from 'react';
import { Share2, MessageCircle } from 'lucide-react';
import styles from './CommunityShare.module.scss';

const CommunityShare: React.FC = () => {
  const handleWhatsAppShare = () => {
    const message = encodeURIComponent('Check out Zyfar Pulse - Share your travel insights and see what\'s trending! 🌍✈️');
    const url = `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
  };

  const handleShareStory = () => {
    // This would typically open a modal or redirect to a story submission form
    alert('Story submission feature coming soon!');
  };

  return (
    <section className={styles['community-share']}>
      <div className="container">
        <h2 className={styles['section-title']}>Your Voice Shapes India's Travel Pulse</h2>
        <p className={styles['section-description']}>
          Help fellow travelers make better decisions. Share your insights and spread the word!
        </p>

        <div className={styles['share-buttons']}>
          <button className={styles['share-button']} onClick={handleWhatsAppShare}>
            <MessageCircle size={20} />
            Share on WhatsApp
          </button>
          <button className={`${styles['share-button']} ${styles.secondary}`} onClick={handleShareStory}>
            <Share2 size={20} />
            Share Your Zyfar Story
          </button>
        </div>

        <p className={styles['footer-note']}>
          © 2025 Zyfar Pulse. Making travel insights accessible to everyone.
        </p>
      </div>
    </section>
  );
};

export default CommunityShare;

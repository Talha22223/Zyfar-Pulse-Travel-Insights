import React, { useEffect, useState } from 'react';
import { CityOverview } from '../../types';
import { api } from '../../services/api';
import styles from './CityPulseOverview.module.scss';

type TabType = 'all' | 'city' | 'lastTrip';

const CityPulseOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [overview, setOverview] = useState<CityOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [userCity] = useState('Delhi'); // Default city

  useEffect(() => {
    loadOverview();
  }, [activeTab]);

  const loadOverview = async () => {
    setLoading(true);
    try {
      let city: string | undefined;
      if (activeTab === 'city') {
        city = userCity;
      } else if (activeTab === 'lastTrip') {
        city = 'Goa'; // Example - in real app, get from user's last trip
      }
      
      const response = await api.getCityOverview(city);
      if (response.success) {
        setOverview(response.data);
      }
    } catch (error) {
      console.error('Failed to load overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'all' as TabType, label: 'All India' },
    { id: 'city' as TabType, label: 'My City' },
    { id: 'lastTrip' as TabType, label: 'My Last Trip Place' }
  ];

  if (loading) {
    return (
      <section className={styles['city-pulse']}>
        <div className="container">
          <p style={{ textAlign: 'center' }}>Loading overview...</p>
        </div>
      </section>
    );
  }

  if (!overview) {
    return null;
  }

  return (
    <section className={styles['city-pulse']}>
      <div className="container">
        <h2 className={styles['section-title']}>City-Level Pulse Overview</h2>

        <div className={styles['tabs-container']}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles['tab-button']} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles['overview-grid']}>
          <div className={styles['stat-card']}>
            <div className={styles['stat-label']}>Total Responses</div>
            <div className={styles['stat-value']}>{overview.totalResponses}</div>
          </div>

          <div className={styles['stat-card']}>
            <div className={styles['stat-label']}>Safety Index</div>
            <div className={styles['stat-value']}>{overview.safetyIndex}/100</div>
          </div>

          <div className={styles['stat-card']}>
            <div className={styles['stat-label']}>Budget Average</div>
            <div className={`${styles['stat-value']} ${styles.text}`}>{overview.budgetAverage}</div>
          </div>

          <div className={styles['stat-card']}>
            <div className={styles['stat-label']}>Happiness Score</div>
            <div className={styles['stat-value']}>{overview.happinessScore}/100</div>
          </div>
        </div>

        {overview.trendingDestinations.length > 0 && (
          <div className={styles['destinations-section']}>
            <h3 className={styles['destinations-title']}>Trending Destinations</h3>
            <div className={styles['destinations-grid']}>
              {overview.trendingDestinations.map((dest, index) => (
                <div key={index} className={styles['destination-card']}>
                  <div className={styles['destination-card-name']}>{dest.name}</div>
                  <div className={styles['destination-card-count']}>{dest.count} votes</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {overview.painPointIndex !== 'N/A' && overview.painPointIndex !== 'No major issues' && (
          <div className={styles['stat-card']} style={{ marginTop: '2rem' }}>
            <div className={styles['stat-label']}>Top Pain Point</div>
            <div className={`${styles['stat-value']} ${styles.text}`}>{overview.painPointIndex}</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CityPulseOverview;

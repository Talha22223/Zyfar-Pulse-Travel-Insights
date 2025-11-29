import React, { useEffect, useState } from 'react';
import { CityOverview } from '../../types';
import { api } from '../../services/api';
import styles from './CityPulseOverview.module.scss';

type TabType = 'all' | 'city' | 'lastTrip';

interface CityPulseOverviewProps {
  userCity?: string;
}

const CityPulseOverview: React.FC<CityPulseOverviewProps> = ({ userCity: propCity }) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [overview, setOverview] = useState<CityOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [userCity, setUserCity] = useState<string>('');
  const [lastTripCity, setLastTripCity] = useState<string>('');
  const [showCityInput, setShowCityInput] = useState(false);
  const [cityInput, setCityInput] = useState('');

  // Load saved cities from localStorage on mount
  useEffect(() => {
    const savedCity = localStorage.getItem('zyfar_user_city') || propCity || '';
    const savedLastTrip = localStorage.getItem('zyfar_last_trip') || '';
    setUserCity(savedCity);
    setLastTripCity(savedLastTrip);
  }, [propCity]);

  useEffect(() => {
    loadOverview();
  }, [activeTab, userCity, lastTripCity]);

  const loadOverview = async () => {
    setLoading(true);
    try {
      let city: string | undefined;
      if (activeTab === 'city') {
        city = userCity || undefined;
      } else if (activeTab === 'lastTrip') {
        city = lastTripCity || undefined;
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

  const handleSetCity = (type: 'city' | 'lastTrip') => {
    if (!cityInput.trim()) return;
    
    if (type === 'city') {
      setUserCity(cityInput.trim());
      localStorage.setItem('zyfar_user_city', cityInput.trim());
    } else {
      setLastTripCity(cityInput.trim());
      localStorage.setItem('zyfar_last_trip', cityInput.trim());
    }
    setCityInput('');
    setShowCityInput(false);
  };

  const handleTabClick = (tabId: TabType) => {
    if (tabId === 'city' && !userCity) {
      setShowCityInput(true);
      setActiveTab(tabId);
    } else if (tabId === 'lastTrip' && !lastTripCity) {
      setShowCityInput(true);
      setActiveTab(tabId);
    } else {
      setShowCityInput(false);
      setActiveTab(tabId);
    }
  };

  const tabs = [
    { id: 'all' as TabType, label: 'All India' },
    { id: 'city' as TabType, label: userCity ? `My City (${userCity})` : 'My City' },
    { id: 'lastTrip' as TabType, label: lastTripCity ? `Last Trip (${lastTripCity})` : 'My Last Trip Place' }
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
          {(tabs || []).map((tab) => (
            <button
              key={tab.id}
              className={`${styles['tab-button']} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* City Input Prompt */}
        {showCityInput && (
          <div className={styles['city-input-prompt']}>
            <p className={styles['prompt-text']}>
              {activeTab === 'city' 
                ? 'Enter your city to see local insights:' 
                : 'Enter your last trip destination:'}
            </p>
            <div className={styles['input-row']}>
              <input
                type="text"
                className={styles['city-input']}
                placeholder={activeTab === 'city' ? 'e.g., Chennai, Mumbai, Delhi...' : 'e.g., Goa, Manali, Kerala...'}
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSetCity(activeTab === 'city' ? 'city' : 'lastTrip');
                  }
                }}
              />
              <button 
                className={styles['set-city-btn']}
                onClick={() => handleSetCity(activeTab === 'city' ? 'city' : 'lastTrip')}
                disabled={!cityInput.trim()}
              >
                Set {activeTab === 'city' ? 'City' : 'Destination'}
              </button>
            </div>
          </div>
        )}

        {/* Show message if no city set */}
        {!showCityInput && activeTab === 'city' && !userCity && (
          <div className={styles['no-data-message']}>
            <p>Click "My City" to set your city and see local insights.</p>
          </div>
        )}

        {!showCityInput && activeTab === 'lastTrip' && !lastTripCity && (
          <div className={styles['no-data-message']}>
            <p>Click "My Last Trip Place" to set your destination.</p>
          </div>
        )}

        {/* Overview Stats */}
        {!showCityInput && overview && (activeTab === 'all' || (activeTab === 'city' && userCity) || (activeTab === 'lastTrip' && lastTripCity)) && (
          <>
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

        {(overview?.trendingDestinations?.length ?? 0) > 0 && (
          <div className={styles['destinations-section']}>
            <h3 className={styles['destinations-title']}>Trending Destinations</h3>
            <div className={styles['destinations-grid']}>
              {(overview?.trendingDestinations || []).map((dest, index) => (
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
          </>
        )}
      </div>
    </section>
  );
};

export default CityPulseOverview;

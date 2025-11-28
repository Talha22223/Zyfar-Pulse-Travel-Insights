import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { LiveStats } from '../../types';
import { api } from '../../services/api';
import styles from './LiveInsights.module.scss';

interface LiveInsightsProps {
  insight: string;
  category?: string;
}

const COLORS = ['#40E0D0', '#FF6B9D', '#FFD93D', '#A78BFA', '#34D399', '#F97316'];

const LiveInsights: React.FC<LiveInsightsProps> = ({ insight, category }) => {
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [category]);

  const loadStats = async () => {
    try {
      const response = await api.getLiveStats(category);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={styles['live-insights']}>
        <div className="container">
          <p style={{ textAlign: 'center' }}>Loading insights...</p>
        </div>
      </section>
    );
  }

  if (!stats || stats.totalResponses === 0) {
    return (
      <section className={styles['live-insights']}>
        <div className="container">
          <div className={styles['empty-state']}>
            <h2 className={styles['section-title']}>No Data Yet</h2>
            <p>Be the first to submit a survey!</p>
          </div>
        </div>
      </section>
    );
  }

  // Prepare data for the first question's pie chart
  const firstQuestionData = Object.values(stats.aggregated)[0] || [];
  const pieData = (firstQuestionData || []).map(item => ({
    name: item.answer,
    value: item.count
  }));

  return (
    <section className={styles['live-insights']}>
      <div className="container">
        <div className={styles['insights-container']}>
          <h2 className={styles['section-title']}>Live Insights</h2>
          
          {insight && (
            <div className={styles['insight-highlight']}>
              {insight}
            </div>
          )}

          <div className={styles['charts-grid']}>
            {/* Pie Chart */}
            {(pieData?.length ?? 0) > 0 && (
              <div className={styles['chart-card']}>
                <h3 className={styles['chart-title']}>Response Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(pieData || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % (COLORS?.length ?? 1)]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top Destinations */}
            {(stats?.topDestinations?.length ?? 0) > 0 && (
              <div className={styles['chart-card']}>
                <h3 className={styles['chart-title']}>Trending Destinations</h3>
                <ul className={styles['destinations-list']}>
                  {(stats?.topDestinations || []).slice(0, 5).map((dest, index) => (
                    <li key={index} className={styles['destination-item']}>
                      <span className={styles['destination-name']}>{dest.name}</span>
                      <span className={styles['destination-count']}>{dest.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trend Line */}
            {(stats?.trends?.length ?? 0) > 0 && (
              <div className={styles['chart-card']} style={{ gridColumn: '1 / -1' }}>
                <h3 className={styles['chart-title']}>Submission Trends (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#40E0D0" 
                      strokeWidth={3}
                      dot={{ fill: '#40E0D0', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveInsights;

import type { RateLimitSnapshot } from '../types';
import './RateLimitStats.css';

interface RateLimitStatsProps {
  snapshot: RateLimitSnapshot;
}

export const RateLimitStats = ({ snapshot }: RateLimitStatsProps) => {
  const formatResetTime = (resetTimestamp: number) => {
    const date = new Date(resetTimestamp * 1000);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 0) return 'Resetting...';
    if (minutes === 0) return 'Less than a minute';
    if (minutes === 1) return '1 minute';
    return `${minutes} minutes`;
  };

  const calculatePercentage = (remaining: number, limit: number) => {
    return Math.round((remaining / limit) * 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage > 50) return 'good';
    if (percentage > 20) return 'warning';
    return 'critical';
  };

  const resources = [
    { name: 'Core API', data: snapshot.core },
    { name: 'Search API', data: snapshot.search },
    { name: 'GraphQL API', data: snapshot.graphql },
  ];

  return (
    <div className="rate-limit-stats">
      <h2>Current Rate Limits</h2>
      <div className="stats-grid">
        {resources.map(({ name, data }) => {
          const percentage = calculatePercentage(data.remaining, data.limit);
          const status = getStatusColor(percentage);

          return (
            <div key={name} className={`stat-card ${status}`}>
              <h3>{name}</h3>
              <div className="stat-main">
                <span className="remaining">{data.remaining}</span>
                <span className="separator">/</span>
                <span className="limit">{data.limit}</span>
              </div>
              <div className="stat-bar">
                <div className="stat-bar-fill" style={{ width: `${percentage}%` }} />
              </div>
              <div className="stat-meta">
                <span className="percentage">{percentage}% remaining</span>
                <span className="reset">Resets in {formatResetTime(data.reset)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

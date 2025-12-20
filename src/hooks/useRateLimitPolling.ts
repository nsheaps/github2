import { useState, useEffect, useCallback, useRef } from 'react';
import { githubAPI } from '../services/github';
import type { RateLimitSnapshot, PollingInterval } from '../types';

export const useRateLimitPolling = (interval: PollingInterval, isAuthenticated: boolean) => {
  const [snapshots, setSnapshots] = useState<RateLimitSnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchRateLimit = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const data = await githubAPI.getRateLimit();

      const snapshot: RateLimitSnapshot = {
        timestamp: Date.now(),
        core: data.resources.core,
        search: data.resources.search,
        graphql: data.resources.graphql,
      };

      setSnapshots(prev => {
        const updated = [...prev, snapshot];
        // Keep only last 50 snapshots to prevent memory issues
        return updated.slice(-50);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rate limit');
      console.error('Rate limit fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setSnapshots([]);
      return;
    }

    // Fetch immediately
    fetchRateLimit();

    // Set up polling
    intervalRef.current = window.setInterval(fetchRateLimit, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, isAuthenticated, fetchRateLimit]);

  const clearSnapshots = useCallback(() => {
    setSnapshots([]);
  }, []);

  return {
    snapshots,
    loading,
    error,
    clearSnapshots,
    refetch: fetchRateLimit,
  };
};

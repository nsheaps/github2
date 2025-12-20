import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { RateLimitSnapshot } from '../types';
import './RateLimitChart.css';

interface RateLimitChartProps {
  snapshots: RateLimitSnapshot[];
}

export const RateLimitChart = ({ snapshots }: RateLimitChartProps) => {
  const data = snapshots.map(snapshot => ({
    time: new Date(snapshot.timestamp).toLocaleTimeString(),
    Core: snapshot.core.remaining,
    Search: snapshot.search.remaining,
    GraphQL: snapshot.graphql.remaining,
  }));

  return (
    <div className="rate-limit-chart">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e1e4e8" />
          <XAxis dataKey="time" stroke="#586069" tick={{ fontSize: 12 }} />
          <YAxis
            stroke="#586069"
            tick={{ fontSize: 12 }}
            label={{ value: 'Remaining Requests', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #d1d5da',
              borderRadius: '6px',
              padding: '12px',
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
            }}
          />
          <Line
            type="monotone"
            dataKey="Core"
            stroke="#0366d6"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Search"
            stroke="#6f42c1"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="GraphQL"
            stroke="#28a745"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

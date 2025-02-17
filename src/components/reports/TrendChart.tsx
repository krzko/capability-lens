'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendData {
  date: string;
  [key: string]: number | string;
}

interface TrendChartProps {
  data?: TrendData[];
  enabledFacets: string[];
  timeUnit: 'weeks' | 'months' | 'quarters';
  isLoading?: boolean;
}

const COLORS = [
  '#6366f1', // indigo
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // violet
];

export function TrendChart({ data, enabledFacets, timeUnit, isLoading }: TrendChartProps) {
  const mockLoadingData = Array.from({ length: 12 }, (_, i) => ({
    date: `Point ${i + 1}`,
    ...enabledFacets.reduce((acc, facet, index) => ({
      ...acc,
      [facet]: Math.random() * 2 + 2,
    }), {}),
  }));

  const formatXAxis = (value: string) => {
    const date = new Date(value);
    switch (timeUnit) {
      case 'weeks':
        return `Week ${date.getWeek()}`;
      case 'months':
        return date.toLocaleDateString('en-AU', { month: 'short', year: '2-digit' });
      case 'quarters':
        return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
      default:
        return value;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full h-[500px]">
        <CardHeader>
          <CardTitle>Maturity Score Trends</CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mockLoadingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              {enabledFacets.map((facet, index) => (
                <Line
                  key={facet}
                  type="monotone"
                  dataKey={facet}
                  stroke="#e5e7eb"
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card className="w-full h-[500px]">
        <CardHeader>
          <CardTitle>Maturity Score Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            No trend data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[500px]">
      <CardHeader>
        <CardTitle>Maturity Score Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              minTickGap={30}
            />
            <YAxis
              domain={[0, 5]}
              label={{
                value: 'Maturity Level',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
              }}
            />
            <Tooltip
              labelFormatter={formatXAxis}
              formatter={(value: number) => [value.toFixed(2), '']}
            />
            <Legend />
            {enabledFacets.map((facet, index) => (
              <Line
                key={facet}
                type="monotone"
                dataKey={facet}
                name={facet}
                stroke={COLORS[index % COLORS.length]}
                dot
                activeDot={{ r: 6 }}
              />
            ))}
            <Brush
              dataKey="date"
              height={30}
              stroke="#8884d8"
              tickFormatter={formatXAxis}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

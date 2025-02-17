'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ComparisonData {
  category: string;
  [key: string]: number | string;
}

interface ComparisonChartProps {
  data?: ComparisonData[];
  isLoading?: boolean;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

export function ComparisonChart({ data, isLoading }: ComparisonChartProps) {
  const mockLoadingData = [
    { category: 'Loading...', entity1: 3, entity2: 2.5, entity3: 3.5 },
    { category: 'Loading...', entity1: 2.5, entity2: 3, entity3: 2.8 },
    { category: 'Loading...', entity1: 3.2, entity2: 2.8, entity3: 3.2 },
  ];

  if (isLoading) {
    return (
      <Card className="w-full h-[500px]">
        <CardHeader>
          <CardTitle>Maturity Comparison</CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={mockLoadingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 5]} />
              {Object.keys(mockLoadingData[0])
                .filter((key) => key !== 'category')
                .map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill="#e5e7eb"
                    radius={[4, 4, 0, 0]}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card className="w-full h-[500px]">
        <CardHeader>
          <CardTitle>Maturity Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            No comparison data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[500px]">
      <CardHeader>
        <CardTitle>Maturity Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Legend />
            {Object.keys(data[0])
              .filter((key) => key !== 'category')
              .map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  name={key}
                  fill={COLORS[index]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

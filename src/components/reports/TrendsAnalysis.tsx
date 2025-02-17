'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface TrendData {
  date: string;
  averageScore: number;
  assessmentCount: number;
}

interface TrendsAnalysisProps {
  data: TrendData[];
  isLoading?: boolean;
}

export function TrendsAnalysis({ data, isLoading }: TrendsAnalysisProps) {
  if (isLoading) {
    return (
      <Card className="w-full h-[400px] animate-pulse">
        <CardHeader>
          <CardTitle>Maturity Score Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] bg-muted rounded-md" />
      </Card>
    );
  }

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>Maturity Score Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" domain={[0, 5]} />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="averageScore"
              name="Average Score"
              stroke="#6366f1"
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="assessmentCount"
              name="Assessments"
              stroke="#10b981"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

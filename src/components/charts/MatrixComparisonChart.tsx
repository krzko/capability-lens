import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MatrixComparisonChartProps {
  data?: {
    matrix: string;
    score: number;
  }[];
  isLoading?: boolean;
}

export function MatrixComparisonChart({ data, isLoading }: MatrixComparisonChartProps) {
  const mockLoadingData = [
    { matrix: 'Loading...', score: 2.5 },
    { matrix: 'Loading...', score: 3.5 },
    { matrix: 'Loading...', score: 2.0 },
    { matrix: 'Loading...', score: 3.0 },
  ];

  if (isLoading) {
    return (
      <Card className="w-full h-[400px]">
        <CardHeader>
          <CardTitle>Matrix Type Comparison</CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={mockLoadingData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="matrix" />
              <Radar
                name="Average Maturity Score"
                dataKey="score"
                stroke="#e5e7eb"
                fill="#e5e7eb"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card className="w-full h-[400px]">
        <CardHeader>
          <CardTitle>Matrix Type Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>Matrix Type Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="matrix" />
            <Radar
              name="Average Maturity Score"
              dataKey="score"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.5}
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

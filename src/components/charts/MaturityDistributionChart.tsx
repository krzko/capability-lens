import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MaturityDistributionChartProps {
  data?: {
    level: number;
    count: number;
  }[];
  isLoading?: boolean;
}

export function MaturityDistributionChart({ data, isLoading }: MaturityDistributionChartProps) {
  const mockLoadingData = [
    { level: 1, count: 3 },
    { level: 2, count: 5 },
    { level: 3, count: 4 },
    { level: 4, count: 2 },
    { level: 5, count: 1 },
  ];

  if (isLoading) {
    return (
      <Card className="w-full h-[400px]">
        <CardHeader>
          <CardTitle>Maturity Level Distribution</CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockLoadingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Bar
                name="Number of Services"
                dataKey="count"
                fill="#e5e7eb"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card className="w-full h-[400px]">
        <CardHeader>
          <CardTitle>Maturity Level Distribution</CardTitle>
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
        <CardTitle>Maturity Level Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="level" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              name="Number of Services"
              dataKey="count"
              fill="#6366f1"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

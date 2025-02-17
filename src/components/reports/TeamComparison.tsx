'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface TeamScores {
  teamName: string;
  observability: number;
  security: number;
  dora: number;
  cloudNative: number;
}

interface TeamComparisonProps {
  data: TeamScores[];
  isLoading?: boolean;
}

export function TeamComparison({ data, isLoading }: TeamComparisonProps) {
  const [matrixType, setMatrixType] = useState('all');

  if (isLoading) {
    return (
      <Card className="w-full h-[500px] animate-pulse">
        <CardHeader>
          <CardTitle>Team Comparison</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] bg-muted rounded-md" />
      </Card>
    );
  }

  const getChartData = () => {
    if (matrixType === 'all') {
      return data;
    }

    return data.map((team) => ({
      teamName: team.teamName,
      [matrixType]: team[matrixType as keyof TeamScores],
    }));
  };

  return (
    <Card className="w-full h-[500px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Team Comparison</CardTitle>
        <Select value={matrixType} onValueChange={setMatrixType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select matrix type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Matrices</SelectItem>
            <SelectItem value="observability">Observability</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="dora">DORA</SelectItem>
            <SelectItem value="cloudNative">Cloud Native</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="teamName" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Legend />
            {matrixType === 'all' ? (
              <>
                <Bar dataKey="observability" name="Observability" fill="#6366f1" />
                <Bar dataKey="security" name="Security" fill="#10b981" />
                <Bar dataKey="dora" name="DORA" fill="#f59e0b" />
                <Bar dataKey="cloudNative" name="Cloud Native" fill="#3b82f6" />
              </>
            ) : (
              <Bar dataKey={matrixType} fill="#6366f1" />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

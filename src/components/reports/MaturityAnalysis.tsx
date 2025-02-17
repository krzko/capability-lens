'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MaturityData {
  category: string;
  score: number;
  target: number;
}

interface TeamMaturityData {
  teamName: string;
  data: MaturityData[];
}

interface MaturityAnalysisProps {
  data: TeamMaturityData[];
  isLoading?: boolean;
}

export function MaturityAnalysis({ data, isLoading }: MaturityAnalysisProps) {
  if (isLoading) {
    return (
      <Card className="w-full h-[500px] animate-pulse">
        <CardHeader>
          <CardTitle>Detailed Maturity Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] bg-muted rounded-md" />
      </Card>
    );
  }

  return (
    <Card className="w-full h-[500px]">
      <CardHeader>
        <CardTitle>Detailed Maturity Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={data[0]?.teamName} className="h-[400px]">
          <TabsList className="w-full justify-start">
            {data.map((team) => (
              <TabsTrigger key={team.teamName} value={team.teamName}>
                {team.teamName}
              </TabsTrigger>
            ))}
          </TabsList>

          {data.map((team) => (
            <TabsContent key={team.teamName} value={team.teamName} className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={team.data}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <Radar
                    name="Current Score"
                    dataKey="score"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.5}
                  />
                  <Radar
                    name="Target Score"
                    dataKey="target"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.5}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

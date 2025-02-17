'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface DeltaData {
  facet: string;
  currentScore: number;
  previousScore: number;
  changePercentage: number;
}

interface DeltaAnalysisProps {
  data?: DeltaData[];
  isLoading?: boolean;
}

export function DeltaAnalysis({ data, isLoading }: DeltaAnalysisProps) {
  const mockLoadingData: DeltaData[] = Array(5).fill({
    facet: 'Loading...',
    currentScore: 0,
    previousScore: 0,
    changePercentage: 0,
  });

  const sortedData = data?.sort((a, b) => Math.abs(b.changePercentage) - Math.abs(a.changePercentage));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rate of Change Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {mockLoadingData.map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
                <div className="h-8 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rate of Change Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            No delta analysis data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate of Change Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedData?.map((item) => (
            <div key={item.facet} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{item.facet}</h4>
                <p className="text-sm text-muted-foreground">
                  {item.currentScore.toFixed(2)} from {item.previousScore.toFixed(2)}
                </p>
              </div>
              <div className={`flex items-center space-x-1 ${
                item.changePercentage > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {item.changePercentage > 0 ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {Math.abs(item.changePercentage).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

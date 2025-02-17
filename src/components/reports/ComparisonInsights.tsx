'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowDown, ArrowUp, Lightbulb } from 'lucide-react';

interface Insight {
  type: 'improvement' | 'gap' | 'recommendation';
  title: string;
  description: string;
  value?: string;
  trend?: 'up' | 'down';
}

interface ComparisonInsightsProps {
  data?: Insight[];
  isLoading?: boolean;
}

export function ComparisonInsights({ data, isLoading }: ComparisonInsightsProps) {
  const mockLoadingData: Insight[] = [
    {
      type: 'improvement',
      title: 'Loading...',
      description: 'Loading insight description...',
    },
    {
      type: 'gap',
      title: 'Loading...',
      description: 'Loading insight description...',
    },
    {
      type: 'recommendation',
      title: 'Loading...',
      description: 'Loading insight description...',
    },
  ];

  const getIcon = (type: Insight['type'], trend?: Insight['trend']) => {
    switch (type) {
      case 'improvement':
        return trend === 'up' ? (
          <ArrowUp className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowDown className="w-4 h-4 text-red-500" />
        );
      case 'gap':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'recommendation':
        return <Lightbulb className="w-4 h-4 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockLoadingData.map((insight, index) => (
              <Card key={index}>
                <CardContent className="p-4 animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-5/6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
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
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            No insights available for the current comparison
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((insight, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">{getIcon(insight.type, insight.trend)}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.description}
                    </p>
                    {insight.value && (
                      <p className="text-sm font-medium mt-2">{insight.value}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface SnapshotData {
  facet: string;
  q1Score: number;
  q2Score: number;
  q3Score: number;
  q4Score: number;
  trend: 'up' | 'down' | 'stable';
}

interface SnapshotComparisonProps {
  data?: SnapshotData[];
  isLoading?: boolean;
}

export function SnapshotComparison({ data, isLoading }: SnapshotComparisonProps) {
  const mockLoadingData: SnapshotData[] = Array(5).fill({
    facet: 'Loading...',
    q1Score: 0,
    q2Score: 0,
    q3Score: 0,
    q4Score: 0,
    trend: 'stable',
  });

  const getTrendBadge = (trend: SnapshotData['trend']) => {
    switch (trend) {
      case 'up':
        return <Badge variant="default">Improving</Badge>;
      case 'down':
        return <Badge variant="destructive">Declining</Badge>;
      case 'stable':
        return <Badge variant="secondary">Stable</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quarterly Snapshots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border animate-pulse">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facet</TableHead>
                  <TableHead>Q1</TableHead>
                  <TableHead>Q2</TableHead>
                  <TableHead>Q3</TableHead>
                  <TableHead>Q4</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLoadingData.map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-32" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-12" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-12" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-12" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-12" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-20" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quarterly Snapshots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            No snapshot data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quarterly Snapshots</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facet</TableHead>
                <TableHead>Q1</TableHead>
                <TableHead>Q2</TableHead>
                <TableHead>Q3</TableHead>
                <TableHead>Q4</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.facet}>
                  <TableCell className="font-medium">{item.facet}</TableCell>
                  <TableCell>{item.q1Score.toFixed(2)}</TableCell>
                  <TableCell>{item.q2Score.toFixed(2)}</TableCell>
                  <TableCell>{item.q3Score.toFixed(2)}</TableCell>
                  <TableCell>{item.q4Score.toFixed(2)}</TableCell>
                  <TableCell>{getTrendBadge(item.trend)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ComparisonTableData {
  category: string;
  facet: string;
  entities: {
    [key: string]: {
      score: number;
      delta?: number;
    };
  };
}

interface ComparisonTableProps {
  data?: ComparisonTableData[];
  isLoading?: boolean;
}

export function ComparisonTable({ data, isLoading }: ComparisonTableProps) {
  const mockLoadingData: ComparisonTableData[] = Array(5).fill({
    category: 'Loading...',
    facet: 'Loading...',
    entities: {
      entity1: { score: 0, delta: 0 },
      entity2: { score: 0, delta: 0 },
      entity3: { score: 0, delta: 0 },
    },
  });

  const getDeltaBadge = (delta?: number) => {
    if (!delta) return null;
    const isPositive = delta > 0;
    return (
      <Badge
        variant={isPositive ? 'default' : 'destructive'}
        className="ml-2"
      >
        {isPositive ? '+' : ''}{delta}%
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border animate-pulse">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Category</TableHead>
                  <TableHead className="w-[200px]">Facet</TableHead>
                  {Object.keys(mockLoadingData[0].entities).map((entity) => (
                    <TableHead key={entity}>
                      <div className="h-4 bg-gray-200 rounded w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLoadingData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-32" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-32" />
                    </TableCell>
                    {Object.values(row.entities).map((_, entityIndex) => (
                      <TableCell key={entityIndex}>
                        <div className="h-4 bg-gray-200 rounded w-16" />
                      </TableCell>
                    ))}
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
          <CardTitle>Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            No comparison data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Category</TableHead>
                <TableHead className="w-[200px]">Facet</TableHead>
                {Object.keys(data[0].entities).map((entity) => (
                  <TableHead key={entity}>{entity}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.category}</TableCell>
                  <TableCell>{row.facet}</TableCell>
                  {Object.entries(row.entities).map(([entity, data]) => (
                    <TableCell key={entity}>
                      {data.score.toFixed(1)}
                      {getDeltaBadge(data.delta)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

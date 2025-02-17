'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Layout from '@/components/layout/Layout';
import { TrendChart } from '@/components/reports/TrendChart';
import { DeltaAnalysis } from '@/components/reports/DeltaAnalysis';
import { SnapshotComparison } from '@/components/reports/SnapshotComparison';
import { fetchTrendsData } from '@/lib/services/reports';
import { useToast } from '@/components/ui/use-toast';

type TimeUnit = 'weeks' | 'months' | 'quarters';
type MatrixType = 'all' | 'observability' | 'security' | 'dora' | 'cloudNative';

export default function TrendsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('months');
  const [matrixType, setMatrixType] = useState<MatrixType>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [enabledFacets, setEnabledFacets] = useState<string[]>([
    'Code Quality',
    'Testing',
    'Deployment',
    'Security',
    'Observability',
  ]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [timeUnit, matrixType, dateRange]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const trendsData = await fetchTrendsData({
        timeUnit,
        matrixType,
        dateRange,
      });
      setData(trendsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load trends data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFacet = (facet: string) => {
    if (enabledFacets.includes(facet)) {
      setEnabledFacets(enabledFacets.filter((f) => f !== facet));
    } else {
      setEnabledFacets([...enabledFacets, facet]);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Trend Analysis</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track maturity score evolution and identify improvement patterns
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Time Unit</Label>
                <Select
                  value={timeUnit}
                  onValueChange={(value: TimeUnit) => setTimeUnit(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Time Unit</SelectLabel>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="quarters">Quarters</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Matrix Type</Label>
                <Select
                  value={matrixType}
                  onValueChange={(value: MatrixType) => setMatrixType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select matrix type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Matrix Type</SelectLabel>
                      <SelectItem value="all">All Matrices</SelectItem>
                      <SelectItem value="observability">Observability</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="dora">DORA</SelectItem>
                      <SelectItem value="cloudNative">Cloud Native</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <CalendarDateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Enabled Facets</Label>
              <div className="flex flex-wrap gap-4">
                {data?.facets.map((facet: string) => (
                  <div key={facet} className="flex items-center space-x-2">
                    <Switch
                      id={`facet-${facet}`}
                      checked={enabledFacets.includes(facet)}
                      onCheckedChange={() => toggleFacet(facet)}
                    />
                    <Label htmlFor={`facet-${facet}`}>{facet}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <TrendChart
          data={data?.trendData}
          enabledFacets={enabledFacets}
          timeUnit={timeUnit}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DeltaAnalysis data={data?.deltaData} isLoading={isLoading} />
          <SnapshotComparison data={data?.snapshotData} isLoading={isLoading} />
        </div>
      </div>
    </Layout>
  );
}

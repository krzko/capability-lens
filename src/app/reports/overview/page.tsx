'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import { MatrixComparisonChart } from '@/components/charts/MatrixComparisonChart';
import { MaturityDistributionChart } from '@/components/charts/MaturityDistributionChart';
import { PerformersTable } from '@/components/reports/PerformersTable';
import { TrendsAnalysis } from '@/components/reports/TrendsAnalysis';
import { MaturityAnalysis } from '@/components/reports/MaturityAnalysis';
import { TeamComparison } from '@/components/reports/TeamComparison';
import { Download } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import Layout from '@/components/layout/Layout';
import { fetchReportsData, exportReportsData } from '@/lib/services/reports';
import { useToast } from '@/components/ui/use-toast';

export default function ReportsOverviewPage() {
  const [dateRange, setDateRange] = useState<DateRange>();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const reportData = await fetchReportsData({ dateRange });
      setData(reportData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load reports data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportReportsData({ dateRange });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `maturity-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export reports data',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Comprehensive insights across your maturity assessments
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <CalendarDateRangePicker date={dateRange} onDateChange={setDateRange} />
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="maturity">Maturity Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Team Comparison</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Average Maturity</CardTitle>
                  <CardDescription>Across all matrices</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-8 w-16 bg-muted rounded" />
                      <div className="h-4 w-24 bg-muted rounded" />
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold">{data?.summaryStats.averageMaturity.toFixed(1)}</div>
                      <div className={`text-sm ${data?.summaryStats.maturityChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data?.summaryStats.maturityChange >= 0 ? '↑' : '↓'} {Math.abs(data?.summaryStats.maturityChange).toFixed(1)} from last period
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Total Assessments</CardTitle>
                  <CardDescription>In selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-8 w-16 bg-muted rounded" />
                      <div className="h-4 w-24 bg-muted rounded" />
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold">{data?.summaryStats.totalAssessments}</div>
                      <div className="text-sm text-blue-600">{data?.summaryStats.pendingReviews} pending reviews</div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Teams Improved</CardTitle>
                  <CardDescription>Teams showing progress</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-8 w-16 bg-muted rounded" />
                      <div className="h-4 w-24 bg-muted rounded" />
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold">{data?.summaryStats.teamsImproved.percentage}%</div>
                      <div className="text-sm text-green-600">
                        {data?.summaryStats.teamsImproved.count} of {data?.summaryStats.teamsImproved.total} teams
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Matrix Comparison and Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MatrixComparisonChart data={data?.matrixComparison} isLoading={isLoading} />
              <MaturityDistributionChart data={data?.maturityDistribution} isLoading={isLoading} />
            </div>

            {/* Top/Bottom Performers */}
            <PerformersTable
              topPerformers={data?.performers.top}
              bottomPerformers={data?.performers.bottom}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="maturity" className="space-y-4">
            <MaturityAnalysis data={data?.maturityAnalysis} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <TeamComparison data={data?.teamComparison} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <TrendsAnalysis data={data?.trends} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

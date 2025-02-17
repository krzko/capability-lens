import { DateRange } from 'react-day-picker';

export type ComparisonType = 'teams' | 'services' | 'organisations';
export type MatrixType = 'all' | 'observability' | 'security' | 'dora' | 'cloudNative';

export interface ComparisonData {
  chartData: Array<{
    category: string;
    [key: string]: number | string;
  }>;
  insights: Array<{
    type: 'improvement' | 'gap' | 'recommendation';
    title: string;
    description: string;
    value?: string;
    trend?: 'up' | 'down';
  }>;
  tableData: Array<{
    category: string;
    facet: string;
    entities: {
      [key: string]: {
        score: number;
        delta?: number;
      };
    };
  }>;
}

export interface ComparisonFilters {
  comparisonType: ComparisonType;
  matrixType: MatrixType;
  entities: string[];
  dateRange?: DateRange;
}

export interface ReportsData {
  summaryStats: {
    averageMaturity: number;
    maturityChange: number;
    totalAssessments: number;
    pendingReviews: number;
    teamsImproved: {
      percentage: number;
      count: number;
      total: number;
    };
  };
  matrixComparison: Array<{
    matrix: string;
    score: number;
  }>;
  maturityDistribution: Array<{
    level: number;
    count: number;
  }>;
  performers: {
    top: Array<{
      name: string;
      matrix: string;
      score: number;
      change: number;
    }>;
    bottom: Array<{
      name: string;
      matrix: string;
      score: number;
      change: number;
    }>;
  };
  maturityAnalysis: Array<{
    teamName: string;
    data: Array<{
      category: string;
      score: number;
      target: number;
    }>;
  }>;
  teamComparison: Array<{
    teamName: string;
    observability: number;
    security: number;
    dora: number;
    cloudNative: number;
  }>;
  trends: Array<{
    date: string;
    averageScore: number;
    assessmentCount: number;
  }>;
}

export interface ReportsFilters {
  dateRange?: DateRange;
  organisationId?: string;
  teamId?: string;
}

export async function fetchReportsData(filters?: ReportsFilters): Promise<ReportsData> {
  const queryParams = new URLSearchParams();
  
  if (filters?.dateRange?.from) {
    queryParams.set('fromDate', filters.dateRange.from.toISOString());
  }
  if (filters?.dateRange?.to) {
    queryParams.set('toDate', filters.dateRange.to.toISOString());
  }
  if (filters?.organisationId) {
    queryParams.set('organisationId', filters.organisationId);
  }
  if (filters?.teamId) {
    queryParams.set('teamId', filters.teamId);
  }

  const response = await fetch(`/api/reports?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch reports data');
  }

  return response.json();
}

export async function exportReportsData(filters?: ReportsFilters): Promise<Blob> {
  const queryParams = new URLSearchParams();
  queryParams.set('export', 'true');
  
  if (filters?.dateRange?.from) {
    queryParams.set('fromDate', filters.dateRange.from.toISOString());
  }
  if (filters?.dateRange?.to) {
    queryParams.set('toDate', filters.dateRange.to.toISOString());
  }
  if (filters?.organisationId) {
    queryParams.set('organisationId', filters.organisationId);
  }
  if (filters?.teamId) {
    queryParams.set('teamId', filters.teamId);
  }

  const response = await fetch(`/api/reports/export?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to export reports data');
  }

  return response.blob();
}

export async function fetchComparisonData(filters: ComparisonFilters): Promise<ComparisonData> {
  const queryParams = new URLSearchParams();
  queryParams.set('comparisonType', filters.comparisonType);
  queryParams.set('matrixType', filters.matrixType);
  queryParams.set('entities', JSON.stringify(filters.entities));
  
  if (filters.dateRange?.from) {
    queryParams.set('fromDate', filters.dateRange.from.toISOString());
  }
  if (filters.dateRange?.to) {
    queryParams.set('toDate', filters.dateRange.to.toISOString());
  }

  const response = await fetch(`/api/reports/comparison?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch comparison data');
  }

  return response.json();
}

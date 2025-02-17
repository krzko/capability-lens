import { NextResponse } from 'next/server';
import { TrendsData } from '@/lib/services/reports';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timeUnit = searchParams.get('timeUnit');
  const matrixType = searchParams.get('matrixType');
  const fromDate = searchParams.get('fromDate');
  const toDate = searchParams.get('toDate');

  // TODO: Replace with actual database queries
  const mockData: TrendsData = {
    facets: [
      'Code Quality',
      'Testing',
      'Deployment',
      'Security',
      'Observability',
    ],
    trendData: [
      {
        date: '2024-01-01',
        'Code Quality': 3.2,
        'Testing': 3.5,
        'Deployment': 3.0,
        'Security': 3.3,
        'Observability': 3.1,
      },
      {
        date: '2024-02-01',
        'Code Quality': 3.4,
        'Testing': 3.6,
        'Deployment': 3.2,
        'Security': 3.4,
        'Observability': 3.3,
      },
      {
        date: '2024-03-01',
        'Code Quality': 3.6,
        'Testing': 3.8,
        'Deployment': 3.5,
        'Security': 3.6,
        'Observability': 3.4,
      },
      {
        date: '2024-04-01',
        'Code Quality': 3.7,
        'Testing': 3.9,
        'Deployment': 3.6,
        'Security': 3.7,
        'Observability': 3.6,
      },
      {
        date: '2024-05-01',
        'Code Quality': 3.8,
        'Testing': 4.0,
        'Deployment': 3.7,
        'Security': 3.8,
        'Observability': 3.7,
      },
    ],
    deltaData: [
      {
        facet: 'Testing',
        currentScore: 4.0,
        previousScore: 3.5,
        changePercentage: 14.3,
      },
      {
        facet: 'Code Quality',
        currentScore: 3.8,
        previousScore: 3.2,
        changePercentage: 18.8,
      },
      {
        facet: 'Security',
        currentScore: 3.8,
        previousScore: 3.3,
        changePercentage: 15.2,
      },
      {
        facet: 'Observability',
        currentScore: 3.7,
        previousScore: 3.1,
        changePercentage: 19.4,
      },
      {
        facet: 'Deployment',
        currentScore: 3.7,
        previousScore: 3.0,
        changePercentage: 23.3,
      },
    ],
    snapshotData: [
      {
        facet: 'Code Quality',
        q1Score: 3.2,
        q2Score: 3.5,
        q3Score: 3.7,
        q4Score: 3.8,
        trend: 'up',
      },
      {
        facet: 'Testing',
        q1Score: 3.5,
        q2Score: 3.7,
        q3Score: 3.9,
        q4Score: 4.0,
        trend: 'up',
      },
      {
        facet: 'Deployment',
        q1Score: 3.0,
        q2Score: 3.3,
        q3Score: 3.6,
        q4Score: 3.7,
        trend: 'up',
      },
      {
        facet: 'Security',
        q1Score: 3.3,
        q2Score: 3.5,
        q3Score: 3.7,
        q4Score: 3.8,
        trend: 'up',
      },
      {
        facet: 'Observability',
        q1Score: 3.1,
        q2Score: 3.4,
        q3Score: 3.6,
        q4Score: 3.7,
        trend: 'up',
      },
    ],
  };

  return NextResponse.json(mockData);
}

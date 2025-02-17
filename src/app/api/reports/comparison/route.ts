import { NextResponse } from 'next/server';
import { ComparisonData } from '@/lib/services/reports';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const comparisonType = searchParams.get('comparisonType');
  const matrixType = searchParams.get('matrixType');
  const entities = JSON.parse(searchParams.get('entities') || '[]');
  const fromDate = searchParams.get('fromDate');
  const toDate = searchParams.get('toDate');

  // TODO: Replace with actual database queries
  const mockData: ComparisonData = {
    chartData: [
      {
        category: 'Overall Maturity',
        [entities[0]]: 3.5,
        [entities[1]]: 3.2,
        [entities[2]]: 3.8,
      },
      {
        category: 'Code Quality',
        [entities[0]]: 3.8,
        [entities[1]]: 3.4,
        [entities[2]]: 3.6,
      },
      {
        category: 'Testing',
        [entities[0]]: 3.2,
        [entities[1]]: 3.6,
        [entities[2]]: 3.9,
      },
      {
        category: 'Deployment',
        [entities[0]]: 3.6,
        [entities[1]]: 3.1,
        [entities[2]]: 3.7,
      },
    ],
    insights: [
      {
        type: 'improvement',
        title: 'Testing Excellence',
        description: `${entities[2]} leads in testing practices with a score of 3.9`,
        value: '+15% above average',
        trend: 'up',
      },
      {
        type: 'gap',
        title: 'Deployment Gap',
        description: `${entities[1]} shows room for improvement in deployment practices`,
        value: '-20% below average',
        trend: 'down',
      },
      {
        type: 'recommendation',
        title: 'Knowledge Sharing Opportunity',
        description: `Consider pairing ${entities[1]} with ${entities[2]} for testing practices improvement`,
      },
    ],
    tableData: [
      {
        category: 'Code Quality',
        facet: 'Code Reviews',
        entities: {
          [entities[0]]: { score: 3.8, delta: 5 },
          [entities[1]]: { score: 3.4, delta: -2 },
          [entities[2]]: { score: 3.6, delta: 3 },
        },
      },
      {
        category: 'Code Quality',
        facet: 'Documentation',
        entities: {
          [entities[0]]: { score: 3.5, delta: 2 },
          [entities[1]]: { score: 3.3, delta: 1 },
          [entities[2]]: { score: 3.7, delta: 4 },
        },
      },
      {
        category: 'Testing',
        facet: 'Unit Tests',
        entities: {
          [entities[0]]: { score: 3.2, delta: -1 },
          [entities[1]]: { score: 3.6, delta: 3 },
          [entities[2]]: { score: 3.9, delta: 6 },
        },
      },
      {
        category: 'Testing',
        facet: 'Integration Tests',
        entities: {
          [entities[0]]: { score: 3.4, delta: 2 },
          [entities[1]]: { score: 3.5, delta: 4 },
          [entities[2]]: { score: 3.8, delta: 5 },
        },
      },
      {
        category: 'Deployment',
        facet: 'CI/CD',
        entities: {
          [entities[0]]: { score: 3.6, delta: 3 },
          [entities[1]]: { score: 3.1, delta: -3 },
          [entities[2]]: { score: 3.7, delta: 4 },
        },
      },
    ],
  };

  return NextResponse.json(mockData);
}

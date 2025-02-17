import { NextResponse } from 'next/server';

// Mock data for reports
const mockData = {
  summaryStats: {
    averageMaturity: 3.6,
    maturityChange: 0.3,
    totalAssessments: 47,
    pendingReviews: 12,
    teamsImproved: {
      percentage: 76,
      count: 19,
      total: 25,
    },
  },
  matrixComparison: [
    { matrix: 'Observability', score: 3.8 },
    { matrix: 'Security', score: 3.2 },
    { matrix: 'DORA', score: 4.1 },
    { matrix: 'Cloud Native', score: 3.5 },
  ],
  maturityDistribution: [
    { level: 1, count: 5 },
    { level: 2, count: 12 },
    { level: 3, count: 18 },
    { level: 4, count: 8 },
    { level: 5, count: 3 },
  ],
  performers: {
    top: [
      { name: 'Team Alpha', matrix: 'Security', score: 4.8, change: 0.5 },
      { name: 'Team Beta', matrix: 'DORA', score: 4.6, change: 0.3 },
      { name: 'Team Gamma', matrix: 'Observability', score: 4.5, change: 0.4 },
    ],
    bottom: [
      { name: 'Team Delta', matrix: 'Cloud Native', score: 2.1, change: -0.3 },
      { name: 'Team Epsilon', matrix: 'Security', score: 2.3, change: -0.2 },
      { name: 'Team Zeta', matrix: 'DORA', score: 2.4, change: -0.1 },
    ],
  },
  maturityAnalysis: [
    {
      teamName: 'Team Alpha',
      data: [
        { category: 'Observability', score: 4.2, target: 5.0 },
        { category: 'Security', score: 4.8, target: 5.0 },
        { category: 'DORA', score: 4.0, target: 4.5 },
        { category: 'Cloud Native', score: 3.8, target: 4.5 },
      ],
    },
    {
      teamName: 'Team Beta',
      data: [
        { category: 'Observability', score: 3.5, target: 4.0 },
        { category: 'Security', score: 3.8, target: 4.5 },
        { category: 'DORA', score: 4.6, target: 5.0 },
        { category: 'Cloud Native', score: 3.9, target: 4.5 },
      ],
    },
  ],
  teamComparison: [
    {
      teamName: 'Team Alpha',
      observability: 4.2,
      security: 4.8,
      dora: 4.0,
      cloudNative: 3.8,
    },
    {
      teamName: 'Team Beta',
      observability: 3.5,
      security: 3.8,
      dora: 4.6,
      cloudNative: 3.9,
    },
    {
      teamName: 'Team Gamma',
      observability: 4.5,
      security: 3.6,
      dora: 3.8,
      cloudNative: 3.7,
    },
  ],
  trends: [
    { date: '2025-01-17', averageScore: 3.2, assessmentCount: 15 },
    { date: '2025-01-24', averageScore: 3.4, assessmentCount: 12 },
    { date: '2025-01-31', averageScore: 3.5, assessmentCount: 18 },
    { date: '2025-02-07', averageScore: 3.6, assessmentCount: 14 },
    { date: '2025-02-14', averageScore: 3.6, assessmentCount: 16 },
  ],
};

export async function GET() {
  return NextResponse.json(mockData);
}

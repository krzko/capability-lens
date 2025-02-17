import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get all services with their teams and assessments
    const services = await prisma.service.findMany({
      include: {
        team: true,
        assessments: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            template: {
              include: {
                facets: true,
              },
            },
          },
        },
      },
    });

    // Calculate statistics
    const totalServices = services.length;
    const teams = new Set(services.map(service => service.team.id));
    const totalTeams = teams.size;

    // Calculate average maturity
    let totalMaturity = 0;
    let servicesWithAssessments = 0;

    services.forEach(service => {
      if (service.assessments.length > 0) {
        const latestAssessment = service.assessments[0];
        const scores = Object.values(latestAssessment.scores as Record<string, number>);
        if (scores.length > 0) {
          const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
          totalMaturity += avgScore;
          servicesWithAssessments++;
        }
      }
    });

    const averageMaturity = servicesWithAssessments > 0
      ? Number((totalMaturity / servicesWithAssessments).toFixed(2))
      : 0;

    // Count recent assessments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAssessments = services.reduce((count, service) => {
      return count + service.assessments.filter(assessment => 
        new Date(assessment.createdAt) >= thirtyDaysAgo
      ).length;
    }, 0);

    return NextResponse.json({
      totalServices,
      totalTeams,
      averageMaturity,
      recentAssessments,
    });
  } catch (error) {
    console.error('Error calculating stats:', error);
    return NextResponse.json(
      { error: 'Failed to calculate stats' },
      { status: 500 }
    );
  }
}

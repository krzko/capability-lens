import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    // First await the params object itself
    const params = await context.params;
    
    if (!params?.id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const { id } = params;

    const assessments = await prisma.assessment.findMany({
      where: {
        serviceId: id,
      },
      include: {
        template: {
          select: {
            id: true,
            name: true,
          },
        },
        service: {
          include: {
            team: {
              include: {
                organisation: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate overall score for each assessment
    const assessmentsWithScores = assessments.map(assessment => {
      const scores = Object.values(assessment.scores as Record<string, number>);
      const overallScore = scores.length > 0
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length
        : undefined;

      return {
        ...assessment,
        overallScore
      };
    });

    return NextResponse.json(assessmentsWithScores);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    );
  }
}
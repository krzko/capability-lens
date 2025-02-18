import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: { assessmentId: string } }
) {
  try {
    const params = await context.params;
    const assessmentId = params.assessmentId;

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        template: {
          include: {
            facets: {
              include: {
                levels: true
              }
            }
          }
        },
        service: {
          include: {
            team: {
              include: {
                organisation: true
              }
            }
          }
        }
      }
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    // Get previous assessment for comparison
    const previousAssessment = await prisma.assessment.findFirst({
      where: {
        serviceId: assessment.serviceId,
        id: { not: assessmentId },
        createdAt: { lt: assessment.createdAt }
      },
      orderBy: { createdAt: 'desc' },
      select: { scores: true }
    });

    // Calculate overall scores
    const validScores = Object.values(assessment.scores as Record<string, number>).filter(score => score > 0);
    const overallScore = validScores.length > 0
      ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
      : 0;

    const validPreviousScores = previousAssessment?.scores
      ? Object.values(previousAssessment.scores as Record<string, number>).filter(score => score > 0)
      : [];
    const previousOverallScore = validPreviousScores.length > 0
      ? validPreviousScores.reduce((sum, score) => sum + score, 0) / validPreviousScores.length
      : 0;

    // Calculate facet scores
    const facetScores = assessment.template.facets.map(facet => ({
      id: facet.id,
      name: facet.name,
      score: (assessment.scores as Record<string, number>)[facet.id] || 0,
      previousScore: previousAssessment?.scores 
        ? (previousAssessment.scores as Record<string, number>)[facet.id] || 0
        : 0
    }));

    return NextResponse.json({
      ...assessment,
      overallScore,
      previousOverallScore,
      facetScores,
      previousScores: previousAssessment?.scores || {}
    });
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment' },
      { status: 500 }
    );
  }
}

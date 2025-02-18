import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { serviceId: string; assessmentId: string } }
) {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: {
        id: params.assessmentId,
      },
      include: {
        template: true,
        service: {
          include: {
            team: {
              include: {
                organisation: true,
              },
            },
          },
        },
        assessmentFacets: {
          include: {
            facet: true,
          },
        },
      },
    });

    if (!assessment) {
      return new NextResponse('Assessment not found', { status: 404 });
    }

    // Get previous assessment for comparison
    const previousAssessment = await prisma.assessment.findFirst({
      where: {
        serviceId: params.serviceId,
        templateId: assessment.templateId,
        createdAt: {
          lt: assessment.createdAt,
        },
      },
      include: {
        assessmentFacets: {
          include: {
            facet: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get historical assessments for trends
    const historicalAssessments = await prisma.assessment.findMany({
      where: {
        serviceId: params.serviceId,
        templateId: assessment.templateId,
        createdAt: {
          lte: assessment.createdAt,
        },
      },
      include: {
        assessmentFacets: {
          include: {
            facet: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Transform the data to include previous scores and historical data
    const transformedAssessment = {
      ...assessment,
      facets: assessment.assessmentFacets.map(af => {
        const previousFacet = previousAssessment?.assessmentFacets.find(
          paf => paf.facetId === af.facetId
        );

        const historicalData = historicalAssessments.map(ha => ({
          date: ha.createdAt,
          score: ha.assessmentFacets.find(haf => haf.facetId === af.facetId)?.score || 0,
        }));

        return {
          name: af.facet.name,
          score: af.score,
          previousScore: previousFacet?.score || af.score,
          description: af.facet.description,
          recommendations: af.facet.recommendations || [],
          evidence: af.evidence,
          historicalData,
        };
      }),
    };

    return NextResponse.json(transformedAssessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

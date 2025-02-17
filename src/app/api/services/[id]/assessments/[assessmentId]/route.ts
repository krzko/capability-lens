import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: { id: string; assessmentId: string } }
) {
  try {
    // First await the params object itself
    const params = await context.params;
    const serviceId = params.id;
    const assessmentId = params.assessmentId;

    const assessment = await prisma.assessment.findFirst({
      where: {
        AND: [
          { id: assessmentId },
          { serviceId: serviceId }
        ]
      },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            description: true,
            templateSchema: true,
            version: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            team: {
              select: {
                id: true,
                name: true,
                organisation: {
                  select: {
                    id: true,
                    name: true
                  }
                }
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

    // Transform the data to match the expected format
    const transformedAssessment = {
      ...assessment,
      scores: assessment.scores || {},
      template: {
        ...assessment.template,
        templateSchema: assessment.template.templateSchema || {}
      }
    };

    return NextResponse.json(transformedAssessment);
  } catch (error) {
    console.error('Error fetching assessment:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to fetch assessment' },
      { status: 500 }
    );
  }
}

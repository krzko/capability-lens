import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: {
        id,
      },
      include: {
        team: {
          include: {
            organisation: {
              select: {
                name: true,
              },
            },
          },
        },
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

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Transform the data to match dashboard format
    const formattedService = {
      id: service.id,
      name: service.name,
      team: {
        name: service.team.name,
        organisation: {
          name: service.team.organisation.name
        }
      },
      assessments: service.assessments.map(assessment => {
        // Create a map of facet IDs to names
        const facetMap = new Map(
          assessment.template.facets.map(f => [f.id, f.name])
        );

        return {
          id: assessment.id,
          createdAt: assessment.createdAt,
          templateName: assessment.template.name,
          facets: Object.entries(assessment.scores as Record<string, number>).map(([id, score]) => ({
            name: facetMap.get(id) || id,
            score: score,
            maxScore: 5
          }))
        };
      })
    };

    return NextResponse.json(formattedService);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

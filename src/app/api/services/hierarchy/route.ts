import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
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
                name: true,
              },
            },
          },
        },
        assessments: {
          select: {
            id: true,
          },
        },
      },
    });

    const servicesWithHierarchy = services.map(service => ({
      id: service.id,
      name: service.name,
      team: service.team,
      hasAssessments: service.assessments.length > 0,
    }));

    return NextResponse.json(servicesWithHierarchy);
  } catch (error) {
    console.error('Error fetching service hierarchy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service hierarchy' },
      { status: 500 }
    );
  }
}

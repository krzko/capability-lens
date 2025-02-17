import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    serviceId: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { serviceId } = params;

    const assessments = await prisma.assessment.findMany({
      where: {
        serviceId: serviceId,
      },
      include: {
        template: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    );
  }
}

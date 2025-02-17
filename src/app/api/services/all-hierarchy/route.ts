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
      },
      orderBy: [
        {
          team: {
            organisation: {
              name: 'asc',
            },
          },
        },
        {
          team: {
            name: 'asc',
          },
        },
        {
          name: 'asc',
        },
      ],
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching service hierarchy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service hierarchy' },
      { status: 500 }
    );
  }
}

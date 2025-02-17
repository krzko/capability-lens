import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  teamId: z.string().min(1, 'Team is required'),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    const services = await prisma.service.findMany({
      where: teamId
        ? {
            teamId,
            team: {
              organisation: {
                users: {
                  some: {
                    userId: session.user.id,
                  },
                },
              },
            },
          }
        : {
            team: {
              organisation: {
                users: {
                  some: {
                    userId: session.user.id,
                  },
                },
              },
            },
          },
      include: {
        team: {
          include: {
            organisation: true,
          },
        },
        assessments: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            createdAt: true,
            scores: true,
            template: {
              select: {
                id: true,
                name: true,
                facets: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const validatedData = serviceSchema.parse(json);

    // Check if user has access to the team's organisation
    const team = await prisma.team.findFirst({
      where: {
        id: validatedData.teamId,
        organisation: {
          users: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const service = await prisma.service.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        teamId: validatedData.teamId,
      },
      include: {
        team: {
          include: {
            organisation: true,
          },
        },
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

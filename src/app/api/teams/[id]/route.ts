import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Session } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

type AuthSession = Session & {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};



const teamSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
});

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = (await getServerSession(authOptions)) as AuthSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const team = await prisma.team.findFirst({
      where: {
        id,
        organisation: {
          users: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        organisation: true,
        services: {
          include: {
            assessments: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = (await getServerSession(authOptions)) as AuthSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    let json;
    try {
      json = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    let validatedData;
    try {
      validatedData = teamSchema.parse(json);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return NextResponse.json({ 
          error: 'Validation error', 
          details: e.errors.map(err => ({ 
            path: err.path.join('.'), 
            message: err.message 
          }))
        }, { status: 400 });
      }
      throw e;
    }

    // Check if team exists and user has access
    const team = await prisma.team.findFirst({
      where: {
        id,
        organisation: {
          users: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        organisation: true,
      },
    });

    if (!team) {
      return NextResponse.json({ 
        error: 'Not found', 
        message: 'Team not found or you do not have access' 
      }, { status: 404 });
    }

    const updatedTeam = await prisma.team.update({
      where: { id },
      data: {
        name: validatedData.name,
      },
      include: {
        organisation: true,
        services: true,
      },
    });

    return NextResponse.json(updatedTeam);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = (await getServerSession(authOptions)) as AuthSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if team exists and user has access
    const team = await prisma.team.findFirst({
      where: {
        id,
        organisation: {
          users: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        services: true,
        organisation: true,
      },
    });

    if (!team) {
      return NextResponse.json({ 
        error: 'Not found', 
        message: 'Team not found or you do not have access' 
      }, { status: 404 });
    }

    // Check if team has any services
    if (team.services.length > 0) {
      return NextResponse.json({ 
        error: 'Conflict', 
        message: 'Cannot delete team with existing services' 
      }, { status: 409 });
    }

    // Delete the team
    await prisma.team.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Team deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

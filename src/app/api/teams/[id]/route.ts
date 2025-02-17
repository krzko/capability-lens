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

    const team = await prisma.team.findFirst({
      where: {
        id,
        organisation: {
          users: {
            some: {
              userId: session.user.id,
              role: 'admin',
            },
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const json = await request.json();
    const validatedData = teamSchema.parse(json);

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

    const team = await prisma.team.findFirst({
      where: {
        id,
        organisation: {
          users: {
            some: {
              userId: session.user.id,
              role: 'admin',
            },
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check for associated services
    const servicesCount = await prisma.service.count({
      where: { teamId: id },
    });

    if (servicesCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete team: Please remove all services first' },
        { status: 400 }
      );
    }

    await prisma.team.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import type { Route } from 'next';

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

const organisationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = (await getServerSession(authOptions)) as AuthSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organisation = await prisma.organisation.findFirst({
      where: {
        id,
        users: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        teams: {
          include: {
            services: true,
          },
        },
        users: true,
      },
    });

    if (!organisation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(organisation);
  } catch (error) {
    console.error('Error fetching organisation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = (await getServerSession(authOptions)) as AuthSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin access
    const userAccess = await prisma.organisationUser.findFirst({
      where: {
        organisationId: id,
        userId: session.user.id,
        role: 'admin',
      },
    });

    if (!userAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const json = await req.json();
    const validatedData = organisationSchema.parse(json);

    const organisation = await prisma.organisation.update({
      where: { id },
      data: {
        name: validatedData.name,
      },
    });

    return NextResponse.json(organisation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating organisation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = (await getServerSession(authOptions)) as AuthSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin access
    const userAccess = await prisma.organisationUser.findFirst({
      where: {
        organisationId: id,
        userId: session.user.id,
        role: 'admin',
      },
    });

    if (!userAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check for associated teams
    const teamsCount = await prisma.team.count({
      where: { organisationId: id },
    });

    if (teamsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete organisation: Please remove all teams first' },
        { status: 400 }
      );
    }

    await prisma.organisation.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting organisation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

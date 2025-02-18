import { NextRequest, NextResponse } from 'next/server';
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
  organisationId: z.string().min(1, 'Organisation is required'),
});

export async function GET(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as AuthSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organisationId = searchParams.get('organisationId');

    const teams = await prisma.team.findMany({
      where: organisationId
        ? {
            organisationId,
            organisation: {
              users: {
                some: {
                  userId: session.user.id,
                },
              },
            },
          }
        : {
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
        services: true,
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as AuthSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Check if user has access to the organisation
    const userAccess = await prisma.organisationUser.findFirst({
      where: {
        organisationId: validatedData.organisationId,
        userId: session.user.id,
      },
    });

    if (!userAccess) {
      return NextResponse.json({ 
        error: 'Forbidden', 
        message: 'You do not have access to this organisation' 
      }, { status: 403 });
    }

    const team = await prisma.team.create({
      data: {
        name: validatedData.name,
        organisationId: validatedData.organisationId,
      },
      include: {
        organisation: true,
        services: true,
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

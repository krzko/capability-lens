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

// Input validation schema
const organisationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
});

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as AuthSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organisations = await prisma.organisation.findMany({
      include: {
        teams: true,
        users: {
          where: {
            userId: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(organisations);
  } catch (error) {
    console.error('Error fetching organisations:', error);
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

    const json = await request.json();
    const validatedData = organisationSchema.parse(json);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const organisation = await prisma.organisation.create({
      data: {
        name: validatedData.name,
        users: {
          create: {
            userId: session.user.id,
            role: 'admin',
          },
        },
      },
    });

    return NextResponse.json(organisation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error creating organisation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

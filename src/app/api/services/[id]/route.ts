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



const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
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

    const service = await prisma.service.findFirst({
      where: {
        id,
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
          include: {
            template: {
              include: {
                facets: {
                  include: {
                    levels: {
                      orderBy: {
                        number: 'asc',
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
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

    const service = await prisma.service.findFirst({
      where: {
        id,
        team: {
          organisation: {
            users: {
              some: {
                userId: session.user.id,
                role: 'admin',
              },
            },
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const json = await request.json();
    const validatedData = serviceSchema.parse(json);

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
      },
      include: {
        team: {
          include: {
            organisation: true,
          },
        },
      },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating service:', error);
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

    const service = await prisma.service.findFirst({
      where: {
        id,
        team: {
          organisation: {
            users: {
              some: {
                userId: session.user.id,
                role: 'admin',
              },
            },
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.service.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

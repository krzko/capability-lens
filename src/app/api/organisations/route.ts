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
      where: {
        users: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        teams: {
          include: {
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
        },
        users: {
          where: {
            userId: session.user.id,
          },
        },
      },
    });

    // Calculate maturity and last assessment for each organisation
    const enrichedOrganisations = organisations.map(org => {
      let totalMaturity = 0;
      let totalServices = 0;
      let latestAssessmentDate = null;
      let previousMaturity = 0;

      org.teams.forEach(team => {
        team.services.forEach(service => {
          totalServices++;
          if (service.assessments && service.assessments.length > 0) {
            const latestAssessment = service.assessments[0];
            totalMaturity += latestAssessment.score || 0;
            
            const assessmentDate = new Date(latestAssessment.createdAt);
            if (!latestAssessmentDate || assessmentDate > new Date(latestAssessmentDate)) {
              latestAssessmentDate = latestAssessment.createdAt;
            }

            // Get previous assessment for trend
            if (service.assessments.length > 1) {
              previousMaturity += service.assessments[1].score || 0;
            }
          }
        });
      });

      const avgMaturity = totalServices > 0 ? totalMaturity / totalServices : 0;
      const avgPreviousMaturity = totalServices > 0 ? previousMaturity / totalServices : 0;
      const maturityTrend = avgMaturity - avgPreviousMaturity;

      return {
        ...org,
        maturity: {
          current: avgMaturity,
          trend: maturityTrend,
        },
        lastAssessmentDate: latestAssessmentDate,
      };
    });

    return NextResponse.json(enrichedOrganisations);
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

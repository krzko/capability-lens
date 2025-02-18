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
      console.log(`Calculating maturity for org: ${org.name}`);
      let totalMaturity = 0;
      let totalServices = 0;
      let latestAssessmentDate = null;
      let previousMaturity = 0;

      org.teams.forEach(team => {
        team.services.forEach(service => {
          if (service.assessments && service.assessments.length > 0) {
            const latestAssessment = service.assessments[0];
            if (latestAssessment.scores) {
              const scores = Object.values(latestAssessment.scores);
              if (scores.length > 0) {
                totalServices++;
                const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
                totalMaturity += avgScore;
                
                const assessmentDate = new Date(latestAssessment.createdAt);
                if (!latestAssessmentDate || assessmentDate > new Date(latestAssessmentDate)) {
                  latestAssessmentDate = latestAssessment.createdAt;
                }

                // Calculate previous maturity for trend
                if (service.assessments.length > 1) {
                  const previousAssessment = service.assessments[1];
                  if (previousAssessment.scores) {
                    const prevScores = Object.values(previousAssessment.scores);
                    if (prevScores.length > 0) {
                      const prevAvgScore = prevScores.reduce((a, b) => a + b, 0) / prevScores.length;
                      previousMaturity += prevAvgScore;
                    }
                  }
                }
              }
            }
          }
        });
      });

      const avgMaturity = totalServices > 0 ? totalMaturity / totalServices : 0;
      const avgPreviousMaturity = totalServices > 0 ? previousMaturity / totalServices : 0;
      const maturityTrend = avgMaturity - avgPreviousMaturity;

      console.log(`Org ${org.name} final stats:`, {
        totalServices,
        totalMaturity,
        avgMaturity,
        maturityTrend,
        lastAssessmentDate: latestAssessmentDate
      });

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

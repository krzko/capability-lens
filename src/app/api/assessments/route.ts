import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// Input validation schemas
const createAssessmentSchema = z.object({
  serviceId: z.string(),
  templateId: z.string(),
  scores: z.record(z.string(), z.number().min(1).max(5))
});

const updateAssessmentSchema = z.object({
  scores: z.record(z.string(), z.number().min(1).max(5))
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const validatedData = createAssessmentSchema.parse(json);

    // Verify service exists and user has access
    const service = await prisma.service.findFirst({
      where: {
        id: validatedData.serviceId,
        team: {
          organisation: {
            users: {
              some: {
                userId: session.user.id
              }
            }
          }
        }
      }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found or access denied' },
        { status: 404 }
      );
    }

    // Create assessment
    const assessment = await prisma.assessment.create({
      data: {
        serviceId: validatedData.serviceId,
        templateId: validatedData.templateId,
        scores: validatedData.scores
      },
      include: {
        template: {
          include: {
            facets: {
              include: {
                levels: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error creating assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const serviceId = searchParams.get('serviceId');

    if (!serviceId) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Verify user has access to the service
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        team: {
          organisation: {
            users: {
              some: {
                userId: session.user.id
              }
            }
          }
        }
      }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found or access denied' },
        { status: 404 }
      );
    }

    const assessments = await prisma.assessment.findMany({
      where: {
        serviceId
      },
      include: {
        template: {
          include: {
            facets: {
              include: {
                levels: {
                  orderBy: {
                    number: 'asc'
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

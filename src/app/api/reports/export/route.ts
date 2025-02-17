import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorised', { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const organisationId = searchParams.get('organisationId');
    const teamId = searchParams.get('teamId');

    // Fetch assessments based on filters
    const assessments = await prisma.assessment.findMany({
      where: {
        ...(fromDate && {
          createdAt: {
            gte: new Date(fromDate),
          },
        }),
        ...(toDate && {
          createdAt: {
            lte: new Date(toDate),
          },
        }),
        ...(organisationId && {
          service: {
            team: {
              organisationId,
            },
          },
        }),
        ...(teamId && {
          service: {
            teamId,
          },
        }),
      },
      include: {
        service: {
          include: {
            team: {
              include: {
                organisation: true,
              },
            },
          },
        },
        template: true,
      },
    });

    // Generate CSV content
    const csvRows = [
      [
        'Service',
        'Team',
        'Organisation',
        'Matrix Type',
        'Maturity Level',
        'Assessment Date',
      ],
      ...assessments.map((assessment) => [
        assessment.service.name,
        assessment.service.team.name,
        assessment.service.team.organisation.name,
        assessment.template.name,
        assessment.maturityLevel.toString(),
        format(assessment.createdAt, 'dd/MM/yyyy'),
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    const filename = `maturity-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse('Export failed', { status: 500 });
  }
}

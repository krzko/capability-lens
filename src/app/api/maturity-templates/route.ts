import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = await prisma.maturityTemplate.findMany({
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
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching maturity templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

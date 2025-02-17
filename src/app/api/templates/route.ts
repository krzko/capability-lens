import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { templateSchema } from '@/types/template-schema';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const templates = await prisma.maturityTemplate.findMany({
      include: {
        facets: {
          include: {
            levels: true,
          },
        },
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const json = await request.json();
    
    // Add default version if not present
    const templateData = {
      ...json,
      version: json.version || '1.0.0'
    };

    // Validate the template data
    const validatedTemplate = templateSchema.parse(templateData);

    // Create template with facets and levels
    // First, create the template
    const template = await prisma.maturityTemplate.create({
      data: {
        name: validatedTemplate.name,
        description: validatedTemplate.description,
        templateSchema: templateData,
        version: validatedTemplate.version || '0.1.0',
        createdBy: session.user.id,
        // Create facets and their levels
        facets: {
          create: validatedTemplate.facets.map(facet => ({
            name: facet.name,
            description: facet.description || null,
            levels: {
              create: facet.levels.map(level => ({
                number: level.number,
                name: level.name,
                description: level.description,
              })),
            },
          })),
        },
      },
      include: {
        facets: {
          include: {
            levels: true,
          },
        },
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error creating template:', error instanceof Error ? error.message : error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }

    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'Invalid template format', 
        details: error.errors 
      }, { status: 400 });
    }
    
    if (error.code) {
      return NextResponse.json({ 
        error: 'Database error', 
        details: error.message 
      }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}

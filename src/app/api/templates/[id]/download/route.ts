import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.maturityTemplate.findUnique({
      where: { id: params.id },
      include: {
        facets: {
          include: {
            levels: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Convert template to downloadable format
    const downloadableTemplate = {
      name: template.name,
      description: template.description || '',
      version: template.version || '0.1.0',
      facets: template.facets.map(facet => ({
        name: facet.name,
        description: facet.description || '',
        levels: facet.levels
          .sort((a, b) => a.number - b.number) // Sort levels by number
          .map(level => ({
            number: level.number,
            name: level.name,
            description: level.description,
          })),
      })),
    };

    // Format JSON with proper indentation
    const formattedJson = JSON.stringify(downloadableTemplate, null, 2);

    // Set headers for file download
    return new NextResponse(formattedJson, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename=${template.name.toLowerCase().replace(/\s+/g, '-')}-template.json`,
      },
    });
  } catch (error) {
    console.error('Error downloading template:', error);
    return NextResponse.json({ error: 'Failed to download template' }, { status: 500 });
  }
}

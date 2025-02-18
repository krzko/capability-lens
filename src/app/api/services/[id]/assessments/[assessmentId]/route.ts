import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: { id: string; assessmentId: string } }
) {
  console.log('Starting assessment fetch with params:', context.params);
  try {
    // First await the params object itself
    const params = await context.params;
    const serviceId = params.id;
    const assessmentId = params.assessmentId;

    // Get previous assessment for comparison
    const previousAssessment = await prisma.assessment.findFirst({
      where: {
        serviceId: serviceId,
        id: { not: assessmentId },
        createdAt: {
          lt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        scores: true,
        createdAt: true
      }
    });

    // Get historical assessments for trends
    const historicalAssessments = await prisma.assessment.findMany({
      where: {
        serviceId: serviceId,
        createdAt: {
          lte: new Date()
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        id: true,
        scores: true,
        createdAt: true
      }
    });

    console.log('Fetching assessment with ID:', assessmentId);
    const assessment = await prisma.assessment.findFirst({
      where: {
        AND: [
          { id: assessmentId },
          { serviceId: serviceId }
        ]
      },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            description: true,
            templateSchema: true,
            version: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            team: {
              select: {
                id: true,
                name: true,
                organisation: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });
    
    console.log('Assessment found:', {
      id: assessment?.id,
      templateId: assessment?.templateId,
      hasTemplate: !!assessment?.template,
      hasTemplateSchema: !!assessment?.template?.templateSchema,
      hasService: !!assessment?.service,
      hasTeam: !!assessment?.service?.team
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    // Calculate overall score and transform facet data
    if (!assessment?.template?.templateSchema) {
      console.error('Missing template schema for assessment:', {
        assessmentId,
        templateId: assessment?.templateId,
        template: assessment?.template
      });
      return NextResponse.json(
        { error: 'Assessment template schema not found' },
        { status: 500 }
      );
    }

    const templateSchema = assessment.template.templateSchema as any;
    console.log('Template Schema:', JSON.stringify(templateSchema, null, 2));
    
    // Handle scores that might be direct numbers or objects with score property
    const scores = assessment.scores as Record<string, number>;
    const normalizedScores = Object.entries(scores).reduce((acc, [key, value]) => {
      acc[key] = { score: value };
      return acc;
    }, {} as Record<string, { score: number; evidence?: string }>);
    console.log('Normalized Scores:', JSON.stringify(normalizedScores, null, 2));
    
    const previousScores = previousAssessment?.scores as Record<string, number> | undefined;
    const normalizedPreviousScores = previousScores ? Object.entries(previousScores).reduce((acc, [key, value]) => {
      acc[key] = { score: value };
      return acc;
    }, {} as Record<string, { score: number; evidence?: string }>) : undefined;
    console.log('Normalized Previous Scores:', JSON.stringify(normalizedPreviousScores, null, 2));
    
    // Get all facets from the database
    const facets = await prisma.facet.findMany({
      where: { templateId: assessment.templateId },
      orderBy: { name: 'asc' }
    });

    console.log('Database facets:', JSON.stringify(facets, null, 2));
    console.log('Current scores:', JSON.stringify(normalizedScores, null, 2));
    console.log('Previous scores:', JSON.stringify(normalizedPreviousScores, null, 2));

    // Handle both old (properties-based) and new (facets-based) schema formats
    let facetObjects: any[] = [];
    
    if (templateSchema?.facets) {
      // New format
      facetObjects = templateSchema.facets.map((facetSchema: any) => {
        // Find the matching facet from the database
        const dbFacet = facets.find(f => f.name === facetSchema.name);
        if (!dbFacet) {
          console.warn(`No database facet found for ${facetSchema.name}`);
          return null;
        }

        const currentFacet = normalizedScores[dbFacet.id] || { score: 0 };
        const previousFacet = normalizedPreviousScores?.[dbFacet.id] || { score: 0 };
        
        return createFacetObject(dbFacet.id, facetSchema, currentFacet, previousFacet, historicalAssessments);
      }).filter(Boolean);
    } else if (templateSchema?.properties) {
      // Old format
      facetObjects = Object.entries(templateSchema.properties).map(([facetName, facetSchema]: [string, any]) => {
        // Find the matching facet from the database
        const dbFacet = facets.find(f => f.name === facetName);
        if (!dbFacet) {
          console.warn(`No database facet found for ${facetName}`);
          return null;
        }

        const currentFacet = normalizedScores[dbFacet.id] || { score: 0 };
        const previousFacet = normalizedPreviousScores?.[dbFacet.id] || { score: 0 };
        
        return createFacetObject(dbFacet.id, {
          ...facetSchema,
          name: facetName,
          id: dbFacet.id
        }, currentFacet, previousFacet, historicalAssessments);
      }).filter(Boolean);
    } else {
      console.error('Invalid template schema structure:', templateSchema);
      return NextResponse.json(
        { error: 'Template schema missing both facets and properties' },
        { status: 500 }
      );
    }

    function createFacetObject(facetId: string, facetSchema: any, currentFacet: any, previousFacet: any, historicalAssessments: any[]) {
      console.log('Creating facet object for:', facetId);
      console.log('Facet Schema:', JSON.stringify(facetSchema, null, 2));
      console.log('Current Facet:', JSON.stringify(currentFacet, null, 2));
      
      // Get historical data for this facet
      const historicalData = historicalAssessments.map(ha => {
        const historicalScores = ha.scores as Record<string, { score: number }>;
        return {
          date: ha.createdAt,
          score: historicalScores[facetId]?.score || 0
        };
      });

      // Handle levels from both old and new schema formats
      let levels = [];
      if (Array.isArray(facetSchema.levels)) {
        console.log('Using array levels format');
        // New format - levels is already an array
        levels = facetSchema.levels.map(level => ({
          id: `${facetId}-level-${level.level || level.number}`,
          number: level.level || level.number,
          name: level.name || `Level ${level.level || level.number}`,
          description: level.description || ''
        }));
      } else if (facetSchema.type === 'object' && facetSchema.levels) {
        console.log('Converting object levels format');
        // Old format - convert levels to array format
        levels = Object.entries(facetSchema.levels).map(([number, level]: [string, any]) => ({
          id: `${facetId}-level-${number}`,
          number: parseInt(number, 10),
          name: level.name || `Level ${number}`,
          description: level.description || ''
        }));
      }

      console.log('Processed levels:', JSON.stringify(levels, null, 2));

      // Sort levels by number to ensure correct ordering
      levels = levels.filter(l => l.number != null).sort((a, b) => a.number - b.number);

      // Get the scores from the facet objects
      const score = currentFacet?.score || 0;
      const previousScore = previousFacet?.score || 0;
      
      console.log('Using scores:', { score, previousScore, currentFacet, previousFacet });

      const facetObject = {
        id: facetId,
        name: facetSchema.name || facetId,
        score,
        previousScore,
        description: facetSchema.description || '',
        levels,
        recommendations: facetSchema.recommendations || [],
        evidence: currentFacet.evidence || '',
        historicalData
      };

      console.log('Created facet object:', JSON.stringify(facetObject, null, 2));
      return facetObject;
    }

    // Calculate overall score from facetObjects
    const validScores = facetObjects.map(f => f.score).filter(score => score > 0);
    const validPreviousScores = facetObjects.map(f => f.previousScore).filter(score => score > 0);
    
    const overallScore = validScores.length > 0 ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length : 0;
    const previousOverallScore = validPreviousScores.length > 0 ? validPreviousScores.reduce((sum, score) => sum + score, 0) / validPreviousScores.length : 0;

    const transformedAssessment = {
      ...assessment,
      facets,
      overallScore,
      previousOverallScore,
      template: {
        ...assessment.template,
        templateSchema
      }
    };

    // Calculate next assessment date (3 months from current)
    const nextAssessmentDate = new Date(assessment.createdAt);
    nextAssessmentDate.setMonth(nextAssessmentDate.getMonth() + 3);

    return NextResponse.json({
      ...transformedAssessment,
      nextAssessmentDate
    });
  } catch (error) {
    console.error('Error fetching assessment:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      params: context.params
    });
    return NextResponse.json(
      { error: 'Failed to fetch assessment' },
      { status: 500 }
    );
  }
}

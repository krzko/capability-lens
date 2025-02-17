import { PrismaClient } from '@prisma/client';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { templateSchema } from '../src/types/template-schema';

const prisma = new PrismaClient();

async function seedCoreTemplates() {
  const templatesDir = join(process.cwd(), 'src', 'data', 'core-templates');
  const templateFiles = readdirSync(templatesDir).filter(file => file.endsWith('.json'));

  for (const file of templateFiles) {
    const content = readFileSync(join(templatesDir, file), 'utf-8');
    const template = JSON.parse(content);
    
    try {
      // Validate template against schema
      templateSchema.parse(template);

      // Check if template already exists
      const existingTemplate = await prisma.maturityTemplate.findFirst({
        where: {
          name: template.name,
          isCustom: false,
        },
      });

      if (!existingTemplate) {
        await prisma.maturityTemplate.create({
          data: {
            name: template.name,
            description: template.description,
            version: template.version,
            isCustom: false,
            schema: template,
            facets: {
              create: template.facets.map((facet: any) => ({
                name: facet.name,
                description: facet.description,
                levels: {
                  create: facet.levels.map((level: any) => ({
                    number: level.number,
                    name: level.name,
                    description: level.description,
                  })),
                },
              })),
            },
          },
        });
        console.log(`✅ Seeded template: ${template.name}`);
      } else {
        console.log(`⏭️  Template already exists: ${template.name}`);
      }
    } catch (error) {
      console.error(`❌ Error seeding template ${file}:`, error);
    }
  }
}

seedCoreTemplates()
  .catch((error) => {
    console.error('Error seeding core templates:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { z } from 'zod';

export const levelSchema = z.object({
  number: z.number().int().min(1).max(5),
  name: z.string().min(1),
  description: z.string().min(1),
});

export const facetSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(''),
  levels: z.array(levelSchema)
    .min(1)
    .max(5)
    .transform(levels => levels.sort((a, b) => a.number - b.number)),
});

export const templateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable().default(''),
  version: z.string().regex(/^\d+\.\d+\.\d+$/).optional().nullable().default('0.1.0'),
  facets: z.array(facetSchema).min(1),
}).transform(data => ({
  ...data,
  version: data.version || '0.1.0',
  description: data.description || '',
  facets: data.facets.map(facet => ({
    ...facet,
    description: facet.description || '',
    levels: facet.levels.map(level => ({
      ...level,
      description: level.description.trim(),
    })),
  })),
}));

export type TemplateSchema = z.infer<typeof templateSchema>;
export type FacetSchema = z.infer<typeof facetSchema>;
export type LevelSchema = z.infer<typeof levelSchema>;

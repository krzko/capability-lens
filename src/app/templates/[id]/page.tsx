import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { AssessmentPreview } from '@/components/assessments/AssessmentPreview';

interface TemplatePreviewPageProps {
  params: {
    id: string;
  };
}

export default async function TemplatePreviewPage({ params }: TemplatePreviewPageProps) {
  const template = await prisma.maturityTemplate.findUnique({
    where: {
      id: params.id,
    },
    include: {
      facets: {
        include: {
          levels: true,
        },
      },
    },
  });

  if (!template) {
    notFound();
  }

  return <AssessmentPreview template={template} />;
}

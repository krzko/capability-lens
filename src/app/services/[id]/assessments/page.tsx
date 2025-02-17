'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { MaturityTemplateList } from '@/components/maturity/MaturityTemplateList';
import MaturityAssessmentForm from '@/components/maturity/MaturityAssessmentForm';
import { MaturityAssessmentResults } from '@/components/maturity/MaturityAssessmentResults';
import { useMaturityTemplates, useServiceAssessments } from '@/hooks/useMaturityAssessment';
import { useToast } from '@/components/ui/use-toast';

type AssessmentStep = 'list' | 'form' | 'results';

export default function ServiceAssessmentsPage() {
  const params = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const templateParam = searchParams.get('template');
  const serviceId = params.id as string;
  const [step, setStep] = useState<AssessmentStep>(templateParam ? 'form' : 'list');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templateParam || '');
  const { templates } = useMaturityTemplates();
  const { assessments, createAssessment } = useServiceAssessments(serviceId);
  const { toast } = useToast();

  const selectedTemplate = templates?.find((t) => t.id === selectedTemplateId);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setStep('form');
  };

  const handleAssessmentSubmit = async (scores: Record<string, number>) => {
    try {
      await createAssessment(selectedTemplateId, scores);
      setStep('results');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create assessment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStartNew = () => {
    setStep('list');
    setSelectedTemplateId('');
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Service Assessments</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage service maturity assessments
          </p>
          {(step === 'results' || (assessments && assessments.length > 0)) && (
            <div className="mt-4">
              <Button onClick={handleStartNew}>Start New Assessment</Button>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            {step === 'list' && (
              <div className="space-y-8">
                {assessments && assessments.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Previous Assessments</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Review your past maturity assessments
                    </p>
                    <div className="mt-6 space-y-6">
                      {assessments.map((assessment) => (
                        <MaturityAssessmentResults
                          key={assessment.id}
                          assessment={assessment}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {assessments && assessments.length > 0 ? 'Start New Assessment' : 'Available Templates'}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Select a template to start a new assessment
                  </p>
                  <div className="mt-6">
                    <MaturityTemplateList onSelectTemplate={handleTemplateSelect} />
                  </div>
                </div>
              </div>
            )}

            {step === 'form' && selectedTemplate && (
              <div>
                <h3 className="text-base font-semibold text-gray-900">New Assessment</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Complete the assessment form for {selectedTemplate.name}
                </p>
                <div className="mt-6">
                  <MaturityAssessmentForm
                    template={selectedTemplate}
                    onSubmit={handleAssessmentSubmit}
                    onCancel={() => setStep('list')}
                  />
                </div>
              </div>
            )}

            {step === 'results' && assessments && assessments.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-900">Latest Assessment Results</h3>
                <p className="mt-2 text-sm text-gray-500">
                  View your latest assessment results and history
                </p>
                <div className="mt-6">
                  <MaturityAssessmentResults
                    assessment={assessments[0]}
                    historicalAssessments={assessments.slice(1)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

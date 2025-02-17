'use client';

import { Suspense, useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadialChart } from '@/components/dashboard/RadialChart';
import { HeatmapCard } from '@/components/dashboard/HeatmapCard';
import { Loader2 } from 'lucide-react';

interface Assessment {
  id: string;
  createdAt: string;
  template: {
    id: string;
    name: string;
    description: string;
    templateSchema: Record<string, any>;
    version: string;
  };
  service: {
    id: string;
    name: string;
    team: {
      id: string;
      name: string;
      organisation: {
        id: string;
        name: string;
      };
    };
  };
  scores: Record<string, number>;
}

interface PageProps {
  params: {
    id: string;
    assessmentId: string;
  };
}

async function fetchAssessment(serviceId: string, assessmentId: string): Promise<Assessment> {
  const response = await fetch(
    `/api/services/${serviceId}/assessments/${assessmentId}`,
    { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch assessment');
  }
  
  return response.json();
}

function AssessmentContent({ serviceId, assessmentId }: { serviceId: string; assessmentId: string }) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const data = await fetchAssessment(serviceId, assessmentId);
        setAssessment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assessment');
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [serviceId, assessmentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        {error}
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-gray-500 text-center py-8">
        Assessment not found
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{assessment.template.name}</h1>
        <p className="mt-2 text-sm text-gray-600">
          Assessment details for {assessment.service.name}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Organisation</h3>
                <p className="text-sm text-gray-600">{assessment.service.team.organisation.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Team</h3>
                <p className="text-sm text-gray-600">{assessment.service.team.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Service</h3>
                <p className="text-sm text-gray-600">{assessment.service.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Assessment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Template</h3>
                <p className="text-sm text-gray-600">{assessment.template.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Assessment Date</h3>
                <p className="text-sm text-gray-600">
                  {new Date(assessment.createdAt).toLocaleDateString('en-AU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <HeatmapCard
          organisation={assessment.service.team.organisation.name}
          team={assessment.service.team.name}
          serviceName={assessment.service.name}
          assessments={[{
            templateName: assessment.template.name,
            createdAt: assessment.createdAt,
            facets: Object.entries(assessment.scores).map(([name, score]) => ({
              name,
              score,
              maxScore: 5, // Assuming max score is 5, adjust if different
            })),
          }]}
        />
      </div>
    </div>
  );
}

export default function AssessmentPage({ params }: PageProps) {
  return (
    <Layout>
      <Suspense fallback={<div className="text-sm text-gray-500">Loading assessment details...</div>}>
        <AssessmentContent serviceId={params.id} assessmentId={params.assessmentId} />
      </Suspense>
    </Layout>
  );
}

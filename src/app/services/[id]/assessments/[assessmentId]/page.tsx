'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { AssessmentSummaryBar } from '@/components/assessments/AssessmentSummaryBar';
import { AssessmentOverview } from '@/components/assessments/AssessmentOverview';
import { FacetCard } from '@/components/assessments/FacetCard';
import { Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Assessment {
  id: string;
  createdAt: string;
  template: {
    id: string;
    name: string;
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
  assessor?: string;
  facets: Array<{
    id: string;
    name: string;
    score: number;
    previousScore: number;
    description: string;
    levels: Array<{
      id: string;
      number: number;
      name: string;
      description: string;
    }>;
    recommendations: string[];
    evidence?: string;
    historicalData: Array<{
      date: string;
      score: number;
    }>;
  }>;
}

export default function AssessmentPage() {
  const params = useParams<{ id: string; assessmentId: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const facetRefs = useRef<{ [key: string]: HTMLDivElement }>({});

  useEffect(() => {
    if (!params.id || !params.assessmentId) return;

    fetch(`/api/services/${params.id}/assessments/${params.assessmentId}`)
      .then(async res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (!data || !data.service || !data.service.team) {
          throw new Error('Invalid assessment data received');
        }
        setAssessment(data);
      })
      .catch(error => {
        console.error('Error fetching assessment:', error);
        setError(error.message || 'Failed to load assessment');
      })
      .finally(() => setLoading(false));
  }, [params.id, params.assessmentId]);

  const handleJumpToFacet = (facetName: string) => {
    const element = facetRefs.current[facetName];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading || !assessment) {
    return (
      <Layout>
        <div className="container py-6 space-y-6">
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[400px] w-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
        </div>
      </Layout>
    );
  }

  // Ensure scores are numbers and handle NaN/undefined
  const validScores = assessment.facets.map(f => typeof f.score === 'number' ? f.score : 0);
  const validPreviousScores = assessment.facets.map(f => typeof f.previousScore === 'number' ? f.previousScore : 0);
  
  const overallScore = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
  const previousOverallScore = validPreviousScores.reduce((sum, score) => sum + score, 0) / validPreviousScores.length;

  // Calculate next assessment date (3 months from assessment date)
  const assessmentDate = new Date(assessment.createdAt);
  const nextDueDate = new Date(assessmentDate);
  nextDueDate.setMonth(nextDueDate.getMonth() + 3);

  return (
    <Layout>
      <div className="container py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Assessment for {assessment.service.name}
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                Export as PDF
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button>
                Create Improvement Plan
              </Button>
            </div>
          </div>
          
          <AssessmentSummaryBar assessmentId={params.assessmentId} />
        </div>

        {/* Overview Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <AssessmentOverview
            assessmentId={params.assessmentId}
            onJumpToFacet={handleJumpToFacet}
          />
        </div>

        {/* Facets Section */}
        <div className="grid gap-6">
          {assessment.facets.map((facet) => (
            <div
              key={facet.name}
              ref={el => {
                if (el) facetRefs.current[facet.name] = el;
              }}
              className="bg-white rounded-lg shadow"
            >
              <FacetCard
                assessmentId={params.assessmentId}
                facetId={facet.id}
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

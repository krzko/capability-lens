'use client';

import Layout from '@/components/layout/Layout';
import { StartAssessment } from '@/components/assessments/StartAssessment';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export default function StartAssessmentPage() {
  return (
    <Layout>
      <ErrorBoundary>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Start Assessment</h1>
            <p className="mt-2 text-sm text-gray-600">
              Start a new service assessment
            </p>
          </div>
          <StartAssessment />
        </div>
      </ErrorBoundary>
    </Layout>
  );
}

'use client';

import Layout from '@/components/layout/Layout';
import { ViewAssessments } from '@/components/assessments/ViewAssessments';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export default function ViewAssessmentsPage() {
  return (
    <Layout>
      <ErrorBoundary>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">View Assessments</h1>
            <p className="mt-2 text-sm text-gray-600">
              View and track your service assessments
            </p>
          </div>
          <ViewAssessments />
        </div>
      </ErrorBoundary>
    </Layout>
  );
}

'use client';

import Layout from '@/components/layout/Layout';
import { TemplateManager } from '@/components/assessments/TemplateManager';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export default function ManageTemplatesPage() {
  return (
    <Layout>
      <ErrorBoundary>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Manage Templates</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your assessment templates
            </p>
          </div>
          <TemplateManager />
        </div>
      </ErrorBoundary>
    </Layout>
  );
}

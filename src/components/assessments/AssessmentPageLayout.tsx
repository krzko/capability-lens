'use client';

import { ReactNode } from 'react';
import Layout from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

interface AssessmentPageLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AssessmentPageLayout({ title, description, children }: AssessmentPageLayoutProps) {
  return (
    <Layout>
      <ErrorBoundary>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <p className="mt-2 text-sm text-gray-600">
              {description}
            </p>
          </div>
          {children}
        </div>
      </ErrorBoundary>
    </Layout>
  );
}

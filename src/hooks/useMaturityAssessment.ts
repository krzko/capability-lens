import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';

export interface Level {
  id: string;
  number: number;
  name: string;
  description: string;
}

export interface Facet {
  id: string;
  name: string;
  description: string | null;
  levels: Level[];
}

export interface MaturityTemplate {
  id: string;
  name: string;
  description: string | null;
  facets: Facet[];
}

export interface Assessment {
  id: string;
  templateId: string;
  serviceId: string;
  scores: Record<string, number>;
  template: MaturityTemplate;
  createdAt: string;
  updatedAt: string;
}

export function useMaturityTemplates() {
  const { data: templates, error, isLoading } = useSWR<MaturityTemplate[]>(
    '/api/maturity-templates',
    fetcher
  );

  return {
    templates,
    isLoading,
    error
  };
}

export function useServiceAssessments(serviceId: string) {
  const { data: assessments, error, isLoading, mutate } = useSWR<Assessment[]>(
    serviceId ? `/api/assessments?serviceId=${serviceId}` : null,
    fetcher
  );

  const createAssessment = async (templateId: string, scores: Record<string, number>) => {
    try {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          templateId,
          scores,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create assessment');
      }

      const newAssessment = await response.json();
      mutate([...(assessments || []), newAssessment]);
      return newAssessment;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  };

  return {
    assessments,
    isLoading,
    error,
    createAssessment
  };
}

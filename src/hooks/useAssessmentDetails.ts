import useSWR from 'swr';


interface AssessmentDetails {
  id: string;
  templateId: string;
  serviceId: string;
  scores: Record<string, number>;
  template: {
    id: string;
    name: string;
    description: string | null;
    facets: Array<{
      id: string;
      name: string;
      description: string | null;
      levels: Array<{
        id: string;
        number: number;
        name: string;
        description: string;
      }>;
    }>;
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
  createdAt: string;
  updatedAt: string;
}

async function fetchAssessmentDetails(assessmentId: string): Promise<AssessmentDetails | null> {
  if (!assessmentId) return null;

  const response = await fetch(`/api/assessments/${assessmentId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export function useAssessmentDetails(assessmentId: string) {
  const { data: assessment, error, isLoading } = useSWR(
    assessmentId ? `assessment-${assessmentId}` : null,
    () => fetchAssessmentDetails(assessmentId)
  );

  return {
    assessment,
    error,
    isLoading
  };
}

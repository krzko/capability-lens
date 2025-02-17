import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Organisation {
  id: string;
  name: string;
  teams: Array<{
    id: string;
    name: string;
    services: Array<any>;
    members: number;
  }>;
  maturity: {
    current: number;
    trend: number;
  };
  lastAssessmentDate: string;
}

interface UseOrganisationsReturn {
  organisations: Organisation[];
  isLoading: boolean;
  error: string | null;
  createOrganisation: (name: string) => Promise<void>;
  updateOrganisation: (id: string, name: string) => Promise<void>;
  deleteOrganisation: (id: string) => Promise<void>;
}

export function useOrganisations(): UseOrganisationsReturn {
  const router = useRouter();
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganisations();
  }, []);

  const fetchOrganisations = async () => {
    try {
      const response = await fetch('/api/organisations');
      if (!response.ok) {
        throw new Error('Failed to fetch organisations');
      }
      const data = await response.json();
      setOrganisations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const createOrganisation = async (name: string) => {
    try {
      const response = await fetch('/api/organisations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create organisation');
      }

      await fetchOrganisations();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateOrganisation = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/organisations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update organisation');
      }

      await fetchOrganisations();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteOrganisation = async (id: string) => {
    try {
      const response = await fetch(`/api/organisations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete organisation');
      }

      await fetchOrganisations();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    organisations,
    isLoading,
    error,
    createOrganisation,
    updateOrganisation,
    deleteOrganisation,
  };
}

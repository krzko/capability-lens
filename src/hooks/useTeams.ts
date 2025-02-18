import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Team {
  id: string;
  name: string;
  organisationId: string;
  organisation: {
    id: string;
    name: string;
  };
  services: any[];
  createdAt: string;
}

interface UseTeamsReturn {
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  createTeam: (name: string, organisationId: string) => Promise<void>;
  updateTeam: (id: string, name: string) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
}

export function useTeams(organisationId?: string): UseTeamsReturn {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, [organisationId]);

  const fetchTeams = async () => {
    try {
      const url = organisationId
        ? `/api/teams?organisationId=${organisationId}`
        : '/api/teams';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }
      const data = await response.json();
      setTeams(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = async (name: string, organisationId: string) => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, organisationId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.details) {
          // Handle validation errors
          const errorMessage = data.details
            .map((err: { path: string; message: string }) => `${err.path}: ${err.message}`)
            .join(', ');
          throw new Error(errorMessage);
        }
        throw new Error(data.message || data.error || 'Failed to create team');
      }

      await fetchTeams();
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTeam = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to update team');
      }

      await fetchTeams();
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to delete team');
      }

      await fetchTeams();
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    teams,
    isLoading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
  };
}

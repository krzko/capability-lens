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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create team');
      }

      await fetchTeams();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update team');
      }

      await fetchTeams();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete team');
      }

      await fetchTeams();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
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

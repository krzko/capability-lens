import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  team: {
    id: string;
    name: string;
    organisation: {
      id: string;
      name: string;
    };
  };
  assessments: Array<{
    id: string;
    createdAt: string;
    scores: Record<string, number>;
  }>;
}

interface UseServicesReturn {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  createService: (data: {
    name: string;
    description?: string;
    teamId: string;
  }) => Promise<void>;
  updateService: (
    id: string,
    data: { name: string; description?: string }
  ) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

export function useService(id: string) {
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/services/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch service');
        }
        const data = await response.json();
        setService(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [id]);

  return { service, isLoading, error };
}

export function useServices(teamId?: string): UseServicesReturn {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, [teamId]);

  const fetchServices = async () => {
    try {
      const url = teamId ? `/api/services?teamId=${teamId}` : '/api/services';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const createService = async (data: {
    name: string;
    description?: string;
    teamId: string;
  }) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create service');
      }

      await fetchServices();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateService = async (
    id: string,
    data: { name: string; description?: string }
  ) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update service');
      }

      await fetchServices();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete service');
      }

      await fetchServices();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    services,
    isLoading,
    error,
    createService,
    updateService,
    deleteService,
  };
}

import useSWR from 'swr';
import { fetcher } from '@/lib/utils';

export interface Service {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}

export function useServices() {
  const { data: services, error, mutate } = useSWR<Service[]>('/api/services', fetcher);

  return {
    services,
    isLoading: !error && !services,
    isError: error,
    mutate,
  };
}

export function useService(id: string) {
  const { data: service, error, mutate } = useSWR<Service>(
    id ? `/api/services/${id}` : null,
    fetcher
  );

  return {
    service,
    isLoading: !error && !service,
    isError: error,
    mutate,
  };
}

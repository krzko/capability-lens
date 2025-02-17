import useSWR from 'swr';
import { fetcher } from '@/lib/utils';

export interface ServiceHierarchy {
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
  hasAssessments: boolean;
}

export interface OrganisedServices {
  id: string;
  name: string;
  teams: {
    id: string;
    name: string;
    services: {
      id: string;
      name: string;
    }[];
  }[];
}

export function useServiceHierarchy() {
  const { data, error, mutate } = useSWR<ServiceHierarchy[]>(
    '/api/services/hierarchy',
    fetcher
  );

  // Organize services by org > team > service
  const organisedServices = data?.reduce<OrganisedServices[]>((orgs, service) => {
    if (!service.hasAssessments) return orgs;

    const org = orgs.find(o => o.id === service.team.organisation.id);
    if (org) {
      const team = org.teams.find(t => t.id === service.team.id);
      if (team) {
        team.services.push({ id: service.id, name: service.name });
      } else {
        org.teams.push({
          id: service.team.id,
          name: service.team.name,
          services: [{ id: service.id, name: service.name }],
        });
      }
    } else {
      orgs.push({
        id: service.team.organisation.id,
        name: service.team.organisation.name,
        teams: [{
          id: service.team.id,
          name: service.team.name,
          services: [{ id: service.id, name: service.name }],
        }],
      });
    }
    return orgs;
  }, []);

  return {
    services: data,
    organisedServices,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

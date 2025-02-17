'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useService } from '@/hooks/useServices';

export default function ServiceDetailsPage() {
  const params = useParams();
  const serviceId = params.id as string;
  const { service, isLoading, error } = useService(serviceId);

  if (error) {
    return (
      <div className="text-red-500">
        Error loading service: {error.message}
      </div>
    );
  }

  if (isLoading || !service) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{service.name}</h1>
        <div className="space-x-4">
          <Button asChild>
            <Link href={`/services/${service.id}/assessments`}>
              View Assessments
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/services/${service.id}/edit`}>
              Edit Service
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>
            View and manage service information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Description</dt>
              <dd className="text-sm">{service.description || 'No description provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Team</dt>
              <dd className="text-sm">{service.team.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Organisation</dt>
              <dd className="text-sm">{service.team.organisation.name}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

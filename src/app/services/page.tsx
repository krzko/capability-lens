'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { PlusIcon, Loader2 } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import ServiceForm from '@/components/services/ServiceForm';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { ServicesDataTable } from '@/components/services/ServicesDataTable';
import { ServiceStats } from '@/components/services/ServiceStats';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Service {
  id: string;
  name: string;
  description?: string;
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

export default function Services() {
  const { services, isLoading, error, createService, updateService, deleteService } =
    useServices();
  const [selectedTeamId, setSelectedTeamId] = useState<string>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);



  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleDelete = async (service: Service) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      await deleteService(service.id);
    }
  };

  const handleSubmit = async (data: {
    name: string;
    description?: string;
    teamId: string;
  }) => {
    if (editingService) {
      await updateService(editingService.id, {
        name: data.name,
        description: data.description,
      });
    } else {
      await createService(data);
    }
    setIsFormOpen(false);
    setEditingService(null);
  };

  const router = useRouter();

  const handleStartAssessment = (service: Service) => {
    router.push(`/services/${service.id}/assessments/new`);
  };

  return (
    <Layout>
      <ErrorBoundary>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your services and their maturity assessments
              </p>
            </div>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              New Service
            </Button>
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="space-y-6">
              <ServiceStats services={services} />
              <ServicesDataTable
                services={services}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStartAssessment={handleStartAssessment}
              />
            </div>
          )}

          <Dialog open={isFormOpen} onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingService(null);
          }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingService ? 'Edit Service' : 'New Service'}</DialogTitle>
                <DialogDescription>
                  {editingService ? 'Update the service details below.' : 'Add a new service to your organisation.'}
                </DialogDescription>
              </DialogHeader>
              <ServiceForm
                initialData={editingService ? {
                  id: editingService.id,
                  name: editingService.name,
                  description: editingService.description,
                  teamId: editingService.team.id
                } : undefined}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingService(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </ErrorBoundary>
    </Layout>
  );
}

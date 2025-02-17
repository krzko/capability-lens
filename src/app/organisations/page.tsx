'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { PlusIcon, Loader2 } from 'lucide-react';
import { useOrganisations } from '@/hooks/useOrganisations';
import OrganisationForm from '@/components/organisations/OrganisationForm';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { OrganisationsDataTable } from '@/components/organisations/OrganisationsDataTable';
import { OrganisationStats } from '@/components/organisations/OrganisationStats';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

export default function OrganisationsPage() {
  const {
    organisations,
    isLoading,
    error,
    createOrganisation,
    updateOrganisation,
    deleteOrganisation,
  } = useOrganisations();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organisation | null>(null);

  const router = useRouter();

  const handleView = (organisation: Organisation) => {
    router.push(`/organisations/${organisation.id}`);
  };

  const handleEdit = (organisation: Organisation) => {
    setEditingOrg(organisation);
    setIsFormOpen(true);
  };

  const handleDelete = async (organisation: Organisation) => {
    if (window.confirm(`Are you sure you want to delete ${organisation.name}?`)) {
      await deleteOrganisation(organisation.id);
    }
  };

  // Stats for the OrganisationStats component
  const stats = {
    totalOrganisations: organisations?.length ?? 0,
    organisationsTrend: 2,
    averageMaturity: 3.2,
    maturityTrend: 0.2,
    overdueAssessments: 2,
    dueSoonAssessments: 3,
  };

  return (
    <Layout>
      <ErrorBoundary>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Organisations</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your organisations and their teams
              </p>
            </div>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              New Organisation
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
              <OrganisationStats {...stats} />
              <OrganisationsDataTable
                organisations={organisations ?? []}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingOrg ? 'Edit Organisation' : 'Create New Organisation'}
                </DialogTitle>
                <DialogDescription>
                  {editingOrg
                    ? 'Edit the organisation details below.'
                    : 'Fill in the organisation details below.'}
                </DialogDescription>
              </DialogHeader>
              <OrganisationForm
                open={isFormOpen}
                onClose={() => {
                  setIsFormOpen(false);
                  setEditingOrg(null);
                }}
                onSubmit={async (data) => {
                  if (editingOrg) {
                    await updateOrganisation(editingOrg.id, data);
                  } else {
                    await createOrganisation(data);
                  }
                  setIsFormOpen(false);
                  setEditingOrg(null);
                }}
                organisation={editingOrg}
              />
            </DialogContent>
          </Dialog>
        </div>
      </ErrorBoundary>
    </Layout>
  );
}

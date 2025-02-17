'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { PlusIcon, Loader2 } from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import TeamForm from '@/components/teams/TeamForm';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { TeamsDataTable } from '@/components/teams/TeamsDataTable';
import { TeamStats } from '@/components/teams/TeamStats';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Team {
  id: string;
  name: string;
  organisation: {
    id: string;
    name: string;
  };
  services: Array<{
    id: string;
    name: string;
    assessments: Array<{
      id: string;
      createdAt: string;
      scores: Record<string, number>;
    }>;
  }>;
  teamLead: string;
  lastAssessmentDate?: string;
  nextAssessmentDate?: string;
  maturityTrend?: number;
}

export default function Teams() {
  const { teams, isLoading, error, createTeam, updateTeam, deleteTeam } =
    useTeams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string>();

  const router = useRouter();

  const handleView = (team: Team) => {
    router.push(`/teams/${team.id}`);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setIsFormOpen(true);
  };

  const handleDelete = async (team: Team) => {
    if (window.confirm(`Are you sure you want to delete ${team.name}?`)) {
      await deleteTeam(team.id);
    }
  };

  return (
    <Layout>
      <ErrorBoundary>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Teams</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your teams and their maturity assessments
              </p>
            </div>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              New Team
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
              <TeamStats teams={teams} />
              <TeamsDataTable
                teams={teams}
                onView={handleView}
              />
            </div>
          )}

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTeam ? 'Edit Team' : 'Create New Team'}
                </DialogTitle>
                <DialogDescription>
                  {editingTeam
                    ? 'Edit the team details below.'
                    : 'Fill in the team details below.'}
                </DialogDescription>
              </DialogHeader>
              <TeamForm
                onClose={() => {
                  setIsFormOpen(false);
                  setEditingTeam(null);
                }}
                onSubmit={async (data) => {
                  if (editingTeam) {
                    await updateTeam(editingTeam.id, data);
                  } else {
                    await createTeam(data);
                  }
                  setIsFormOpen(false);
                  setEditingTeam(null);
                }}
                team={editingTeam}
                selectedOrgId={selectedOrgId}
              />
            </DialogContent>
          </Dialog>
        </div>
      </ErrorBoundary>
    </Layout>
  );
}

'use client';

import { FC, useState, useEffect } from 'react';
import { useTeams } from '@/hooks/useTeams';

interface ServiceFormProps {
  initialData?: {
    id: string;
    name: string;
    description?: string;
    teamId: string;
  };
  teamId?: string;
  onSubmit: (data: {
    name: string;
    description?: string;
    teamId: string;
  }) => Promise<void>;
  onCancel: () => void;
}

const ServiceForm: FC<ServiceFormProps> = ({
  initialData,
  teamId,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [selectedTeamId, setSelectedTeamId] = useState(initialData?.teamId || teamId || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { teams, isLoading: isLoadingTeams } = useTeams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!selectedTeamId) {
        setError('Please select a team');
        return;
      }
      await onSubmit({
        name,
        description: description || undefined,
        teamId: selectedTeamId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="team"
          className="block text-sm font-medium text-gray-700"
        >
          Team
        </label>
        <div className="mt-1">
          <select
            id="team"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={isLoading || isLoadingTeams || !!teamId}
            required
          >
            <option value="">Select a team</option>
            {[...teams]
              .sort((a, b) => {
                // First sort by organisation name
                const orgCompare = a.organisation.name.localeCompare(b.organisation.name);
                if (orgCompare !== 0) return orgCompare;
                // Then sort by team name
                return a.name.localeCompare(b.name);
              })
              .map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} ({team.organisation.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Service Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter service name"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <div className="mt-1">
          <textarea
            name="description"
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter service description (optional)"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading
            ? initialData
              ? 'Saving...'
              : 'Creating...'
            : initialData
            ? 'Save Changes'
            : 'Create Service'}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;

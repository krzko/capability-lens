'use client';

import { FC, useState, useEffect } from 'react';
import { useOrganisations } from '@/hooks/useOrganisations';

interface TeamFormProps {
  initialData?: {
    id: string;
    name: string;
    organisationId: string;
  };
  organisationId?: string;
  onSubmit: (name: string, organisationId: string) => Promise<void>;
  onCancel: () => void;
}

const TeamForm: FC<TeamFormProps> = ({
  initialData,
  organisationId,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [selectedOrgId, setSelectedOrgId] = useState(initialData?.organisationId || organisationId || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { organisations, isLoading: isLoadingOrgs } = useOrganisations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!selectedOrgId) {
        setError('Please select an organisation');
        return;
      }
      await onSubmit(name, selectedOrgId);
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
          htmlFor="organisation"
          className="block text-sm font-medium text-gray-700"
        >
          Organisation
        </label>
        <div className="mt-1">
          <select
            id="organisation"
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={isLoading || isLoadingOrgs || !!organisationId}
            required
          >
            <option value="">Select an organisation</option>
            {[...organisations]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
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
          Team Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter team name"
            required
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
            : 'Create Team'}
        </button>
      </div>
    </form>
  );
};

export default TeamForm;

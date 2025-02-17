'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { HeatmapCard } from '@/components/dashboard/HeatmapCard';
import { useServiceStats } from '@/hooks/useServiceStats';
import { Boxes, BarChart2, ClipboardCheck } from 'lucide-react';

export default function Dashboard() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const stats = useServiceStats(services);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Overview of service maturity across your organisation
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center gap-2">
                <Boxes className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-semibold text-gray-900">Total Services</h3>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-indigo-600">{stats.totalServices}</p>
                {/* Debug output */}
                {console.log('totalServicesChange debug:', {
                  value: stats.totalServicesChange,
                  type: typeof stats.totalServicesChange,
                  isPositive: stats.totalServicesChange > 0,
                  comparison: `${stats.totalServicesChange} > 0 = ${stats.totalServicesChange > 0}`
                })}
                <p 
                  style={{ 
                    color: stats.totalServicesChange > 0 ? '#16a34a' : stats.totalServicesChange < 0 ? '#dc2626' : '#111827'
                  }} 
                  className="text-sm font-medium"
                >
                  {stats.totalServicesChange > 0 ? '↑' : stats.totalServicesChange < 0 ? '↓' : ''} {Math.abs(stats.totalServicesChange)}%
                </p>
              </div>
              <p className="mt-2 text-sm text-gray-500">Across {stats.totalTeams} teams</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-semibold text-gray-900">Average Maturity</h3>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-indigo-600">{stats.averageMaturity}</p>
                {/* Debug output */}
                {console.log('averageMaturityChange debug:', {
                  value: stats.averageMaturityChange,
                  type: typeof stats.averageMaturityChange,
                  isPositive: stats.averageMaturityChange > 0,
                  comparison: `${stats.averageMaturityChange} > 0 = ${stats.averageMaturityChange > 0}`
                })}
                <p 
                  style={{ 
                    color: stats.averageMaturityChange > 0 ? '#16a34a' : stats.averageMaturityChange < 0 ? '#dc2626' : '#111827'
                  }} 
                  className="text-sm font-medium"
                >
                  {stats.averageMaturityChange > 0 ? '↑' : stats.averageMaturityChange < 0 ? '↓' : ''} {Math.abs(stats.averageMaturityChange)}%
                </p>
              </div>
              <p className="mt-2 text-sm text-gray-500">Out of 5.0</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-semibold text-gray-900">Recent Assessments</h3>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-indigo-600">{stats.recentAssessments}</p>
                {/* Debug output */}
                {console.log('recentAssessmentsChange debug:', {
                  value: stats.recentAssessmentsChange,
                  type: typeof stats.recentAssessmentsChange,
                  isPositive: stats.recentAssessmentsChange > 0,
                  comparison: `${stats.recentAssessmentsChange} > 0 = ${stats.recentAssessmentsChange > 0}`
                })}
                <p 
                  style={{ 
                    color: stats.recentAssessmentsChange > 0 ? '#16a34a' : stats.recentAssessmentsChange < 0 ? '#dc2626' : '#111827'
                  }} 
                  className="text-sm font-medium"
                >
                  {stats.recentAssessmentsChange > 0 ? '↑' : stats.recentAssessmentsChange < 0 ? '↓' : ''} {Math.abs(stats.recentAssessmentsChange)}%
                </p>
              </div>
              <p className="mt-2 text-sm text-gray-500">Last 30 days</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-3 text-center py-4">Loading services...</div>
          ) : error ? (
            <div className="col-span-3 text-center py-4 text-red-500">{error}</div>
          ) : (
            services.map((service) => (
              <HeatmapCard
                key={service.id}
                organisation={service.team.organisation.name}
                team={service.team.name}
                serviceName={service.name}
                assessments={service.assessments.map((assessment: any) => {
                  // Create a map of facet IDs to names
                  const facetMap = new Map(
                    assessment.template.facets.map((f: any) => [f.id, f.name])
                  );
                  return {
                    templateName: assessment.template.name,
                    createdAt: assessment.createdAt,
                    facets: Object.entries(assessment.scores).map(([id, score]) => ({
                      name: facetMap.get(id) || id,
                      score: score as number,
                      maxScore: 5,
                    })),
                  };
                })}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

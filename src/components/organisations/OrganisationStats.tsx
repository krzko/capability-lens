'use client';

import { Building2, Target, AlertCircle, Clock } from 'lucide-react';

interface OrganisationStatsProps {
  totalOrganisations: number;
  organisationsTrend: number;
  averageMaturity: number;
  maturityTrend: number;
  overdueAssessments: number;
  dueSoonAssessments: number;
}

export function OrganisationStats({
  totalOrganisations,
  organisationsTrend,
  averageMaturity,
  maturityTrend,
  overdueAssessments,
  dueSoonAssessments,
}: OrganisationStatsProps) {
  const stats = [
    {
      title: 'Total Organizations',
      value: totalOrganisations,
      trend: organisationsTrend,
      icon: Building2,
      iconColor: 'text-blue-500',
    },
    {
      title: 'Average Organisation Maturity',
      value: averageMaturity.toFixed(1),
      trend: maturityTrend,
      subtitle: 'Out of 5.0',
      icon: Target,
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Overdue Assessments',
      value: overdueAssessments,
      icon: AlertCircle,
      iconColor: 'text-red-500',
    },
    {
      title: 'Next 30 Days Due',
      value: dueSoonAssessments,
      icon: Clock,
      iconColor: 'text-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {stats.map((stat) => (
        <div key={stat.title} className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center gap-2">
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              <h3 className="text-base font-semibold text-gray-900">{stat.title}</h3>
            </div>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
              <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
              {stat.trend !== undefined && (
                <p 
                  className="text-sm font-medium"
                  style={{ 
                    color: stat.trend > 0 ? '#16a34a' : stat.trend < 0 ? '#dc2626' : '#111827'
                  }} 
                >
                  ({stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)} from last quarter)
                </p>
              )}
            </div>
            {stat.subtitle && (
              <p className="mt-2 text-sm text-gray-500">{stat.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

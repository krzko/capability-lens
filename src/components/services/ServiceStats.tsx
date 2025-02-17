'use client';

import { BarChart3, Target, Clock } from 'lucide-react';

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

interface ServiceStatsProps {
  services: Service[];
}

export function ServiceStats({ services }: ServiceStatsProps) {
  const totalServices = services.length;
  const servicesWithAssessments = services.filter(
    (service) => service.assessments.length > 0
  ).length;
  const servicesNeedingAssessment = totalServices - servicesWithAssessments;
  
  const averageMaturityScore = services.reduce((acc, service) => {
    if (service.assessments.length === 0) return acc;
    const scores = Object.values(service.assessments[0].scores);
    if (scores.length === 0) return acc;
    return acc + scores.reduce((a, b) => a + b, 0) / scores.length;
  }, 0) / (servicesWithAssessments || 1);

  const stats = [
    {
      title: 'Total Services',
      value: totalServices,
      trend: 5, // Example trend, adjust based on actual data
      subtitle: 'Across all teams',
      icon: BarChart3,
      iconColor: 'text-blue-500',
    },
    {
      title: 'Average Service Maturity',
      value: averageMaturityScore.toFixed(1),
      trend: 2, // Example trend, adjust based on actual data
      subtitle: 'Out of 5.0',
      icon: Target,
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Assessment Status',
      value: servicesWithAssessments,
      trend: 0,
      subtitle: `${servicesNeedingAssessment} need review`,
      icon: Clock,
      iconColor: 'text-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  ({stat.trend > 0 ? '↑' : stat.trend < 0 ? '↓' : ''} {Math.abs(stat.trend)} from last quarter)
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

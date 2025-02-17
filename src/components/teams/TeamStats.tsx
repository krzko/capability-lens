'use client';

import { Users, Target, AlertCircle, Clock } from 'lucide-react';

interface TeamStatsProps {
  teams: Array<{
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
  }>;
}

export function TeamStats({ teams }: TeamStatsProps) {
  const calculateStats = () => {
    const currentDate = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

    // Calculate average maturity for each team
    const teamMaturities = teams.map(team => {
      const serviceScores = team.services.map(service => {
        if (service.assessments && service.assessments.length > 0) {
          const latestAssessment = [...service.assessments].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          const scores = Object.values(latestAssessment.scores);
          return scores.reduce((a, b) => a + b, 0) / scores.length;
        }
        return 0;
      });
      return serviceScores.length > 0 
        ? serviceScores.reduce((a, b) => a + b, 0) / serviceScores.length 
        : 0;
    });

    const avgMaturity = teamMaturities.length > 0 
      ? teamMaturities.reduce((a, b) => a + b, 0) / teamMaturities.length 
      : 0;

    // Count overdue and upcoming assessments
    const overdueCount = teams.filter(team => 
      team.lastAssessmentDate && new Date(team.lastAssessmentDate) < currentDate
    ).length;

    const upcomingCount = teams.filter(team =>
      team.nextAssessmentDate && 
      new Date(team.nextAssessmentDate) <= thirtyDaysFromNow &&
      new Date(team.nextAssessmentDate) >= currentDate
    ).length;

    return [
      {
        title: 'Total Teams',
        value: teams.length,
        trend: 2,
        icon: Users,
        iconColor: 'text-blue-500',
      },
      {
        title: 'Average Team Maturity',
        value: avgMaturity.toFixed(1),
        trend: 0.2,
        subtitle: 'Out of 5.0',
        icon: Target,
        iconColor: 'text-emerald-500',
      },
      {
        title: 'Overdue Assessments',
        value: overdueCount,
        icon: AlertCircle,
        iconColor: 'text-red-500',
      },
      {
        title: 'Next 30 Days Due',
        value: upcomingCount,
        icon: Clock,
        iconColor: 'text-amber-500',
      },
    ];
  };

  const stats = calculateStats();

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

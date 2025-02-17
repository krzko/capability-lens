import { useMemo } from 'react';

interface ServiceStats {
  totalServices: number;
  totalServicesChange: number;
  totalTeams: number;
  totalTeamsChange: number;
  averageMaturity: number;
  averageMaturityChange: number;
  recentAssessments: number;
  recentAssessmentsChange: number;
}

export function useServiceStats(services: any[]): ServiceStats {
  // Mock changes for demonstration
  // TODO: Replace with real calculations based on historical data
  const mockChanges = {
    services: 12,
    teams: 5,
    maturity: 8,
    assessments: -3
  };
  return useMemo(() => {
    // Get unique teams
    const uniqueTeams = new Set(services.map(service => service.team.id));
    
    // Calculate average maturity
    let totalScore = 0;
    let totalFacets = 0;
    
    // Count recent assessments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    let recentAssessmentCount = 0;
    
    // Process current period assessments
    services.forEach(service => {
      if (service.assessments && service.assessments.length > 0) {
        // Count recent assessments and calculate maturity
        const currentPeriodAssessments = service.assessments.filter(
          assessment => new Date(assessment.createdAt) >= thirtyDaysAgo
        );
        
        recentAssessmentCount += currentPeriodAssessments.length;
        
        // Use the latest assessment for maturity calculation if it exists
        if (currentPeriodAssessments.length > 0) {
          const latestAssessment = currentPeriodAssessments[0];
          const scores = Object.values(latestAssessment.scores) as number[];
          if (scores.length > 0) {
            totalScore += scores.reduce((a, b) => a + b, 0);
            totalFacets += scores.length;
          }
        }
      }
    });
    
    const averageMaturity = totalFacets > 0 
      ? Math.round((totalScore / totalFacets) * 10) / 10
      : 0;
    
    // For now, using mock changes to demonstrate the UI
    const totalServicesChange = +mockChanges.services;
    const totalTeamsChange = +mockChanges.teams;
    const averageMaturityChange = +mockChanges.maturity;
    const recentAssessmentsChange = +mockChanges.assessments;

    console.log('Changes:', {
      totalServicesChange: {
        value: totalServicesChange,
        type: typeof totalServicesChange,
        isPositive: totalServicesChange > 0,
        comparison: `${totalServicesChange} > 0 = ${totalServicesChange > 0}`
      },
      averageMaturityChange: {
        value: averageMaturityChange,
        type: typeof averageMaturityChange,
        isPositive: averageMaturityChange > 0,
        comparison: `${averageMaturityChange} > 0 = ${averageMaturityChange > 0}`
      },
      recentAssessmentsChange: {
        value: recentAssessmentsChange,
        type: typeof recentAssessmentsChange,
        isPositive: recentAssessmentsChange > 0,
        comparison: `${recentAssessmentsChange} > 0 = ${recentAssessmentsChange > 0}`
      }
    });

    return {
      totalServices: services.length,
      totalServicesChange,
      totalTeams: uniqueTeams.size,
      totalTeamsChange,
      averageMaturity,
      averageMaturityChange,
      recentAssessments: recentAssessmentCount,
      recentAssessmentsChange,
    };
  }, [services]);
}

function calculatePercentageChange(previous: number, current: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

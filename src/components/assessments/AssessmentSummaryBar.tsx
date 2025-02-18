'use client';

import { Building2, Calendar, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAssessmentDetails } from '@/hooks/useAssessmentDetails';

interface AssessmentSummaryBarProps {
  assessmentId: string;
}

export function AssessmentSummaryBar({ assessmentId }: AssessmentSummaryBarProps) {
  const { assessment, isLoading } = useAssessmentDetails(assessmentId);

  if (isLoading || !assessment) {
    return <div>Loading assessment summary...</div>;
  }

  const {
    service: { name: serviceName, team: { name: teamName, organisation: { name: orgName } } },
    template: { name: templateName },
    createdAt,
    assessor,
  } = assessment;

  const assessmentDate = new Date(createdAt).toLocaleDateString();
  const nextDueDate = new Date(new Date(createdAt).setMonth(new Date(createdAt).getMonth() + 3)).toLocaleDateString();
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{serviceName}</h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Building2 className="w-4 h-4" />
                <span>{orgName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{teamName}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium">{templateName}</div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Assessed: {assessmentDate}</span>
            </div>
            {assessor && (
              <div className="text-sm text-muted-foreground">
                Assessor: {assessor}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium">Next Assessment</div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Due: {nextDueDate}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

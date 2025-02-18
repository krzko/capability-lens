'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MaturityProgress } from './MaturityProgress';
import { TrendIndicator } from './TrendIndicator';
import { StatusBadge } from './StatusBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Search, ArrowUpDown, ArrowUp, ArrowDown, List, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSort, type SortConfig } from '@/hooks/useSort';

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
    template?: {
      id: string;
      name: string;
      templateSchema: string;
      facets: Array<{
        id: string;
        name: string;
        description: string;
      }>;
    };
  }>;
}

interface ServicesDataTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onStartAssessment: (service: Service) => void;
  onViewAssessments?: (service: Service) => void;
}

export function ServicesDataTable({
  services,
  onEdit,
  onDelete,
  onStartAssessment,
  onViewAssessments,
}: ServicesDataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Helper functions
  const getSortedAssessments = (service: Service) => {
    return [...service.assessments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const getMaturityScore = (service: Service) => {
    if (!service.assessments?.length) return 0;

    const latestAssessment = getSortedAssessments(service)[0];
    if (!latestAssessment.scores || !latestAssessment.template?.facets) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    try {
      // Try to parse the schema for weights
      const schema = latestAssessment.template.templateSchema;
      const weights = typeof schema === 'string' ? 
        JSON.parse(schema).weights || {} : {};

      // Calculate weighted average
      latestAssessment.template.facets.forEach(facet => {
        const score = Number(latestAssessment.scores[facet.id]);
        const weight = Number(weights[facet.id] ?? 1);
        if (!isNaN(score) && !isNaN(weight)) {
          totalScore += score * weight;
          totalWeight += weight;
        }
      });

      if (totalWeight === 0) return 0;
      const avgScore = totalScore / totalWeight;
      return Number(Math.min(avgScore, 5).toFixed(2));
    } catch (e) {
      // If schema parsing fails, use simple average
      const scores = Object.values(latestAssessment.scores)
        .map(score => Number(score))
        .filter(score => !isNaN(score));
      if (!scores.length) return 0;
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      return Number(Math.min(avgScore, 5).toFixed(2));
    }
  };

  const getTrend = (service: Service) => {
    if (!service.assessments?.length || service.assessments.length < 2) return 0;

    const sortedAssessments = getSortedAssessments(service);
    const [latest, previous] = sortedAssessments;

    const latestScores = Object.values(latest.scores);
    const previousScores = Object.values(previous.scores);

    if (!latestScores.length || !previousScores.length) return 0;

    const latestAvg = latestScores.reduce((a, b) => a + b, 0) / latestScores.length;
    const previousAvg = previousScores.reduce((a, b) => a + b, 0) / previousScores.length;

    return Math.round((latestAvg - previousAvg) * 10) / 10;
  };

  const getMatrixType = (service: Service) => {
    if (!service.assessments?.length) return 'Not Set';
    const latestAssessment = getSortedAssessments(service)[0];
    try {
      // Get the template name from schema
      const schema = latestAssessment.template?.templateSchema;
      if (typeof schema === 'string') {
        const parsed = JSON.parse(schema);
        return parsed.type || latestAssessment.template?.name || 'Not Set';
      }
      return latestAssessment.template?.name || 'Not Set';
    } catch (e) {
      return latestAssessment.template?.name || 'Not Set';
    }
  };

  const getLastAssessmentDate = (service: Service) => {
    if (!service.assessments?.length) return null;
    const latestAssessment = getSortedAssessments(service)[0];
    return new Date(latestAssessment.createdAt);
  };

  const getNextAssessmentDate = (lastAssessment: Date | null) => {
    if (!lastAssessment) return null;
    const nextAssessment = new Date(lastAssessment);
    nextAssessment.setMonth(nextAssessment.getMonth() + 3);
    return nextAssessment;
  };

  const getMatrixTypeBadgeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'DORA': 'bg-blue-100 text-blue-800 border border-blue-200',
      'SPACE': 'bg-green-100 text-green-800 border border-green-200',
      'DevOps': 'bg-purple-100 text-purple-800 border border-purple-200',
      'Cloud': 'bg-orange-100 text-orange-800 border border-orange-200',
      'Not Set': 'bg-gray-100 text-gray-800 border border-gray-200',
    };
    return colorMap[type] || colorMap['Not Set'];
  };

  // Sort functions
  const sortByMaturityScore = React.useCallback((a: Service, b: Service) => {
    const scoreA = getMaturityScore(a);
    const scoreB = getMaturityScore(b);
    // Always sort zeros to the bottom, regardless of sort direction
    if (scoreA === 0 && scoreB === 0) return 0;
    if (scoreA === 0) return 1;
    if (scoreB === 0) return -1;
    // Natural order (asc) means lower scores first
    return scoreA - scoreB;
  }, []);

  const sortByTrend = React.useCallback((a: Service, b: Service) => {
    const trendA = getTrend(a);
    const trendB = getTrend(b);
    if (isNaN(trendA) && isNaN(trendB)) return 0;
    if (isNaN(trendA)) return 1;
    if (isNaN(trendB)) return -1;
    return trendA - trendB;
  }, []);

  const sortByStatus = React.useCallback((a: Service, b: Service) => {
    const aDate = getNextAssessmentDate(getLastAssessmentDate(a));
    const bDate = getNextAssessmentDate(getLastAssessmentDate(b));
    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return aDate.getTime() - bDate.getTime();
  }, []);

  const sortByMatrixType = React.useCallback((a: Service, b: Service) => {
    return getMatrixType(a).localeCompare(getMatrixType(b));
  }, []);

  const sortByLastAssessmentDate = React.useCallback((a: Service, b: Service) => {
    const aDate = getLastAssessmentDate(a);
    const bDate = getLastAssessmentDate(b);
    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return aDate.getTime() - bDate.getTime();
  }, []);

  const sortByNextAssessmentDate = React.useCallback((a: Service, b: Service) => {
    const aDate = getNextAssessmentDate(getLastAssessmentDate(a));
    const bDate = getNextAssessmentDate(getLastAssessmentDate(b));
    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return aDate.getTime() - bDate.getTime();
  }, []);

  const { items: sortedServices, sortConfig, requestSort } = useSort(services, { key: 'maturityScore', direction: 'desc' }, {
    customSort: {
      maturityScore: sortByMaturityScore,
      trend: sortByTrend,
      status: sortByStatus,
      matrixType: sortByMatrixType,
      lastAssessmentDate: sortByLastAssessmentDate,
      nextAssessmentDate: sortByNextAssessmentDate,
    },
  });

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const filteredServices = sortedServices.filter((service) => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.team.organisation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SortableHeader = ({ column, children }: { column: string, children: React.ReactNode }) => {
    const isActive = sortConfig?.key === column;
    return (
      <TableHead>
        <Button
          variant="ghost"
          onClick={() => requestSort(column)}
          className="-ml-4 hover:bg-transparent"
        >
          <span>{children}</span>
          {isActive ? (
            sortConfig.direction === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      </TableHead>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader column="name">Name</SortableHeader>
              <SortableHeader column="team.name">Team</SortableHeader>
              <SortableHeader column="maturityScore">Maturity</SortableHeader>
              <SortableHeader column="trend">Trend</SortableHeader>
              <SortableHeader column="status">Status</SortableHeader>
              <SortableHeader column="matrixType">Matrix Type</SortableHeader>
              <SortableHeader column="lastAssessmentDate">Last Assessment</SortableHeader>
              <SortableHeader column="nextAssessmentDate">Next Assessment</SortableHeader>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => {
              const lastAssessmentDate = getLastAssessmentDate(service);
              const score = getMaturityScore(service);
            return (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.team.name}</TableCell>
                <TableCell className="w-32">
                  <MaturityProgress score={score} size="sm" />
                </TableCell>
                <TableCell>
                  <TrendIndicator difference={getTrend(service)} />
                </TableCell>
                <TableCell>
                  <StatusBadge score={score} />
                </TableCell>
                <TableCell>
                  <span className={cn(
                    'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                    getMatrixTypeBadgeColor(getMatrixType(service))
                  )}>
                    {getMatrixType(service)}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(lastAssessmentDate)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(getNextAssessmentDate(lastAssessmentDate))}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => service.assessments?.length > 0 
                        ? onViewAssessments?.(service)
                        : onStartAssessment(service)
                      }
                      title={service.assessments?.length > 0 ? 'View Assessments' : 'Start New Assessment'}
                    >
                      {service.assessments?.length > 0 ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {service.assessments?.length > 0 && (
                          <DropdownMenuItem onClick={() => onStartAssessment(service)}>
                            Start Assessment
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onEdit(service)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => onDelete(service)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

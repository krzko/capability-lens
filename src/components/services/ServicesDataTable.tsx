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
    matrixType?: string;
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
  const { items: sortedServices, sortConfig, requestSort } = useSort(services, { key: 'name', direction: 'asc' });

  const getSortedAssessments = (service: Service) => {
    return [...service.assessments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const getMaturityScore = (service: Service) => {
    if (!service.assessments?.length) return 0;

    const latestAssessment = getSortedAssessments(service)[0];
    const scores = Object.values(latestAssessment.scores);
    if (!scores.length) return 0;

    const average = scores.reduce((acc, score) => acc + score, 0) / scores.length;
    return Math.min(average, 5);
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
    return latestAssessment.matrixType || 'Not Set';
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
                <TableCell className="text-sm text-muted-foreground">
                  {getMatrixType(service)}
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

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
import { TrendIndicator } from '@/components/shared/TrendIndicator';
import { MaturityProgress } from '@/components/services/MaturityProgress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Search, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSort, type SortConfig } from '@/hooks/useSort';

interface TeamsDataTableProps {
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
    maturityTrend?: number;
  }>;
  onView: (team: any) => void;
}

interface TeamAssessmentStatus {
  status: 'overdue' | 'upcoming' | 'completed' | 'none';
  date?: string;
}

export function TeamsDataTable({ teams, onView }: TeamsDataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { items: sortedTeams, sortConfig, requestSort } = useSort(teams, { key: 'name', direction: 'asc' });

  const calculateTeamMaturity = (team: any) => {
    const serviceScores = team.services.map((service: any) => {
      if (service.assessments && service.assessments.length > 0) {
        const latestAssessment = [...service.assessments].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        const scores = Object.values(latestAssessment.scores);
        return scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
      }
      return 0;
    });
    return serviceScores.length > 0 
      ? (serviceScores.reduce((a: number, b: number) => a + b, 0) / serviceScores.length).toFixed(1)
      : "N/A";
  };

  const getAssessmentStatus = (team: any): TeamAssessmentStatus => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (!team.lastAssessmentDate && !team.nextAssessmentDate) {
      return { status: 'none' };
    }

    if (team.lastAssessmentDate && new Date(team.lastAssessmentDate) < now) {
      return { status: 'overdue', date: team.lastAssessmentDate };
    }

    if (team.nextAssessmentDate && new Date(team.nextAssessmentDate) <= thirtyDaysFromNow) {
      return { status: 'upcoming', date: team.nextAssessmentDate };
    }

    return { status: 'completed', date: team.lastAssessmentDate };
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: TeamAssessmentStatus['status']) => {
    switch (status) {
      case 'overdue':
        return 'text-red-600';
      case 'upcoming':
        return 'text-amber-600';
      case 'completed':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredTeams = sortedTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.organisation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (team.teamLead ? team.teamLead.toLowerCase().includes(searchQuery.toLowerCase()) : false)
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader column="name">Team Name</SortableHeader>
              <SortableHeader column="organisation.name">Organisation</SortableHeader>
              <SortableHeader column="services.length"># of Services</SortableHeader>
              <SortableHeader column="avgMaturity">Avg. Maturity</SortableHeader>
              <SortableHeader column="lastAssessmentDate">Assessment Status</SortableHeader>
              <SortableHeader column="teamLead">Team Lead</SortableHeader>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeams.map((team) => {
              const assessmentStatus = getAssessmentStatus(team);
              return (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.organisation.name}</TableCell>
                  <TableCell className="text-right">{team.services.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <MaturityProgress 
                        value={parseFloat(calculateTeamMaturity(team)) || 0}
                        showTooltip
                      />
                      {team.maturityTrend !== undefined && (
                        <TrendIndicator value={team.maturityTrend} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {assessmentStatus.status !== 'none' && (
                        <AlertCircle className={cn(
                          "h-4 w-4",
                          getStatusColor(assessmentStatus.status)
                        )} />
                      )}
                      <span className={getStatusColor(assessmentStatus.status)}>
                        {assessmentStatus.status === 'none' ? 'No Assessment' :
                         assessmentStatus.status === 'overdue' ? 'Overdue' :
                         assessmentStatus.status === 'upcoming' ? 'Due Soon' : 'Completed'}
                      </span>
                      {assessmentStatus.date && (
                        <span className="text-gray-500 text-sm">
                          ({formatDate(assessmentStatus.date)})
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{team.teamLead}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onView(team)}
                      >
                        <Eye className="h-4 w-4" />
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
                          <DropdownMenuItem onClick={() => onView(team)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Edit Team
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Start Assessment
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete Team
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

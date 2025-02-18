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
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useSort } from '@/hooks/useSort';

interface Organisation {
  id: string;
  name: string;
  teams: Array<{
    id: string;
    name: string;
    services: Array<any>;
    members: number;
  }>;
  maturity: {
    current: number;
    trend: number;
  };
  lastAssessmentDate: string | null;
}

interface OrganisationsDataTableProps {
  organisations: Organisation[];
  onView: (organisation: Organisation) => void;
}

export function OrganisationsDataTable({
  organisations,
  onView,
}: OrganisationsDataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { items: sortedOrganisations, sortConfig, requestSort } = useSort(
    organisations,
    { key: 'name', direction: 'asc' }
  );

  const getTotalServices = (org: Organisation) => {
    return org.teams?.reduce((total, team) => total + (team.services?.length ?? 0), 0) ?? 0;
  };

  const getTotalMembers = (org: Organisation) => {
    return org.teams?.reduce((total, team) => {
      // Count unique users across teams
      const teamMembers = team.members ?? 0;
      return total + teamMembers;
    }, 0) ?? 0;
  };

  const getLastAssessmentDate = (org: Organisation) => {
    if (!org.lastAssessmentDate) return 'Not assessed';
    return formatDate(org.lastAssessmentDate);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  const filteredOrganisations = sortedOrganisations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search organisations..."
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
              <SortableHeader column="name">Name</SortableHeader>
              <SortableHeader column="teams.length"># of Teams</SortableHeader>
              <SortableHeader column="totalServices"># of Services</SortableHeader>
              <SortableHeader column="totalMembers">Members</SortableHeader>
              <SortableHeader column="maturity.current">Avg. Maturity</SortableHeader>
              <SortableHeader column="lastAssessmentDate">Last Assessment</SortableHeader>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrganisations.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium">
                  {org.name}
                </TableCell>
                <TableCell>
                  {org.teams.length}
                </TableCell>
                <TableCell>
                  {getTotalServices(org)}
                </TableCell>
                <TableCell>
                  {getTotalMembers(org)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end">
                    <MaturityProgress score={org.maturity?.current ?? 0} size="sm" />
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {getLastAssessmentDate(org)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(org)}
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
                        <DropdownMenuItem onClick={() => onView(org)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Edit Organisation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Start Assessment
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete Organisation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

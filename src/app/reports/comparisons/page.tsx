'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Layout from '@/components/layout/Layout';
import { ComparisonChart } from '@/components/reports/ComparisonChart';
import { ComparisonInsights } from '@/components/reports/ComparisonInsights';
import { ComparisonTable } from '@/components/reports/ComparisonTable';
import { fetchComparisonData } from '@/lib/services/reports';
import { useToast } from '@/components/ui/use-toast';

type ComparisonType = 'teams' | 'services' | 'organisations';
type MatrixType = 'all' | 'observability' | 'security' | 'dora' | 'cloudNative';
type SortOrder = 'asc' | 'desc';

interface Entity {
  id: string;
  name: string;
  type: string;
}

export default function ComparisonPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [comparisonType, setComparisonType] = useState<ComparisonType>('teams');
  const [matrixType, setMatrixType] = useState<MatrixType>('all');
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>('score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableEntities, setAvailableEntities] = useState<Entity[]>([
    { id: 'team-a', name: 'Team A', type: 'teams' },
    { id: 'team-b', name: 'Team B', type: 'teams' },
    { id: 'team-c', name: 'Team C', type: 'teams' },
    { id: 'service-a', name: 'Service A', type: 'services' },
    { id: 'service-b', name: 'Service B', type: 'services' },
    { id: 'org-a', name: 'Organisation A', type: 'organisations' },
  ]);
  const { toast } = useToast();

  const filteredEntities = availableEntities
    .filter(entity => entity.type === comparisonType)
    .filter(entity =>
      entity.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  useEffect(() => {
    loadData();
  }, [comparisonType, matrixType, selectedEntities]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const comparisonData = await fetchComparisonData({
        comparisonType,
        matrixType,
        entities: selectedEntities,
      });
      setData(comparisonData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load comparison data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEntitySelect = (entityId: string) => {
    if (selectedEntities.includes(entityId)) {
      setSelectedEntities(selectedEntities.filter((e) => e !== entityId));
    } else if (selectedEntities.length < 3) {
      setSelectedEntities([...selectedEntities, entityId]);
    } else {
      toast({
        title: 'Maximum Selection',
        description: 'You can compare up to 3 entities at a time',
        variant: 'default',
      });
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortData = (data: any) => {
    if (!data) return data;

    return {
      ...data,
      chartData: [...data.chartData].sort((a, b) => {
        const aValue = Object.values(a).reduce((sum: number, val) => 
          typeof val === 'number' ? sum + val : sum, 0) / (Object.keys(a).length - 1);
        const bValue = Object.values(b).reduce((sum: number, val) => 
          typeof val === 'number' ? sum + val : sum, 0) / (Object.keys(b).length - 1);
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }),
      tableData: [...data.tableData].sort((a, b) => {
        const aValue = Object.values(a.entities).reduce((sum: number, val: any) => 
          sum + val.score, 0) / Object.keys(a.entities).length;
        const bValue = Object.values(b.entities).reduce((sum: number, val: any) => 
          sum + val.score, 0) / Object.keys(b.entities).length;
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      })
    };
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Comparison Analysis</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Compare maturity levels across teams, services, or organisations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Comparison Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Compare</Label>
                <Select
                  value={comparisonType}
                  onValueChange={(value: ComparisonType) => setComparisonType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select what to compare" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Comparison Type</SelectLabel>
                      <SelectItem value="teams">Teams</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="organisations">Organisations</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Matrix Type</Label>
                <Select
                  value={matrixType}
                  onValueChange={(value: MatrixType) => setMatrixType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select matrix type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Matrix Type</SelectLabel>
                      <SelectItem value="all">All Matrices</SelectItem>
                      <SelectItem value="observability">Observability</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="dora">DORA</SelectItem>
                      <SelectItem value="cloudNative">Cloud Native</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Entities</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      Select entities
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search entities..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                      />
                      <CommandEmpty>No entities found.</CommandEmpty>
                      <CommandGroup>
                        {filteredEntities.map((entity) => (
                          <CommandItem
                            key={entity.id}
                            value={entity.id}
                            onSelect={() => handleEntitySelect(entity.id)}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedEntities.includes(entity.id)
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {entity.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedEntities.map((entityId) => {
                    const entity = availableEntities.find(e => e.id === entityId);
                    return (
                      <Button
                        key={entityId}
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEntitySelect(entityId)}
                      >
                        {entity?.name || entityId} ×
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedEntities.length > 0 && (
          <>
            <div className="flex justify-end mb-4 space-x-2">
              <Select
                value={sortField}
                onValueChange={(value) => handleSort(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort By</SelectLabel>
                    <SelectItem value="score">Overall Score</SelectItem>
                    <SelectItem value="improvement">Most Improved</SelectItem>
                    <SelectItem value="gap">Largest Gaps</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </Button>
            </div>
            <ComparisonChart data={sortData(data)?.chartData} isLoading={isLoading} />
            <ComparisonInsights data={sortData(data)?.insights} isLoading={isLoading} />
            <ComparisonTable data={sortData(data)?.tableData} isLoading={isLoading} />
          </>
        )}
      </div>
    </Layout>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Layout from '@/components/layout/Layout';
import { ComparisonChart } from '@/components/reports/ComparisonChart';
import { ComparisonInsights } from '@/components/reports/ComparisonInsights';
import { ComparisonTable } from '@/components/reports/ComparisonTable';
import { fetchComparisonData } from '@/lib/services/reports';
import { useToast } from '@/components/ui/use-toast';

type ComparisonType = 'teams' | 'services' | 'organisations';
type MatrixType = 'all' | 'observability' | 'security' | 'dora' | 'cloudNative';

export default function ComparisonPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [comparisonType, setComparisonType] = useState<ComparisonType>('teams');
  const [matrixType, setMatrixType] = useState<MatrixType>('all');
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const { toast } = useToast();

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

  const handleEntitySelect = (entity: string) => {
    if (selectedEntities.includes(entity)) {
      setSelectedEntities(selectedEntities.filter((e) => e !== entity));
    } else if (selectedEntities.length < 3) {
      setSelectedEntities([...selectedEntities, entity]);
    } else {
      toast({
        title: 'Maximum Selection',
        description: 'You can compare up to 3 entities at a time',
        variant: 'default',
      });
    }
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
                <Label>Selected Entities</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedEntities.map((entity) => (
                    <Button
                      key={entity}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEntitySelect(entity)}
                    >
                      {entity} ×
                    </Button>
                  ))}
                  {selectedEntities.length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      Select up to 3 entities to compare
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedEntities.length > 0 && (
          <>
            <ComparisonChart data={data?.chartData} isLoading={isLoading} />
            <ComparisonInsights data={data?.insights} isLoading={isLoading} />
            <ComparisonTable data={data?.tableData} isLoading={isLoading} />
          </>
        )}
      </div>
    </Layout>
  );
}

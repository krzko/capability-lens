"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import type { MaturityTemplate, Facet } from '@/hooks/useMaturityAssessment';

interface MaturityAssessmentFormProps {
  template: MaturityTemplate;
  onSubmit: (scores: Record<string, number>) => Promise<void>;
  onCancel: () => void;
}

export default function MaturityAssessmentForm({
  template,
  onSubmit,
  onCancel,
}: MaturityAssessmentFormProps) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [selectedFacet, setSelectedFacet] = useState<string>(
    template.facets[0]?.id || ''
  );
  const { toast } = useToast();

  const handleScoreChange = (facetId: string, score: string) => {
    setScores((prev) => ({
      ...prev,
      [facetId]: parseInt(score, 10),
    }));
  };

  const handleSubmit = async () => {
    try {
      // Ensure all facets have been scored
      const missingFacets = template.facets.filter(
        (facet) => !scores[facet.id]
      );

      if (missingFacets.length > 0) {
        toast({
          title: 'Missing Scores',
          description: `Please provide scores for: ${missingFacets.map((f) => f.name).join(', ')}`,
          variant: 'destructive',
        });
        return;
      }

      await onSubmit(scores);
      toast({
        title: 'Assessment Submitted',
        description: 'Your maturity assessment has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit assessment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const renderFacetContent = (facet: Facet) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">{facet.name}</h3>
        <p className="text-muted-foreground">{facet.description}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Maturity Level
          </label>
          <Select
            value={scores[facet.id]?.toString()}
            onValueChange={(value) => handleScoreChange(facet.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a level..." />
            </SelectTrigger>
            <SelectContent>
              {facet.levels.map((level) => (
                <SelectItem key={level.id} value={level.number.toString()}>
                  Level {level.number}: {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {scores[facet.id] && (
          <Card>
            <CardHeader>
              <CardTitle>
                Level {scores[facet.id]}: {
                  facet.levels.find((l) => l.number === scores[facet.id])?.name
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {
                  facet.levels.find((l) => l.number === scores[facet.id])
                    ?.description
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{template.name}</h2>
        <p className="text-muted-foreground">{template.description}</p>
      </div>

      <Tabs value={selectedFacet} onValueChange={setSelectedFacet}>
        <TabsList className="w-full">
          {template.facets.map((facet) => (
            <TabsTrigger
              key={facet.id}
              value={facet.id}
              className="flex-1"
            >
              {facet.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {template.facets.map((facet) => (
          <TabsContent key={facet.id} value={facet.id}>
            {renderFacetContent(facet)}
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Submit Assessment</Button>
      </div>
    </div>
  );
}

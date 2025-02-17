"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssessmentPreviewProps {
  template: any; // Replace with proper type
}

export function AssessmentPreview({ template }: AssessmentPreviewProps) {
  const [currentFacetIndex, setCurrentFacetIndex] = useState(0);
  const currentFacet = template.facets[currentFacetIndex];

  const handleNext = () => {
    if (currentFacetIndex < template.facets.length - 1) {
      setCurrentFacetIndex(currentFacetIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentFacetIndex > 0) {
      setCurrentFacetIndex(currentFacetIndex - 1);
    }
  };

  return (
    <div className="py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">{template.name}</h1>
        <p className="text-muted-foreground">{template.description}</p>
      </div>

      {/* Progress Steps */}
      <div className="relative mb-6">
        <div className="flex justify-between">
          {template.facets.map((facet: any, index: number) => {
            const isCompleted = index < currentFacetIndex;
            const isCurrent = index === currentFacetIndex;

            return (
              <div key={facet.id} className="relative flex flex-col items-center flex-1">
                <button
                  onClick={() => setCurrentFacetIndex(index)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold relative z-10",
                    "transition-colors duration-200",
                    isCompleted ? "bg-primary text-primary-foreground" : 
                    isCurrent ? "bg-primary/10 text-primary border-2 border-primary" :
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {isCompleted ? <CheckIcon className="h-5 w-5" /> : index + 1}
                </button>
                <span className="text-xs font-medium mt-1.5 text-center">
                  {facet.name}
                </span>
                {index < template.facets.length - 1 && (
                  <div 
                    className={cn(
                      "absolute top-5 left-1/2 w-full h-[2px]",
                      isCompleted ? "bg-primary" : "bg-secondary"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Facet Content */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{currentFacet.name}</CardTitle>
          {currentFacet.description && (
            <p className="text-muted-foreground mt-1.5">{currentFacet.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentFacet.levels.map((level: any) => (
              <Card key={level.id} className="hover:bg-secondary/5 transition-colors">
                <CardContent className="p-3">
                  <div className="font-medium mb-1.5">
                    Level {level.number}: {level.name}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {level.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentFacetIndex === 0}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentFacetIndex === template.facets.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

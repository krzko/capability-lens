'use client';

import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { useAssessmentDetails } from '@/hooks/useAssessmentDetails';

interface AssessmentOverviewProps {
  assessmentId: string;
  onJumpToFacet: (facetName: string) => void;
}

export function AssessmentOverview({ assessmentId, onJumpToFacet }: AssessmentOverviewProps) {
  const { assessment, isLoading } = useAssessmentDetails(assessmentId);

  if (isLoading || !assessment) {
    return <div>Loading assessment details...</div>;
  }

  const { overallScore, previousOverallScore, facetScores } = assessment;

  const scoreDiff = overallScore - previousOverallScore;
  const sortedFacets = [...facetScores].sort((a, b) => b.score - a.score);
  const highestFacets = sortedFacets.slice(0, 2);
  const lowestFacets = sortedFacets.slice(-2).reverse();

  const chartData = facetScores.map(facet => ({
    facet: facet.name,
    score: facet.score,
    fullMark: 5,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Maturity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="facet" />
                <PolarRadiusAxis domain={[0, 5]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.5}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{overallScore.toFixed(1)}</div>
            <div className="flex items-center mt-2 text-sm">
              {scoreDiff > 0 ? (
                <ArrowUp className="w-4 h-4 text-green-500" />
              ) : scoreDiff < 0 ? (
                <ArrowDown className="w-4 h-4 text-red-500" />
              ) : (
                <Minus className="w-4 h-4 text-gray-500" />
              )}
              <span className={`ml-1 ${
                scoreDiff > 0 ? 'text-green-500' : 
                scoreDiff < 0 ? 'text-red-500' : 
                'text-gray-500'
              }`}>
                {Math.abs(scoreDiff).toFixed(1)} since last time
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Takeaways</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Strongest Areas</h4>
                {highestFacets.map(facet => (
                  <div key={facet.name} className="flex justify-between items-center mb-1">
                    <span className="text-sm">{facet.name}</span>
                    <span className="text-sm font-medium">{(facet.score || 0).toFixed(1)}</span>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-medium mb-2">Areas for Improvement</h4>
                {lowestFacets.map(facet => (
                  <div key={facet.name} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{facet.name}</span>
                      <span className="text-sm font-medium">{(facet.score || 0).toFixed(1)}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => onJumpToFacet(facet.name)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

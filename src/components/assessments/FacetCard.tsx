'use client';

import * as React from 'react';
import { useState } from 'react';
import { ArrowDown, ArrowUp, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAssessmentDetails } from '@/hooks/useAssessmentDetails';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface HistoricalData {
  date: string;
  score: number;
}

interface Level {
  id: string;
  number: number;
  name: string;
  description: string;
}

interface FacetCardProps {
  assessmentId: string;
  facetId: string;
}

export function FacetCard({ assessmentId, facetId }: FacetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { assessment, isLoading } = useAssessmentDetails(assessmentId);

  if (isLoading || !assessment) {
    return <div>Loading facet details...</div>;
  }

  const facetScore = assessment.facetScores.find(f => f.id === facetId);
  if (!facetScore) {
    return <div>Facet not found</div>;
  }

  const facet = assessment.template.facets.find(f => f.id === facetId);
  if (!facet) {
    return <div>Facet template not found</div>;
  }

  const { name, description, levels } = facet;
  const score = facetScore.score;
  const previousScore = facetScore.previousScore;
  const evidence = (assessment.scores as Record<string, { score: number; evidence?: string }>)[facetId]?.evidence;
  const currentScore = typeof score === 'number' ? score : 0;
  const prevScore = typeof previousScore === 'number' ? previousScore : 0;
  const scoreDiff = currentScore - prevScore;
  
  // Get recommendations from the current level
  const currentLevel = levels.find(l => l.number === Math.floor(currentScore));
  const recommendations = currentLevel?.description ? [currentLevel.description] : [];

  // Create historical data from current and previous scores
  const historicalData = [
    { date: new Date(assessment.createdAt).toISOString(), score: currentScore },
  ];
  if (previousScore) {
    historicalData.unshift({ date: new Date(assessment.createdAt).toISOString(), score: prevScore });
  }
  
  console.log('FacetCard scores:', { name, currentScore, prevScore, scoreDiff });

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div 
        className="flex flex-col space-y-1.5 p-6 cursor-pointer hover:bg-accent hover:text-accent-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{name}</h3>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm px-2 py-1 rounded-md border">
                Level {Math.floor(currentScore)} - {(levels || []).find(l => l.number === Math.floor(currentScore))?.name || 'Not Assessed'}
              </div>
              <div className="flex items-center text-sm">
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
                  {Math.abs(scoreDiff).toFixed(1)} from previous
                </span>
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold">{currentScore.toFixed(1)}</div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 pt-0 space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>



            {historicalData && historicalData.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Historical Trend</h4>
                <div className="h-[100px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-AU', { month: 'short', year: '2-digit' })}
                      />
                      <YAxis domain={[0, 5]} />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleDateString('en-AU', { dateStyle: 'medium' })}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#6366f1"
                        dot
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {recommendations && recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}



            <div className="pt-2">
              <Button variant="outline" size="sm">
                Create Improvement Task
              </Button>
            </div>
        </div>
      )}
    </div>
  );
}

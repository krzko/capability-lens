import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportAssessment } from '@/lib/export';
import type { Assessment } from '@/hooks/useMaturityAssessment';

interface MaturityAssessmentResultsProps {
  assessment: Assessment;
  historicalAssessments?: Assessment[];
}

export function MaturityAssessmentResults({
  assessment,
  historicalAssessments = [],
}: MaturityAssessmentResultsProps) {
  const chartData = useMemo(() => {
    return assessment.template.facets.map((facet) => ({
      facet: facet.name,
      score: assessment.scores[facet.id] || 0,
      fullMark: 5,
    }));
  }, [assessment]);

  const averageScore = useMemo(() => {
    const scores = Object.values(assessment.scores);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }, [assessment.scores]);

  const trendData = useMemo(() => {
    const allAssessments = [assessment, ...historicalAssessments].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return allAssessments.map((a) => ({
      date: format(new Date(a.createdAt), 'MMM d, yyyy'),
      ...assessment.template.facets.reduce((acc, facet) => ({
        ...acc,
        [facet.name]: a.scores[facet.id] || 0,
      }), {}),
      average: Object.values(a.scores).reduce((sum, score) => sum + score, 0) / Object.values(a.scores).length,
    }));
  }, [assessment, historicalAssessments]);

  const handleExport = async (format: 'markdown' | 'html' | 'pdf') => {
    await exportAssessment(assessment, format);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{assessment.template.name} Assessment</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Export Report</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport('markdown')}>
              Export as Markdown
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('html')}>
              Export as HTML
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('pdf')}>
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{assessment.template.name}</CardTitle>
          <CardDescription>
            Overall Maturity Score: {averageScore.toFixed(1)} / 5.0
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="facet" />
                <PolarRadiusAxis domain={[0, 5]} />
                <Radar
                  name="Current"
                  dataKey="score"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.6}
                />
                {historicalAssessments.length > 0 && (
                  <Radar
                    name="Previous"
                    dataKey="previousScore"
                    stroke="#6b7280"
                    fill="#6b7280"
                    fillOpacity={0.4}
                  />
                )}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {historicalAssessments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historical Trends</CardTitle>
            <CardDescription>
              Track your maturity progress over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  {assessment.template.facets.map((facet) => (
                    <Line
                      key={facet.id}
                      type="monotone"
                      dataKey={facet.name}
                      stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                      strokeWidth={2}
                    />
                  ))}
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#000000"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Overall Average"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assessment.template.facets.map((facet) => {
          const score = assessment.scores[facet.id] || 0;
          const level = facet.levels.find((l) => l.number === score);

          return (
            <Card key={facet.id}>
              <CardHeader>
                <CardTitle className="text-lg">{facet.name}</CardTitle>
                <CardDescription>Level {score}: {level?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {level?.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

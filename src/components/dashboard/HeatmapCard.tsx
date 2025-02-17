"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadialChart } from "./RadialChart";
import styles from './HeatmapCard.module.css';

interface HeatmapCardProps {
  organisation: string;
  team: string;
  serviceName: string;
  assessments: Array<{
    templateName: string;
    createdAt: string;
    facets: Array<{
      name: string;
      score: number;
      maxScore: number;
    }>;
  }>;
}

export function HeatmapCard({ organisation, team, serviceName, assessments }: HeatmapCardProps) {
  // Group assessments by template name
  const assessmentsByTemplate = assessments.reduce((acc, assessment) => {
    if (!acc[assessment.templateName]) {
      acc[assessment.templateName] = [];
    }
    acc[assessment.templateName].push(assessment);
    return acc;
  }, {} as Record<string, typeof assessments>);

  return (
    <>
      {Object.entries(assessmentsByTemplate).map(([templateName, templateAssessments]) => {
        const latestAssessment = templateAssessments[0];
        return (
          <div key={templateName} className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800 h-full">
            <div className="p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">{serviceName}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {organisation} / {team}
              </p>
              
              <div className="mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-base font-semibold text-gray-900 dark:text-white mb-4 text-center">
                    {templateName}
                  </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className={`${styles.lowContainer} rounded-xl p-4 text-center`}>
                    <div className={`${styles.lowCircle} inline-flex items-center justify-center w-12 h-12 rounded-full mb-2`}>
                      <span className={`${styles.lowText} text-xl font-medium`}>
                        {latestAssessment.facets.filter(f => f.score <= 2).length}
                      </span>
                    </div>
                    <div className={`${styles.lowText} text-sm`}>Low</div>
                  </div>
                  <div className={`${styles.mediumContainer} rounded-xl p-4 text-center`}>
                    <div className={`${styles.mediumCircle} inline-flex items-center justify-center w-12 h-12 rounded-full mb-2`}>
                      <span className={`${styles.mediumText} text-xl font-medium`}>
                        {latestAssessment.facets.filter(f => f.score > 2 && f.score <= 4).length}
                      </span>
                    </div>
                    <div className={`${styles.mediumText} text-sm`}>Medium</div>
                  </div>
                  <div className={`${styles.highContainer} rounded-xl p-4 text-center`}>
                    <div className={`${styles.highCircle} inline-flex items-center justify-center w-12 h-12 rounded-full mb-2`}>
                      <span className={`${styles.highText} text-xl font-medium`}>
                        {latestAssessment.facets.filter(f => f.score > 4).length}
                      </span>
                    </div>
                    <div className={`${styles.highText} text-sm`}>High</div>
                  </div>
                </div>
                  <div className="mt-4">
                    <RadialChart facets={latestAssessment.facets} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

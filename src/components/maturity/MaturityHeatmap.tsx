import { FC } from 'react';
import clsx from 'clsx';

interface MaturityHeatmapProps {
  levels: {
    name: string;
    score: number;
    description: string;
  }[];
  maxScore: number;
}

const MaturityHeatmap: FC<MaturityHeatmapProps> = ({ levels, maxScore }) => {
  const getHeatmapColor = (score: number) => {
    const percentage = score / maxScore;
    if (percentage < 0.2) return 'bg-red-500';
    if (percentage < 0.4) return 'bg-orange-500';
    if (percentage < 0.6) return 'bg-yellow-500';
    if (percentage < 0.8) return 'bg-lime-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-4">
      {levels.map((level, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{level.name}</span>
            <span className="text-sm text-gray-500">{level.score.toFixed(1)}/{maxScore.toFixed(1)}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className={clsx(
                'h-full rounded-full transition-all duration-500',
                getHeatmapColor(level.score)
              )}
              style={{ width: `${(level.score / maxScore) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">{level.description}</p>
        </div>
      ))}
    </div>
  );
};

export default MaturityHeatmap;

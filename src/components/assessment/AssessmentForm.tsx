import { FC, useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import clsx from 'clsx';

interface Level {
  id: string;
  name: string;
  description: string;
}

interface AssessmentFormProps {
  matrixName: string;
  levels: Level[];
  onSave: (scores: Record<string, number>) => void;
}

const scoreOptions = [
  { value: 0, label: 'N/A' },
  { value: 1, label: 'Initial' },
  { value: 2, label: 'Developing' },
  { value: 3, label: 'Defined' },
  { value: 4, label: 'Managed' },
  { value: 5, label: 'Optimizing' },
];

const AssessmentForm: FC<AssessmentFormProps> = ({ matrixName, levels, onSave }) => {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleScoreChange = (levelId: string, score: number) => {
    setScores((prev) => ({ ...prev, [levelId]: score }));
  };

  const handleNotesChange = (levelId: string, note: string) => {
    setNotes((prev) => ({ ...prev, [levelId]: note }));
  };

  const handleSubmit = () => {
    onSave(scores);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900">{matrixName} Assessment</h2>
        <p className="mt-1 text-sm text-gray-500">
          Rate each capability area based on the current maturity level.
        </p>
      </div>

      <div className="space-y-6">
        {levels.map((level) => (
          <div key={level.id} className="bg-white p-6 shadow sm:rounded-lg">
            <h3 className="text-base font-medium text-gray-900">{level.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{level.description}</p>

            <div className="mt-4">
              <RadioGroup
                value={scores[level.id] || 0}
                onChange={(value) => handleScoreChange(level.id, value)}
                className="mt-2"
              >
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {scoreOptions.map((option) => (
                    <RadioGroup.Option
                      key={option.value}
                      value={option.value}
                      className={({ active, checked }) =>
                        clsx(
                          'cursor-pointer focus:outline-none',
                          active ? 'ring-2 ring-indigo-600 ring-offset-2' : '',
                          checked
                            ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                            : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                          'flex items-center justify-center rounded-md py-3 text-sm font-semibold uppercase'
                        )
                      }
                    >
                      <RadioGroup.Label as="span">{option.label}</RadioGroup.Label>
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="mt-4">
              <label htmlFor={`notes-${level.id}`} className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id={`notes-${level.id}`}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={notes[level.id] || ''}
                onChange={(e) => handleNotesChange(level.id, e.target.value)}
                placeholder="Add any relevant notes or evidence..."
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save Assessment
        </button>
      </div>
    </div>
  );
};

export default AssessmentForm;

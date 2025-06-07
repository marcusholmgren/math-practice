import React from 'react';
import { useSettings } from '../context/SettingsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const difficultyLevels = [
  { id: 'easy', name: 'Easy' },
  { id: 'medium', name: 'Medium' },
  { id: 'hard', name: 'Hard' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { difficulty, setDifficulty } = useSettings();

  if (!isOpen) {
    return null;
  }

  const handleDifficultyChange = (newDifficulty: string) => {
    setDifficulty(newDifficulty);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close settings modal"
          >
            &times;
          </button>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Select Difficulty:</h3>
          <div className="space-y-2">
            {difficultyLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleDifficultyChange(level.id)}
                className={`w-full text-left px-4 py-2 rounded-md border ${
                  difficulty === level.id
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                }`}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>
        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

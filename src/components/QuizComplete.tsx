import React from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import type { QuizState } from '../types';

interface QuizCompleteProps {
  state: QuizState;
  onRestart: () => void;
}

export function QuizComplete({ state, onRestart }: QuizCompleteProps) {
  const percentage = Math.round((state.score / state.answers.length) * 100);

  return (
    <div className="text-center space-y-6">
      <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
      <h2 className="text-2xl font-bold">Quiz Complete!</h2>
      
      <div className="p-6 bg-white rounded-lg shadow-md">
        <p className="text-4xl font-bold text-blue-600 mb-2">
          {state.score}/{state.answers.length}
        </p>
        <p className="text-gray-600">Final Score: {percentage}%</p>
      </div>

      <button
        onClick={onRestart}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <RefreshCw className="w-5 h-5" />
        Try Again
      </button>
    </div>
  );
}
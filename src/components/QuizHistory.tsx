import React from 'react';
import { History } from 'lucide-react';
import type { QuizAttempt } from '../types';

interface QuizHistoryProps {
  attempts: QuizAttempt[];
}

export function QuizHistory({ attempts }: QuizHistoryProps) {
  if (attempts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Previous Attempts</h2>
      </div>
      <div className="space-y-4">
        {attempts.map((attempt, index) => (
          <div
            key={attempt.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium">Attempt #{attempts.length - index}</p>
              <p className="text-sm text-gray-600">
                {new Date(attempt.date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                {attempt.score}/{attempt.totalQuestions}
              </p>
              <p className="text-sm text-gray-600">
                {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
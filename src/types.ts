export interface Question {
  id: number;
  question: string;
  type: 'multiple-choice' | 'integer';
  options?: string[];
  correctAnswer: number | string;
  instructions?: string;
}

export interface QuizAttempt {
  id: string;
  date: Date;
  score: number;
  totalQuestions: number;
  timePerQuestion: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: (number | string)[];
  timeLeft: number;
  isComplete: boolean;
  score: number;
}
import React, { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { questions, instructions, QUIZ_TIME } from './data/questions';
import { Timer } from './components/Timer';
import { QuizComplete } from './components/QuizComplete';
import { QuizHistory } from './components/QuizHistory';
import { saveAttempt, getAttempts } from './utils/db';
import type { QuizState, QuizAttempt } from './types';

function App() {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: [],
    timeLeft: QUIZ_TIME,
    isComplete: false,
    score: 0,
  });

  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [integerAnswer, setIntegerAnswer] = useState<string>('');

  useEffect(() => {
    getAttempts().then(setAttempts);
  }, []);

  useEffect(() => {
    if (state.isComplete) return;

    const timer = setInterval(() => {
      setState(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          return {
            ...prev,
            timeLeft: 0,
            isComplete: true,
          };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.isComplete]);

  const currentQuestion = questions[state.currentQuestionIndex];

  const handleMultipleChoiceAnswer = async (answerIndex: number) => {
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    handleAnswer(answerIndex, isCorrect);
  };

  const handleIntegerAnswer = async () => {
    const isCorrect = integerAnswer === currentQuestion.correctAnswer;
    handleAnswer(integerAnswer, isCorrect);
    setIntegerAnswer('');
  };

  const handleAnswer = async (answer: number | string, isCorrect: boolean) => {
    const nextIndex = state.currentQuestionIndex + 1;
    const isComplete = nextIndex >= questions.length;

    const newState = {
      ...state,
      answers: [...state.answers, answer],
      score: state.score + (isCorrect ? 1 : 0),
      currentQuestionIndex: nextIndex,
      isComplete,
    };

    setState(newState);

    if (isComplete) {
      const attempt: QuizAttempt = {
        id: Date.now().toString(),
        date: new Date(),
        score: newState.score + (isCorrect ? 1 : 0),
        totalQuestions: questions.length,
        timePerQuestion: QUIZ_TIME / questions.length,
      };
      await saveAttempt(attempt);
      setAttempts(await getAttempts());
    }
  };

  const handleRestart = () => {
    setState({
      currentQuestionIndex: 0,
      answers: [],
      timeLeft: QUIZ_TIME,
      isComplete: false,
      score: 0,
    });
    setIntegerAnswer('');
  };

  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Brain className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Interactive Quiz Platform</h1>
        </div>

        {!state.isComplete && state.currentQuestionIndex === 0 ? (
          <div className="flex gap-6 mb-6">
            <div className="w-1/3 bg-white rounded-lg shadow-md p-6 flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Instructions</h2>
              <div className="flex-1 flex flex-col justify-center">
                <ul className="list-disc pl-6 space-y-4">
                  {instructions.map((instruction, index) => (
                    <li key={index} className="text-gray-700">{instruction}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="w-2/3 bg-white rounded-lg shadow-md p-6 flex flex-col">
              <Timer timeLeft={state.timeLeft} totalTime={QUIZ_TIME} />
              <p className="text-lg font-medium mt-4">Time Remaining: {formatTimeLeft(state.timeLeft)}</p>
              
              <div className="space-y-4 mt-6 flex-1">
                <h2 className="text-xl font-semibold">
                  Question {state.currentQuestionIndex + 1} of {questions.length}
                </h2>
                <p className="text-lg">{currentQuestion.question}</p>

                {currentQuestion.type === 'multiple-choice' ? (
                  <div className="grid gap-3 mt-6">
                    {currentQuestion.options!.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleMultipleChoiceAnswer(index)}
                        className="p-4 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 mt-6">
                    <input
                      type="number"
                      value={integerAnswer}
                      onChange={(e) => setIntegerAnswer(e.target.value)}
                      placeholder="Enter your answer"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleIntegerAnswer}
                      disabled={!integerAnswer}
                      className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : state.isComplete ? (
          <QuizComplete state={state} onRestart={handleRestart} />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6 mb-6">
            <Timer timeLeft={state.timeLeft} totalTime={QUIZ_TIME} />
            <p className="text-lg font-medium">Time Remaining: {formatTimeLeft(state.timeLeft)}</p>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                Question {state.currentQuestionIndex + 1} of {questions.length}
              </h2>
              <p className="text-lg">{currentQuestion.question}</p>
            </div>

            {currentQuestion.type === 'multiple-choice' ? (
              <div className="grid gap-3">
                {currentQuestion.options!.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleMultipleChoiceAnswer(index)}
                    className="p-4 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="number"
                  value={integerAnswer}
                  onChange={(e) => setIntegerAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleIntegerAnswer}
                  disabled={!integerAnswer}
                  className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              </div>
            )}
          </div>
        )}

        <QuizHistory attempts={attempts} />
      </div>
    </div>
  );
}

export default App;
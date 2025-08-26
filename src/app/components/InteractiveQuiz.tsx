"use client";

import { useState } from 'react';
import { QuizQuestion, RAMP_QUIZ_QUESTIONS } from './quizQuestions';

interface InteractiveQuizProps {
  questions?: QuizQuestion[];
}

export default function InteractiveQuiz({ questions = RAMP_QUIZ_QUESTIONS }: InteractiveQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  const handleAnswerSelect = (questionId: number, selectedOption: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));

    // Show result immediately after selection
    setShowResults(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const isCorrect = (questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    return question && selectedAnswers[questionId] === question.correctAnswer;
  };

  const getTotalScore = () => {
    return questions.filter(q => isCorrect(q.id)).length;
  };

  const allQuestionsAnswered = () => {
    return questions.every(q => selectedAnswers[q.id]);
  };

  return (
    <div className="space-y-8 font-inter">
      {questions.map((question) => (
        <div key={question.id} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h4 className="text-xl font-semibold mb-6 text-slate-800 leading-relaxed">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mr-3">
              {question.id}
            </span>
            {question.question}
          </h4>
          
          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = selectedAnswers[question.id] === option.letter;
              const showResult = showResults[question.id];
              const isCorrectAnswer = option.letter === question.correctAnswer;
              
              let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer font-medium ";
              
              if (showResult) {
                if (isSelected && isCorrectAnswer) {
                  buttonClass += "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-md";
                } else if (isSelected && !isCorrectAnswer) {
                  buttonClass += "bg-rose-50 border-rose-300 text-rose-800 shadow-md";
                } else if (isCorrectAnswer) {
                  buttonClass += "bg-emerald-25 border-emerald-200 text-emerald-700 shadow-sm";
                } else {
                  buttonClass += "bg-slate-50 border-slate-200 text-slate-500";
                }
              } else {
                if (isSelected) {
                  buttonClass += "bg-blue-50 border-blue-300 text-blue-800 shadow-md";
                } else {
                  buttonClass += "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 hover:shadow-sm";
                }
              }

              return (
                <button
                  key={option.letter}
                  onClick={() => handleAnswerSelect(question.id, option.letter)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex items-center">
                    <span className="font-bold mr-4 min-w-[32px] h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm">
                      {option.letter}
                    </span>
                    <span className="leading-relaxed">{option.text}</span>
                    {showResult && isCorrectAnswer && (
                      <span className="ml-auto text-emerald-600 text-xl">✓</span>
                    )}
                    {showResult && isSelected && !isCorrectAnswer && (
                      <span className="ml-auto text-rose-600 text-xl">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showResults[question.id] && (
            <div className={`mt-6 p-5 rounded-xl border-l-4 ${
              isCorrect(question.id) 
                ? 'bg-emerald-50 border-emerald-400 shadow-sm' 
                : 'bg-amber-50 border-amber-400 shadow-sm'
            }`}>
              <div className="flex items-start">
                <span className={`text-3xl mr-4 ${
                  isCorrect(question.id) ? 'text-emerald-500' : 'text-amber-500'
                }`}>
                  {isCorrect(question.id) ? '🎉' : '💡'}
                </span>
                <div className="flex-1">
                  <p className={`font-bold text-lg mb-2 ${
                    isCorrect(question.id) ? 'text-emerald-800' : 'text-amber-800'
                  }`}>
                    {isCorrect(question.id) ? 'Excellent!' : 'Good try!'}
                  </p>
                  <p className={`text-base leading-relaxed ${
                    isCorrect(question.id) ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {question.explanation}
                  </p>
                  
                  {/* Learn more link */}
                  {question.learnMoreUrl && (
                    <a 
                      href={question.learnMoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 mt-3 text-sm font-medium underline hover:no-underline ${
                        isCorrect(question.id) ? 'text-emerald-700 hover:text-emerald-800' : 'text-amber-700 hover:text-amber-800'
                      }`}
                    >
                      {question.learnMoreText || 'Learn more'}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Quiz completion section */}
      {allQuestionsAnswered() && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl p-8 text-center shadow-lg">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-blue-800 mb-3">
            Quiz Complete!
          </h3>
          <p className="text-lg text-blue-700 mb-4 font-medium">
            You scored <span className="font-bold text-xl">{getTotalScore()}</span> out of <span className="font-bold text-xl">{questions.length}</span> questions correctly.
          </p>
          
          {getTotalScore() === questions.length && (
            <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-4 mb-4">
              <p className="text-emerald-800 font-bold text-lg">
                🚀 Perfect score! You're ready for the next step!
              </p>
            </div>
          )}
          
          {getTotalScore() === 0 && (
            <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 mb-4">
              <p className="text-orange-800 font-semibold">
                📚 Keep studying! Review the explanations above and try again.
              </p>
            </div>
          )}
          
          {getTotalScore() > 0 && getTotalScore() < questions.length && (
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-4">
              <p className="text-blue-800 font-semibold">
                💪 Good job! Review the explanations for the questions you missed.
              </p>
            </div>
          )}
          
          <div className="text-sm text-slate-600 mt-4">
            <span className="font-medium">Score: {Math.round((getTotalScore() / questions.length) * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
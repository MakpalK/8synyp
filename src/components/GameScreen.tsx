import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Send,
  Loader2,
} from 'lucide-react';
import { QuestionClient } from '../types.js';
import { SpreadsheetCellPreview } from './SpreadsheetCellPreview.js';

interface GameScreenProps {
  questions: QuestionClient[];
  studentName: string;
  studentClass: string;
  answers: Record<number, string>;
  onSelectAnswer: (questionId: number, optionId: string) => void;
  onSubmitGame: () => Promise<void>;
  isSubmitting: boolean;
  submissionError: string | null;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  questions,
  studentName,
  studentClass,
  answers,
  onSelectAnswer,
  onSubmitGame,
  isSubmitting,
  submissionError,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).filter((k) => !!answers[Number(k)]).length;

  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  // Find all unanswered question IDs
  const unansweredIds = questions
    .filter((q) => !answers[q.id])
    .map((q) => q.id);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitting) return;

      // Number keys 1, 2, 3, 4 or A, B, C, D for option selection
      if (['1', '2', '3', '4'].includes(e.key) && currentQuestion) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentQuestion.options[idx]) {
          onSelectAnswer(currentQuestion.id, currentQuestion.options[idx].id);
        }
      } else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key) && currentQuestion) {
        const optId = e.key.toUpperCase();
        if (currentQuestion.options.some((o) => o.id === optId)) {
          onSelectAnswer(currentQuestion.id, optId);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQuestion, totalQuestions, onSelectAnswer, isSubmitting]);

  const handleFinishClick = () => {
    if (answeredCount < totalQuestions) {
      setShowWarningModal(true);
      return;
    }
    onSubmitGame();
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center text-slate-600">
        Сұрақтар жүктелуде...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Student Top Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500">Оқушы:</div>
          <div className="text-sm font-bold text-slate-900">
            {studentName} <span className="font-normal text-purple-700">({studentClass} сынып)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500">Жауап берілгені:</div>
            <div className="text-sm font-bold text-purple-700 tabular-nums">
              {answeredCount} / {totalQuestions}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-24 sm:w-32 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-cyan-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question 1-10 Navigator */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 mb-6 shadow-xs">
        <div className="text-xs font-semibold text-slate-600 mb-2.5 flex items-center justify-between">
          <span>Сұрақтар тізбегі (1–{totalQuestions}):</span>
          <span className="text-[11px] text-slate-500 font-normal">
            Кез келген сұраққа басып өте аласыз
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
          {questions.map((q, idx) => {
            const isAnswered = Boolean(answers[q.id]);
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-10 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                  isCurrent
                    ? 'ring-2 ring-purple-600 bg-purple-700 text-white shadow-xs'
                    : isAnswered
                    ? 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
                title={`Сұрақ ${q.id} ${isAnswered ? '(Жауап берілген)' : '(Жауап берілмеген)'}`}
              >
                <span>{q.id}</span>
                {isAnswered && !isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submission error if any */}
      {submissionError && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{submissionError}</span>
          </div>
          <button
            onClick={() => handleFinishClick()}
            disabled={isSubmitting}
            className="px-3 py-1 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            Қайта жіберу
          </button>
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 mb-6">
        {/* Header of Question */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-white bg-purple-700 px-2.5 py-1 rounded-md font-formula">
              № {currentQuestion.id}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Функция: <span className="text-purple-700 font-formula">{currentQuestion.targetFunction}()</span>
            </span>
          </div>

          <div className="text-xs text-slate-500">
            {currentIndex + 1} / {totalQuestions}
          </div>
        </div>

        {/* Question Text */}
        <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug whitespace-pre-line mb-3">
          {currentQuestion.question}
        </div>

        {/* Spreadsheet Visual Preview if question has tabular context */}
        {currentQuestion.spreadsheetData && (
          <SpreadsheetCellPreview
            data={currentQuestion.spreadsheetData}
            formula={currentQuestion.formula}
            targetFunction={currentQuestion.targetFunction}
          />
        )}

        {/* Answer Options */}
        <div className="mt-5 space-y-2.5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Жауап нұсқалары (біреуін таңдаңыз):
          </div>

          {currentQuestion.options.map((option, optIdx) => {
            const isSelected = currentAnswer === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectAnswer(currentQuestion.id, option.id)}
                className={`w-full p-3.5 sm:p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-600/30 text-purple-950 font-semibold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {option.id}
                  </span>
                  <span className="text-sm font-formula">{option.text}</span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0 || isSubmitting}
          className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Алдыңғы сұрақ</span>
        </button>

        <div className="w-full sm:w-auto flex items-center gap-2">
          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Келесі сұрақ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : null}

          {/* Finish Button */}
          <button
            type="button"
            onClick={handleFinishClick}
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              answeredCount === totalQuestions
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 ring-2 ring-emerald-500/20'
                : 'bg-purple-900 hover:bg-purple-950 opacity-90'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Серверде тексерілуде...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Ойынды аяқтау ({answeredCount}/{totalQuestions})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Educational Value Reminders (Subtle footer callout) */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-3 text-center text-xs text-slate-500 space-y-1">
        <p>«Әділдік және жауапкершілік: өз жауабыңызды таңдаңыз»</p>
        <p className="text-[11px] text-slate-400">
          «Еңбекқорлық және кәсіби біліктілік: қатені талдап, қайта үйреніңіз»
        </p>
      </div>

      {/* Incomplete Submission Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center">
              Барлық сұраққа жауап берілмеген!
            </h3>

            <p className="mt-2 text-xs text-slate-600 text-center leading-relaxed">
              Ойын ережесіне сәйкес, нәтижені серверге жіберу үшін барлық 10 сұраққа жауап беру қажет.
            </p>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <span className="font-semibold">Жауап берілмеген сұрақтар:</span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {unansweredIds.map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      const idx = questions.findIndex((q) => q.id === id);
                      if (idx !== -1) setCurrentIndex(idx);
                      setShowWarningModal(false);
                    }}
                    className="px-2.5 py-1 bg-white border border-amber-300 rounded text-amber-900 font-bold hover:bg-amber-100 transition-colors"
                  >
                    № {id}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  if (unansweredIds.length > 0) {
                    const firstUnansweredIndex = questions.findIndex((q) => q.id === unansweredIds[0]);
                    if (firstUnansweredIndex !== -1) setCurrentIndex(firstUnansweredIndex);
                  }
                  setShowWarningModal(false);
                }}
                className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-colors cursor-pointer"
              >
                Жауап беруге оралу
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Database,
  ArrowRight,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubmitQuizResponse } from '../types.js';
import { SpreadsheetCellPreview } from './SpreadsheetCellPreview.js';

interface ResultScreenProps {
  resultData: SubmitQuizResponse;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  resultData,
  onPlayAgain,
  onViewLeaderboard,
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong'>('all');

  const { score, maxScore, studentName, studentClass, results, savedToDatabase } = resultData;
  const incorrectCount = maxScore - score;
  const percentage = Math.round((score / maxScore) * 100);

  // Trigger confetti for high scores
  useEffect(() => {
    if (score >= 9) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (_) {}
    }
  }, [score]);

  // Pedagogical feedback based on score
  const getFeedback = (points: number) => {
    if (points >= 9) {
      return {
        title: 'Өте жақсы!',
        text: 'Өте жақсы! Математикалық функцияларды сенімді қолданасыз.',
        badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        starColor: 'text-amber-500',
      };
    }
    if (points >= 7) {
      return {
        title: 'Жақсы нәтиже!',
        text: 'Жақсы нәтиже! Қателерді талдап, біліміңізді бекітіңіз.',
        badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
        starColor: 'text-purple-500',
      };
    }
    if (points >= 5) {
      return {
        title: 'Жаттығуды жалғастырыңыз!',
        text: 'Жаттығуды жалғастырыңыз. Қате жауаптардың түсіндірмесін оқыңыз.',
        badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
        starColor: 'text-amber-500',
      };
    }
    return {
      title: 'Қайта орындап көріңіз!',
      text: 'Функциялардың қызметін қайталап, қайта орындап көріңіз.',
      badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
      starColor: 'text-rose-500',
    };
  };

  const feedback = getFeedback(score);

  const filteredResults = results.filter((r) => {
    if (filter === 'correct') return r.isCorrect;
    if (filter === 'wrong') return !r.isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Success & Database Sync Indicator */}
      {savedToDatabase && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Нәтиже сақталды: Ұпайыңыз ортақ серверлік дерекқорға сәтті тіркелді
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-mono hidden sm:inline">
            ID: {resultData.sessionId.slice(0, 8)}...
          </span>
        </div>
      )}

      {/* Main Score Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 mb-8">
        <div className="text-center max-w-xl mx-auto">
          {/* Student Identity */}
          <div className="text-xs text-slate-500 font-medium mb-1">
            {studentClass} сынып оқушысы
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
            {studentName}
          </h1>

          {/* Big Score Display */}
          <div className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 my-2">
            <Trophy className="w-8 h-8 text-purple-700" />
            <span className="text-4xl sm:text-5xl font-black text-purple-900 tabular-nums">
              {score}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-400">/ {maxScore}</span>
            <span className="text-xs font-bold text-purple-700 ml-2 bg-purple-100 px-2.5 py-1 rounded-md">
              {percentage}%
            </span>
          </div>

          {/* Teacher Feedback Banner */}
          <div className={`mt-4 p-4 rounded-xl border text-sm leading-relaxed ${feedback.badgeColor}`}>
            <div className="font-bold mb-0.5">{feedback.title}</div>
            <p>{feedback.text}</p>
          </div>

          {/* Correct / Incorrect Tallies */}
          <div className="mt-5 grid grid-cols-2 gap-3 max-w-md mx-auto">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
              <div className="text-xs text-emerald-700 font-medium flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Дұрыс жауап:</span>
              </div>
              <div className="text-2xl font-black text-emerald-800 mt-1 tabular-nums">
                {score}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-center">
              <div className="text-xs text-rose-700 font-medium flex items-center justify-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>Қате жауап:</span>
              </div>
              <div className="text-2xl font-black text-rose-800 mt-1 tabular-nums">
                {incorrectCount}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onPlayAgain}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Қайта ойнау</span>
            </button>

            <button
              type="button"
              onClick={onViewLeaderboard}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>Ортақ нәтижелер кестесін көру</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Question Review Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Сұрақтарды талдау және дұрыс жауаптар
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Әр сұрақ бойынша таңдалған жауап, дұрыс жауап және әдістемелік түсіндірме
            </p>
          </div>

          {/* Interactive filter segmented control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Барлығы ({results.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === 'correct'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Дұрыс ({score})
            </button>
            <button
              onClick={() => setFilter('wrong')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === 'wrong'
                  ? 'bg-white text-rose-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Қате ({incorrectCount})
            </button>
          </div>
        </div>

        {/* Review Cards */}
        {filteredResults.map((item) => {
          const selectedOption = item.options.find((o) => o.id === item.studentAnswer);
          const correctOption = item.options.find((o) => o.id === item.correctAnswer);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all ${
                item.isCorrect
                  ? 'border-emerald-200 hover:border-emerald-300'
                  : 'border-rose-200 hover:border-rose-300'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                      item.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    № {item.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 font-formula">
                    {item.targetFunction}()
                  </span>
                </div>

                <div
                  className={`text-xs font-bold flex items-center gap-1.5 ${
                    item.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {item.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Дұрыс (+1 балл)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>Қате (0 балл)</span>
                    </>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug whitespace-pre-line mb-3">
                {item.question}
              </div>

              {/* Spreadsheet data if exists */}
              {item.spreadsheetData && (
                <SpreadsheetCellPreview
                  data={item.spreadsheetData}
                  formula={item.formula}
                  targetFunction={item.targetFunction}
                />
              )}

              {/* Answers Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-slate-100 text-xs">
                <div
                  className={`p-2.5 rounded-lg border ${
                    item.isCorrect
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/60 border-rose-200 text-rose-950'
                  }`}
                >
                  <span className="font-semibold block text-[11px] mb-0.5">
                    Сіздің жауабыңыз:
                  </span>
                  <div className="flex items-center gap-2 font-formula font-medium">
                    <span className="font-bold">{item.studentAnswer})</span>
                    <span>{selectedOption ? selectedOption.text : 'Таңдалмаған'}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border bg-purple-50/60 border-purple-200 text-purple-950">
                  <span className="font-semibold block text-[11px] mb-0.5 text-purple-800">
                    Дұрыс жауап:
                  </span>
                  <div className="flex items-center gap-2 font-formula font-medium text-purple-900">
                    <span className="font-bold">{item.correctAnswer})</span>
                    <span>{correctOption ? correctOption.text : ''}</span>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">Түсіндірме:</span> {item.explanation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  RefreshCw,
  Download,
  Filter,
  Medal,
  Calendar,
  Users,
  Play,
  CheckCircle,
} from 'lucide-react';
import { LeaderboardEntry, LeaderboardResponse } from '../types.js';

interface LeaderboardScreenProps {
  onStartNewGame: () => void;
  activeStudentClass?: string;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  onStartNewGame,
  activeStudentClass,
}) => {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());

  const fetchLeaderboard = async (isManual = false) => {
    if (isManual) setIsLoading(true);
    try {
      const url =
        selectedClass !== 'all'
          ? `/api/leaderboard?class=${encodeURIComponent(selectedClass)}`
          : '/api/leaderboard';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Деректерді жүктеу сәтсіз аяқталды');
      const json: LeaderboardResponse = await res.json();
      setData(json);
      setLastRefreshedAt(new Date());
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Ортақ нәтижелерді серверден жүктеу мүмкін болмады');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedClass]);

  // Periodic polling every 12 seconds if autoRefresh is enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLeaderboard(false);
    }, 12000);
    return () => clearInterval(interval);
  }, [autoRefresh, selectedClass]);

  const handleDownloadCsv = () => {
    const url =
      selectedClass !== 'all'
        ? `/api/export-csv?class=${encodeURIComponent(selectedClass)}`
        : '/api/export-csv';
    window.location.href = url;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold text-xs ring-1 ring-amber-300">
          🥇 1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-bold text-xs ring-1 ring-slate-300">
          🥈 2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/10 text-amber-900 font-bold text-xs ring-1 ring-amber-700/30">
          🥉 3
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 text-xs font-bold text-slate-500 tabular-nums">
        {rank}
      </span>
    );
  };

  const entries = data?.leaderboard || [];
  const allClasses = data?.classes || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-700 font-semibold mb-1">
            <Trophy className="w-4 h-4" />
            <span>Ортақ серверлік рейтинг</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Барлық оқушылардың нәтижелері
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Әртүрлі компьютерлер мен телефондардан қатысқан оқушылардың ең жоғары ұпайлары
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onStartNewGame}
            className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Ойынды бастау</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCsv}
            disabled={entries.length === 0}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Excel бағдарламасына арналған CSV форматында жүктеу"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV жүктеу</span>
          </button>

          <button
            type="button"
            onClick={() => fetchLeaderboard(true)}
            disabled={isLoading}
            className="p-2 text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
            title="Кестені қолмен жаңарту"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-purple-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Bar & Telemetry Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Class Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Сынып бойынша:</span>
          </span>

          <button
            onClick={() => setSelectedClass('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              selectedClass === 'all'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Барлық сыныптар
          </button>

          {allClasses.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                selectedClass === cls
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Live sync indicator & auto-refresh toggle */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 h-3.5 w-3.5"
            />
            <span className="text-[11px]">Автожаңарту (12с)</span>
          </label>
          <span aria-hidden="true">·</span>
          <span className="text-[11px] tabular-nums">
            Соңғы жаңару: {lastRefreshedAt.toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Main Leaderboard Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading && !data ? (
          <div className="p-12 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
            <span>Серверден нәтижелер жүктелуде...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-600 text-xs">
            {error}
            <div className="mt-3">
              <button
                onClick={() => fetchLeaderboard(true)}
                className="px-3 py-1.5 bg-red-100 text-red-800 font-semibold rounded-lg hover:bg-red-200"
              >
                Қайта байқап көру
              </button>
            </div>
          </div>
        ) : entries.length === 0 ? (
          /* Empty state requirement: no fake data */
          <div className="p-12 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Әзірге ешқандай нәтиже тіркелмеген
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {selectedClass !== 'all'
                ? `«${selectedClass}» сыныбы бойынша оқушылар әлі ойынды аяқтаған жоқ.`
                : 'Оқушылар ойынды аяқтағаннан кейін олардың нақты ұпайлары осы ортақ кестеге автоматты түрде жиналады.'}
            </p>
            <div className="mt-4">
              <button
                onClick={onStartNewGame}
                className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-colors"
              >
                Бірінші болып ойынды бастау
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 select-none">
                  <th className="px-4 py-3 font-semibold text-center w-16">Орын</th>
                  <th className="px-4 py-3 font-semibold">Оқушының аты</th>
                  <th className="px-4 py-3 font-semibold text-center w-24">Сыныбы</th>
                  <th className="px-4 py-3 font-semibold text-center w-28">Ұпайы</th>
                  <th className="px-4 py-3 font-semibold text-right">Тапсырған күні мен уақыты</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((entry) => {
                  const isTop3 = entry.rank <= 3;
                  return (
                    <tr
                      key={`${entry.studentName}-${entry.studentClass}`}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isTop3 ? 'bg-purple-50/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-center">{getRankBadge(entry.rank)}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{entry.studentName}</span>
                          {entry.attemptsCount && entry.attemptsCount > 1 && (
                            <span
                              className="text-[10px] text-slate-400 font-normal"
                              title={`${entry.attemptsCount} рет ойнаған`}
                            >
                              ({entry.attemptsCount} әрекет)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60 font-formula">
                          {entry.studentClass}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-1 font-bold font-formula tabular-nums">
                          <span
                            className={
                              entry.score >= 9
                                ? 'text-emerald-700'
                                : entry.score >= 7
                                ? 'text-purple-700'
                                : 'text-slate-800'
                            }
                          >
                            {entry.score}
                          </span>
                          <span className="text-slate-400">/</span>
                          <span className="text-slate-500">{entry.maxScore}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500 font-formula tabular-nums text-[11px]">
                        {entry.formattedDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {entries.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 px-2">
          <span>Барлығы тіркелген оқушылар саны: {entries.length}</span>
          <span>Бірдей ұпайда ертерек тапсырған оқушы жоғары орын алады</span>
        </div>
      )}
    </div>
  );
};

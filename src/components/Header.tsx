import React from 'react';
import { Award, BookOpen, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentView: 'login' | 'game' | 'result' | 'leaderboard';
  onNavigate: (view: 'login' | 'game' | 'result' | 'leaderboard') => void;
  onOpenTeacher: () => void;
  activeStudent?: { name: string; studentClass: string } | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenTeacher,
  activeStudent,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <button
          onClick={() => onNavigate(activeStudent ? 'game' : 'login')}
          className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 text-left"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 text-white flex items-center justify-center font-formula font-bold text-sm shadow-sm">
            fx
          </span>
          <span>Формула шебері</span>
        </button>

        {/* Zone 2: Navigation Links (Clean single-line text links) */}
        <nav className="flex items-center gap-3 sm:gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate(activeStudent ? 'game' : 'login')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-700 ${
              currentView === 'game' || currentView === 'login'
                ? 'text-purple-700 font-semibold'
                : 'text-slate-600'
            }`}
          >
            Ойын
          </button>
          <button
            onClick={() => onNavigate('leaderboard')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-700 ${
              currentView === 'leaderboard'
                ? 'text-purple-700 font-semibold'
                : 'text-slate-600'
            }`}
          >
            Ортақ нәтижелер
          </button>
          <button
            onClick={onOpenTeacher}
            className="text-slate-600 hover:text-purple-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Мұғалім бөлімі</span>
            <span className="sm:hidden">Мұғалім</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / Active Student Info */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {activeStudent ? (
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-900 truncate max-w-[120px] sm:max-w-[160px]">
                {activeStudent.name}
              </div>
              <div className="text-[11px] text-purple-700 font-medium">
                {activeStudent.studentClass} сыныбы
              </div>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              Ойынға кіру
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

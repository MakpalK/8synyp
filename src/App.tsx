import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { LoginScreen } from './components/LoginScreen.js';
import { GameScreen } from './components/GameScreen.js';
import { ResultScreen } from './components/ResultScreen.js';
import { LeaderboardScreen } from './components/LeaderboardScreen.js';
import { TeacherModal } from './components/TeacherModal.js';
import { QuestionClient, SubmitQuizResponse } from './types.js';

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'game' | 'result' | 'leaderboard'>('login');
  const [studentName, setStudentName] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [questions, setQuestions] = useState<QuestionClient[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [resultData, setResultData] = useState<SubmitQuizResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isTeacherOpen, setIsTeacherOpen] = useState(false);
  const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);

  // Load questions on initial mount
  useEffect(() => {
    fetchQuestions();

    // Check for temporary session recovery in case student accidentally refreshes
    try {
      const savedTemp = sessionStorage.getItem('formula_sheberi_temp_session');
      if (savedTemp) {
        const parsed = JSON.parse(savedTemp);
        if (parsed.studentName && parsed.studentClass && parsed.sessionId) {
          setStudentName(parsed.studentName);
          setStudentClass(parsed.studentClass);
          setSessionId(parsed.sessionId);
          if (parsed.answers) setAnswers(parsed.answers);
        }
      }
    } catch (_) {}
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions');
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    }
  };

  const handleStartGame = (name: string, cls: string) => {
    const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setStudentName(name);
    setStudentClass(cls);
    setSessionId(newSessionId);
    setAnswers({});
    setResultData(null);
    setSubmissionError(null);

    // Persist temporary session for reload recovery
    try {
      sessionStorage.setItem(
        'formula_sheberi_temp_session',
        JSON.stringify({
          studentName: name,
          studentClass: cls,
          sessionId: newSessionId,
          answers: {},
        })
      );
    } catch (_) {}

    if (questions.length === 0) {
      fetchQuestions();
    }

    setCurrentView('game');
  };

  const handleSelectAnswer = (questionId: number, optionId: string) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: optionId };
      try {
        const savedTemp = sessionStorage.getItem('formula_sheberi_temp_session');
        if (savedTemp) {
          const parsed = JSON.parse(savedTemp);
          parsed.answers = updated;
          sessionStorage.setItem('formula_sheberi_temp_session', JSON.stringify(parsed));
        }
      } catch (_) {}
      return updated;
    });
    if (submissionError) setSubmissionError(null);
  };

  const handleSubmitGame = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const payload = {
        studentName,
        studentClass,
        answers,
        sessionId,
      };

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmissionError(data.error || 'Серверде жауаптарды тексеру сәтсіз аяқталды');
        setIsSubmitting(false);
        return;
      }

      setResultData(data);
      setCurrentView('result');

      // Clear temporary session since quiz is finished and recorded in server DB
      try {
        sessionStorage.removeItem('formula_sheberi_temp_session');
      } catch (_) {}
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmissionError(
        'Интернет байланысы үзілді немесе сервер жауап бермеді. Жауаптарыңыз сақталды. Қайта жіберіп көріңіз.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlayAgain = () => {
    const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setSessionId(newSessionId);
    setAnswers({});
    setResultData(null);
    setSubmissionError(null);
    setCurrentView('game');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      {/* Top Navigation */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'game' && !studentName) {
            setCurrentView('login');
          } else {
            setCurrentView(view);
          }
        }}
        onOpenTeacher={() => setIsTeacherOpen(true)}
        activeStudent={studentName && studentClass ? { name: studentName, studentClass } : null}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentView === 'login' && (
          <LoginScreen
            onStartGame={handleStartGame}
            onViewLeaderboard={() => setCurrentView('leaderboard')}
            initialName={studentName}
            initialClass={studentClass}
          />
        )}

        {currentView === 'game' && (
          <GameScreen
            questions={questions}
            studentName={studentName}
            studentClass={studentClass}
            answers={answers}
            onSelectAnswer={handleSelectAnswer}
            onSubmitGame={handleSubmitGame}
            isSubmitting={isSubmitting}
            submissionError={submissionError}
          />
        )}

        {currentView === 'result' && resultData && (
          <ResultScreen
            resultData={resultData}
            onPlayAgain={handlePlayAgain}
            onViewLeaderboard={() => setCurrentView('leaderboard')}
          />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardScreen
            key={leaderboardRefreshKey}
            onStartNewGame={() => {
              if (studentName && studentClass) {
                handlePlayAgain();
              } else {
                setCurrentView('login');
              }
            }}
            activeStudentClass={studentClass}
          />
        )}
      </main>

      {/* Educational Standard Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-800">«Формула шебері»</span>
            <span className="mx-2">·</span>
            <span>Информатика 8-сынып (8.2.2.1 оқу мақсаты)</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Электрондық кестелердің математикалық функциялары</span>
            <span aria-hidden="true">·</span>
            <span>2026 жыл</span>
          </div>
        </div>
      </footer>

      {/* Teacher Administration Modal */}
      <TeacherModal
        isOpen={isTeacherOpen}
        onClose={() => setIsTeacherOpen(false)}
        onResetSuccess={() => {
          setLeaderboardRefreshKey((prev) => prev + 1);
        }}
      />
    </div>
  );
}

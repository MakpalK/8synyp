import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  KeyRound,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetSuccess: () => void;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  onResetSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Мұғалім құпиясөзін енгізіңіз');
      return;
    }

    setIsVerifying(true);
    setError(null);
    try {
      const res = await fetch('/api/teacher/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherKey: password.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        setIsAuthenticated(true);
        setError(null);
      } else {
        setError('Құпиясөз қате! Мұғалім бөліміне кіруге рұқсат берілмеді.');
      }
    } catch (err) {
      setError('Сервермен байланыс орнату кезінде қате орын алды');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetDatabase = async () => {
    setIsResetting(true);
    setError(null);
    try {
      const res = await fetch('/api/teacher/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherKey: password.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage(data.message || 'Деректер сәтті тазаланды');
        setShowConfirmReset(false);
        onResetSuccess();
      } else {
        setError(data.message || 'Тазалау орындалмады');
      }
    } catch (err) {
      setError('Серверге сұрау жіберу кезінде қате орын алды');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Мұғалім бөлімі (Әкімші)</h2>
              <p className="text-[11px] text-slate-500">Нәтижелерді басқару және сараптау</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isAuthenticated ? (
            /* Login Form */
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Мұғалімге арналған нәтижелерді тазалау және әкімшілік баптауларға кіру үшін
                құпиясөзді енгізіңіз.
              </p>

              {error && (
                <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Мұғалім құпиясөзі:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Құпиясөзді енгізіңіз..."
                    autoFocus
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-slate-900"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Әдепкі құпиясөз: <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-mono">ustaz2026</code> (немесе TEACHER_KEY айнымалысында)
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Жабу
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Тексерілуде...</span>
                    </>
                  ) : (
                    <span>Кіру</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Authenticated Teacher Actions */
            <div className="space-y-5">
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Мұғалім рұқсаты расталды. Сіз басқару панеліндесіз.</span>
              </div>

              {actionMessage && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900">
                  {actionMessage}
                </div>
              )}

              {error && (
                <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              {/* Action Cards */}
              <div className="space-y-3">
                {/* Export CSV */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Нәтижелерді CSV жүктеу</div>
                    <div className="text-[11px] text-slate-500">
                      Excel немесе Google Sheets кестесіне арналған толық есеп
                    </div>
                  </div>
                  <a
                    href="/api/export-csv"
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Жүктеу</span>
                  </a>
                </div>

                {/* Reset / Clear Data */}
                <div className="p-4 rounded-xl border border-red-200 bg-red-50/50">
                  {!showConfirmReset ? (
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-red-900">Нәтижелерді тазалау</div>
                        <div className="text-[11px] text-red-700">
                          Жаңа тоқсан немесе жаңа сабақ бастау үшін кестені босату
                        </div>
                      </div>
                      <button
                        onClick={() => setShowConfirmReset(true)}
                        className="px-3.5 py-1.5 text-xs font-bold text-red-700 bg-white border border-red-300 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        <span>Кестені өшіру</span>
                      </button>
                    </div>
                  ) : (
                    /* Strict Confirmation Prompt */
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-xs text-red-900">
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">
                            Бұл әрекет барлық оқушының нәтижелерін қайтарымсыз өшіреді!
                          </span>
                          <p className="text-[11px] text-red-700 mt-1">
                            Тазалауды растайсыз ба?
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setShowConfirmReset(false)}
                          disabled={isResetting}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          Болдырмау
                        </button>
                        <button
                          type="button"
                          onClick={handleResetDatabase}
                          disabled={isResetting}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {isResetting ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Тазалануда...</span>
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Иә, тазалансын</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Шығу
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

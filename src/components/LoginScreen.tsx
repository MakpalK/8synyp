import React, { useState } from 'react';
import { Play, Sparkles, AlertCircle, Info, BookCheck } from 'lucide-react';

interface LoginScreenProps {
  onStartGame: (studentName: string, studentClass: string) => void;
  onViewLeaderboard: () => void;
  initialName?: string;
  initialClass?: string;
}

const COMMON_CLASSES = ['8А', '8Ә', '8Б', '8В', '8Г'];

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onStartGame,
  onViewLeaderboard,
  initialName = '',
  initialClass = '',
}) => {
  const [name, setName] = useState(initialName);
  const [studentClass, setStudentClass] = useState(initialClass);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanClass = studentClass.trim();

    if (!cleanName) {
      setError('Оқушының атын енгізіңіз');
      return;
    }
    if (cleanName.length < 2) {
      setError('Аты кемінде 2 әріптен тұруы керек');
      return;
    }
    if (!cleanClass) {
      setError('Сыныбыңызды көрсетіңіз (мысалы: 8А)');
      return;
    }

    setError(null);
    onStartGame(cleanName, cleanClass);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
      {/* Top Learning Objective Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-200 pb-3">
        <span>Информатика · 8-сынып</span>
        <span aria-hidden="true">·</span>
        <span>Оқу мақсаты: 8.2.2.1 Математикалық функциялар</span>
        <span aria-hidden="true">·</span>
        <span className="font-formula font-semibold text-purple-700">
          СУММ · ABS · КОРЕНЬ · СТЕПЕНЬ · СУММЕСЛИ
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Info */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              «Формула шебері» ойыны
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Электрондық кестелердің негізгі 5 математикалық функциясы бойынша біліміңізді сынап,
              сыныптастарыңызбен бірге ортақ рейтингке қатысыңыз!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Student Name */}
            <div>
              <label
                htmlFor="student-name"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider"
              >
                Оқушының аты-жөні <span className="text-purple-600">*</span>
              </label>
              <input
                id="student-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Мысалы: Айдос Нұрланұлы"
                maxLength={40}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all text-slate-900"
              />
              <p className="mt-1.5 text-[11px] text-slate-500">
                Кеңес: Егер сыныпта аттас оқушы болса, тегіңіздің алғашқы әрпін қосыңыз (мысалы:{' '}
                <span className="font-medium text-slate-700">Айдос Қ.</span>).
              </p>
            </div>

            {/* Student Class */}
            <div>
              <label
                htmlFor="student-class"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider"
              >
                Сыныбы <span className="text-purple-600">*</span>
              </label>

              {/* Quick Select Buttons */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {COMMON_CLASSES.map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => {
                      setStudentClass(cls);
                      if (error) setError(null);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                      studentClass === cls
                        ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>

              <input
                id="student-class"
                type="text"
                value={studentClass}
                onChange={(e) => {
                  setStudentClass(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Немесе қолмен енгізіңіз: 8А, 8Ә..."
                maxLength={10}
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all text-slate-900"
              />
            </div>

            {/* Notice about Shared Leaderboard */}
            <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3.5 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-purple-700 mt-0.5 shrink-0" />
              <div className="text-xs text-purple-950 leading-relaxed">
                <span className="font-semibold text-purple-900">Ескерту:</span> Атыңыз, сыныбыңыз
                және жинаған ұпайыңыз ойынның ортақ нәтижелер кестесінде көрінеді. Аккаунт тіркеу
                немесе Google логині талап етілмейді.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-5 text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Ойынды бастау (10 сұрақ)</span>
              </button>

              <button
                type="button"
                onClick={onViewLeaderboard}
                className="py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors whitespace-nowrap"
              >
                Ортақ нәтижелерді көру
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Hero Preview & Educational Rules */}
        <div className="lg:col-span-5 space-y-4">
          {/* Visual Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video shadow-xs">
            <img
              src="/src/assets/images/formula_master_hero_1794212103050.jpg"
              alt="Электрондық кестелердің математикалық формулалары"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex items-end p-4">
              <div className="text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                  Интерактивті тест-ойын
                </span>
                <p className="text-xs text-slate-200 font-medium mt-0.5">
                  10 сұрақ · 10 балл · Нақты уақыттағы тексеру
                </p>
              </div>
            </div>
          </div>

          {/* Quick Rules Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 space-y-3">
            <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <BookCheck className="w-4 h-4 text-purple-600" />
              <span>Ойын ережелері</span>
            </div>
            <ul className="space-y-2 list-disc list-inside text-slate-600 leading-relaxed">
              <li>Барлығы 10 сұрақ, әр дұрыс жауапқа 1 балл беріледі.</li>
              <li>Сұрақ нөмірлері арқылы қалаған сұраққа еркін ауысуға болады.</li>
              <li>Ойын аяқталғанға дейін өз жауаптарыңызды өзгерте аласыз.</li>
              <li>Барлық 10 сұраққа жауап бергенде ғана «Ойынды аяқтау» белсенді болады.</li>
              <li>Дұрыс жауаптар мен түсіндірмелер ойын соңында толық көрсетіледі.</li>
            </ul>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
              «Әділдік және жауапкершілік: өз жауабыңызды таңдаңыз»
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

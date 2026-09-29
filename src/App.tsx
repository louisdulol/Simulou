import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Target,
  Brain,
  BookX,
  Sun,
  Moon,
  Clock,
  CheckCircle2,
  XCircle,
  Flag,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  ExternalLink,
  AlertTriangle,
  HelpCircle,
  Check,
  Calculator,
  Compass,
  FileText,
  RotateCw,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Database,
  Loader2,
  AlertCircle
} from 'lucide-react';
import {
  sqliteService,
  Question,
  SimuladoRecord,
  SimuladoAnswer,
  FlashcardRecord
} from './db';

const LOGO_IMG = "data:image/jpeg;base64,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";

// ============================================================================
// HELPER: GUARANTEED STUDY LINKS
// ============================================================================
function getReliableStudyUrl(question: Question): string {
  const subject = question.subject || '';
  const topic = question.topic || '';
  const title = question.study_title || '';
  const searchQuery = `${subject} ${topic} ${title} resumo aula brasil escola toda materia`;
  return `https://www.google.com/search?q=${encodeURIComponent(searchQuery.trim())}`;
}

export type TabType = 'simulados' | 'flashcards' | 'errors';

// ============================================================================
// COMPONENT 1: NAVBAR
// ============================================================================
interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  wrongQuestionsCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  wrongQuestionsCount = 0
}) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const navItems = [
    {
      id: 'simulados' as TabType,
      label: 'Simulados',
      icon: Target
    },
    {
      id: 'flashcards' as TabType,
      label: 'Flashcards',
      icon: Brain
    },
    {
      id: 'errors' as TabType,
      label: 'Caderno de Erros',
      icon: BookX,
      badge: wrongQuestionsCount > 0 ? wrongQuestionsCount : null
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-b border-slate-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo "Simulou" (clean, minimal) */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => onSelectTab('simulados')}
          >
            <img src={LOGO_IMG} alt="Simulou" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
            <span className="font-extrabold text-2xl text-slate-900 dark:text-zinc-50 tracking-tight">
              Simulou
            </span>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                      : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-rose-500 text-white'
                          : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Dark Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Alternar tema escuro/claro"
              className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-100 dark:border-zinc-800/80 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-slate-600 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== null && item.badge !== undefined && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// COMPONENT 2: SIMULADO VIEW
// ============================================================================
interface SimuladoViewProps {
  onRefreshStats: () => void;
  onGoToErrors: () => void;
}

type ExamType = 'ete' | 'ifpe' | 'subject';

const SimuladoView: React.FC<SimuladoViewProps> = ({
  onRefreshStats,
  onGoToErrors
}) => {
  const [examState, setExamState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [examType, setExamType] = useState<ExamType>('ete');
  const [examTitle, setExamTitle] = useState('Simulado ETEPE');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(3600);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [showConfirmFinishModal, setShowConfirmFinishModal] = useState<boolean>(false);

  const [completedSimulado, setCompletedSimulado] = useState<SimuladoRecord | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'correct'>('all');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (examState === 'running') {
      interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [examState, questions, answers]);

  const startEteExam = () => {
    const qList = sqliteService.getSimuladoETEQuestions();
    if (qList.length === 0) {
      alert('Não foi possível carregar as questões do simulado.');
      return;
    }
    setExamType('ete');
    setExamTitle('Simulado Oficial ETEPE');
    setQuestions(qList);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged({});
    setTimeSpent(0);
    setTimeRemaining(3600);
    setCompletedSimulado(null);
    setExamState('running');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startIfpeExam = () => {
    const qList = sqliteService.getSimuladoIFPEQuestions();
    if (qList.length === 0) {
      alert('Não foi possível carregar as questões do simulado.');
      return;
    }
    setExamType('ifpe');
    setExamTitle('Simulado Oficial IFPE');
    setQuestions(qList);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged({});
    setTimeSpent(0);
    setTimeRemaining(10800);
    setCompletedSimulado(null);
    setExamState('running');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startSubjectExam = (subjectKey: 'matematica' | 'portugues' | 'gerais') => {
    let qList: Question[] = [];
    let title = '';

    if (subjectKey === 'matematica') {
      title = 'Treino Focado: Matemática (10 Questões)';
      qList = sqliteService.querySubjectQuestions('Matemática', 10);
    } else if (subjectKey === 'portugues') {
      title = 'Treino Focado: Língua Portuguesa (10 Questões)';
      qList = sqliteService.querySubjectQuestions('Língua Portuguesa', 10);
    } else if (subjectKey === 'gerais') {
      title = 'Treino Focado: Conhecimentos Gerais (10 Questões)';
      qList = sqliteService.queryGeneralKnowledgeQuestions(10);
    }

    if (qList.length === 0) {
      alert('Não foi possível carregar as questões para esta matéria.');
      return;
    }

    setExamType('subject');
    setExamTitle(title);
    setQuestions(qList);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged({});
    setTimeSpent(0);
    setTimeRemaining(1800);
    setCompletedSimulado(null);
    setExamState('running');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (optionIndex: number) => {
    if (examState !== 'running') return;
    const currentQ = questions[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  const handleClearAnswer = () => {
    if (examState !== 'running') return;
    const currentQ = questions[currentIndex];
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const toggleFlag = (questionId: number) => {
    setFlagged((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const finishExam = () => {
    setShowConfirmFinishModal(false);
    if (questions.length === 0) return;

    let correctCount = 0;
    const simAnswers: SimuladoAnswer[] = questions.map((q) => {
      const selected = answers[q.id] !== undefined ? answers[q.id] : null;
      const isCorrect = selected === q.correct_index;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        selectedIndex: selected,
        isCorrect,
        timeSpentSeconds: Math.round(timeSpent / questions.length),
        flagged: !!flagged[q.id]
      };
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const simuladoRecord: SimuladoRecord = {
      id: 'sim_' + Date.now(),
      title: examTitle,
      mode: examType === 'ete' ? 'custom' : examType === 'ifpe' ? 'full' : 'subject',
      total_questions: questions.length,
      correct_count: correctCount,
      score_percentage: scorePercentage,
      time_spent_seconds: timeSpent,
      created_at: new Date().toISOString(),
      answers: simAnswers
    };

    sqliteService.saveSimulado(simuladoRecord);
    setCompletedSimulado(simuladoRecord);
    setExamState('completed');
    onRefreshStats();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (scorePercentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }
    }
  };

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SCREEN 1: IDLE / SELECTION SCREEN
  if (examState === 'idle') {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Main Header Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 rounded-2xl p-6 sm:p-8 text-white shadow-md border border-slate-800 dark:border-zinc-800">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Prepare-se com Simulados Oficiais
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Plataforma didática com questões oficiais cronometradas, gabarito comentado passo a passo e caderno de erros.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ETEPE Card Action */}
              <div className="bg-slate-800/80 dark:bg-zinc-800/90 rounded-xl p-5 border border-slate-700 dark:border-zinc-700 flex flex-col justify-between hover:border-emerald-500 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      Vestibulinho ETEPE
                    </span>
                    <span className="text-xs text-slate-400 font-mono">1 Hora</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                    Simulado ETEPE
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    20 questões oficiais: <strong>10 de Língua Portuguesa</strong> e{' '}
                    <strong>10 de Matemática</strong>.
                  </p>
                </div>
                <button
                  onClick={startEteExam}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm"
                >
                  <span>Iniciar Simulado ETEPE (20 Q)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* IFPE Card Action */}
              <div className="bg-slate-800/80 dark:bg-zinc-800/90 rounded-xl p-5 border border-slate-700 dark:border-zinc-700 flex flex-col justify-between hover:border-sky-500 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                      Vestibular IFPE
                    </span>
                    <span className="text-xs text-slate-400 font-mono">3 Horas</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                    Simulado IFPE
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    30 questões oficiais: <strong>10 Português</strong>,{' '}
                    <strong>10 Matemática</strong> e{' '}
                    <strong>10 Conhecimentos Gerais</strong> (Ciências, Geografia e História).
                  </p>
                </div>
                <button
                  onClick={startIfpeExam}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm"
                >
                  <span>Iniciar Simulado IFPE (30 Q)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCO PARA TREINAR APENAS UMA MATÉRIA */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Treinar Apenas uma Matéria
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Faça um mini-simulado focado de 10 questões cronometradas (30 min) para reforçar seus pontos fracos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Treino Matemática */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-zinc-800/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-3">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100 mb-1">
                  Matemática
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
                  10 questões: Álgebra, Geometria, Teorema de Tales e Pitágoras, Funções e Porcentagem.
                </p>
              </div>
              <button
                onClick={() => startSubjectExam('matematica')}
                className="w-full py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold transition-colors"
              >
                Treinar Matemática (10 Q)
              </button>
            </div>

            {/* Treino Português */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-zinc-800/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100 mb-1">
                  Língua Portuguesa
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
                  10 questões: Interpretação textual, Crase, Concordância, Figuras de Linguagem e Sintaxe.
                </p>
              </div>
              <button
                onClick={() => startSubjectExam('portugues')}
                className="w-full py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold transition-colors"
              >
                Treinar Português (10 Q)
              </button>
            </div>

            {/* Treino Conhecimentos Gerais */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-zinc-800/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-3">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100 mb-1">
                  Conhecimentos Gerais
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
                  10 questões sorteadas: História de Pernambuco e Brasil, Geografia e Ciências.
                </p>
              </div>
              <button
                onClick={() => startSubjectExam('gerais')}
                className="w-full py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold transition-colors"
              >
                Treinar Gerais (10 Q)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 2: ACTIVE RUNNING EXAM (Fixed Contrast & Layout)
  if (examState === 'running') {
    const currentQ = questions[currentIndex];
    const answeredCount = Object.keys(answers).length;
    const selectedOption = answers[currentQ.id];
    const isCurrentFlagged = !!flagged[currentQ.id];
    const isLowTime = timeRemaining <= 300;

    return (
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Top Control Bar */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 hidden sm:inline-block">
              {examTitle}
            </span>
            <div className="text-xs text-slate-600 dark:text-zinc-400">
              <span className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                Questão {currentIndex + 1} de {questions.length}
              </span>
              <span className="mx-1.5">•</span>
              <span>{answeredCount} respondidas</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm font-bold border transition-colors ${
                isLowTime
                  ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'
              }`}
            >
              <Clock className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
              <span>{formatTimer(timeRemaining)}</span>
            </div>

            <button
              onClick={() => setShowConfirmFinishModal(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
            >
              Entregar Prova
            </button>
          </div>
        </div>

        {/* Main Question Official Sheet */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 font-serif">
              QUESTÃO {currentIndex + 1}
            </h2>

            <button
              onClick={() => toggleFlag(currentQ.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isCurrentFlagged
                  ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : 'bg-slate-50 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-amber-500 text-amber-600' : ''}`} />
              <span>{isCurrentFlagged ? 'Marcada para Revisão' : 'Marcar para Revisão'}</span>
            </button>
          </div>

          {currentQ.context_text && (
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-serif whitespace-pre-line italic">
              {currentQ.context_text}
            </div>
          )}

          <div className="text-slate-900 dark:text-zinc-100 text-sm sm:base leading-relaxed font-normal">
            {currentQ.statement}
          </div>

          {/* Alternatives A, B, C, D, E with rich dark gray background */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx);
              const isSelected = selectedOption === optIdx;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border flex items-start gap-3.5 transition-all text-xs sm:text-sm ${
                    isSelected
                      ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 shadow-sm ring-2 ring-emerald-500/40'
                      : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] hover:bg-slate-50 dark:hover:bg-[#202024] text-slate-900 dark:text-zinc-100'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-600 dark:border-emerald-500'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border-slate-300 dark:border-zinc-700'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="leading-relaxed pt-0.5 font-normal">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-zinc-800 gap-3">
            <button
              onClick={() => {
                setCurrentIndex((prev) => Math.max(0, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {selectedOption !== undefined && (
              <button
                onClick={handleClearAnswer}
                className="text-xs text-slate-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              >
                Limpar resposta
              </button>
            )}

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => {
                  setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold transition-colors shadow-sm"
              >
                <span>Próxima</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmFinishModal(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <span>Revisar e Entregar</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Question Grid Bar */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span className="font-semibold text-slate-700 dark:text-zinc-300">Grade Geral de Questões</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-zinc-100 inline-block"></span> Respondida
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Revisão
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-zinc-600 inline-block"></span> Em branco
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isFlag = !!flagged[q.id];
              const isCurrent = idx === currentIndex;

              let btnClass = 'bg-slate-50 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700';
              if (isAnswered) {
                btnClass = 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-slate-900 dark:border-zinc-100';
              }
              if (isFlag) {
                btnClass = 'bg-amber-500 text-white border-amber-600 font-bold';
              }
              if (isCurrent) {
                btnClass += ' ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-zinc-900 font-bold';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-8 h-8 rounded-lg text-xs font-medium border flex items-center justify-center transition-all ${btnClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal: Confirm Delivery */}
        {showConfirmFinishModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-zinc-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-base">
                    Deseja entregar a prova agora?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    A correção oficial será calculada e as resoluções comentadas serão liberadas.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-zinc-400">Total de questões:</span>
                  <span className="font-bold text-slate-900 dark:text-zinc-100">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-zinc-400">Questões respondidas:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{answeredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-zinc-400">Questões em branco:</span>
                  <span className={`font-bold ${questions.length - answeredCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'}`}>
                    {questions.length - answeredCount}
                  </span>
                </div>
              </div>

              {questions.length - answeredCount > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Atenção: Você ainda possui questões não respondidas.
                </p>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setShowConfirmFinishModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  Continuar Respondendo
                </button>
                <button
                  onClick={finishExam}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm"
                >
                  Confirmar Entrega
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // SCREEN 3: COMPLETED RESULTS & RESOLUTION SCREEN
  if (examState === 'completed' && completedSimulado) {
    const totalQ = completedSimulado.total_questions;
    const correctQ = completedSimulado.correct_count;
    const scorePct = completedSimulado.score_percentage;

    const displayedQuestions = questions.filter((q) => {
      const ans = completedSimulado.answers.find((a) => a.questionId === q.id);
      if (reviewFilter === 'wrong') {
        return !ans || !ans.isCorrect;
      }
      if (reviewFilter === 'correct') {
        return ans && ans.isCorrect;
      }
      return true;
    });

    const wrongTotal = totalQ - correctQ;

    const subjectBreakdown: Record<string, { total: number; correct: number }> = {};
    questions.forEach((q) => {
      if (!subjectBreakdown[q.subject]) {
        subjectBreakdown[q.subject] = { total: 0, correct: 0 };
      }
      subjectBreakdown[q.subject].total += 1;
      const ans = completedSimulado.answers.find((a) => a.questionId === q.id);
      if (ans && ans.isCorrect) {
        subjectBreakdown[q.subject].correct += 1;
      }
    });

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Header Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-6">
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Resultado Oficial
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-50 mt-1">
                {completedSimulado.title}
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Finalizado em {new Date(completedSimulado.created_at).toLocaleDateString('pt-BR')} às{' '}
                {new Date(completedSimulado.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • Tempo gasto: {formatTimer(completedSimulado.time_spent_seconds)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setExamState('idle')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Novo Simulado</span>
              </button>
              {wrongTotal > 0 && (
                <button
                  onClick={onGoToErrors}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Ver Caderno de Erros ({wrongTotal})</span>
                </button>
              )}
            </div>
          </div>

          {/* Key Metric Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 text-center">
              <span className="text-xs text-slate-500 dark:text-zinc-400 block mb-1">Acertos</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {correctQ} <span className="text-xs text-slate-400 font-normal">/ {totalQ}</span>
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 text-center">
              <span className="text-xs text-slate-500 dark:text-zinc-400 block mb-1">Aproveitamento</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50">
                {scorePct}%
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 text-center">
              <span className="text-xs text-slate-500 dark:text-zinc-400 block mb-1">Erros</span>
              <span className="text-2xl font-extrabold text-rose-500">
                {wrongTotal}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 text-center">
              <span className="text-xs text-slate-500 dark:text-zinc-400 block mb-1">Tempo Médio/Q</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-zinc-200 font-mono">
                {Math.round(completedSimulado.time_spent_seconds / totalQ)}s
              </span>
            </div>
          </div>

          {/* Breakdown by subject */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Desempenho por Disciplina
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(subjectBreakdown).map(([subj, stats]) => {
                const pct = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div
                    key={subj}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 block">
                        {subj}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                        {stats.correct} de {stats.total} acertos
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        pct >= 70
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter Bar for Question Review */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReviewFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                reviewFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800'
              }`}
            >
              Todas ({totalQ})
            </button>
            <button
              onClick={() => setReviewFilter('wrong')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                reviewFilter === 'wrong'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-zinc-800'
              }`}
            >
              Erros ({wrongTotal})
            </button>
            <button
              onClick={() => setReviewFilter('correct')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                reviewFilter === 'correct'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-zinc-800'
              }`}
            >
              Acertos ({correctQ})
            </button>
          </div>

          <span className="text-xs text-slate-500 dark:text-zinc-400">
            Exibindo {displayedQuestions.length} questões
          </span>
        </div>

        {/* List of Questions with Detailed Didactic Explanations */}
        <div className="space-y-4">
          {displayedQuestions.map((q) => {
            const ans = completedSimulado.answers.find((a) => a.questionId === q.id);
            const isCorrect = ans?.isCorrect ?? false;
            const originalIndex = questions.findIndex((item) => item.id === q.id);

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                      Questão {originalIndex + 1}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium">
                      {q.subject}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400">
                      {q.topic}
                    </span>
                  </div>

                  <div>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Acertou
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900">
                        <XCircle className="w-3.5 h-3.5" />
                        Errou
                      </span>
                    )}
                  </div>
                </div>

                {q.context_text && (
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-zinc-800/40 text-xs text-slate-700 dark:text-zinc-300 italic font-serif leading-relaxed">
                    {q.context_text}
                  </div>
                )}

                <div className="text-xs sm:text-sm text-slate-900 dark:text-zinc-100 leading-relaxed font-medium">
                  {q.statement}
                </div>

                {/* Question alternatives with correct/incorrect highlighting */}
                <div className="space-y-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isOfficialCorrect = optIdx === q.correct_index;
                    const isUserChoice = ans?.selectedIndex === optIdx;

                    let optClass = 'bg-slate-50 dark:bg-[#18181b] border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300';

                    if (isOfficialCorrect) {
                      optClass = 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500/30';
                    } else if (isUserChoice && !isCorrect) {
                      optClass = 'bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-lg border text-xs flex items-start justify-between gap-3 ${optClass}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="font-bold shrink-0">({letter})</span>
                          <span className="leading-relaxed">{opt}</span>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5 text-[11px] font-semibold">
                          {isOfficialCorrect && (
                            <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Gabarito Correto
                            </span>
                          )}
                          {isUserChoice && !isOfficialCorrect && (
                            <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Sua Resposta
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Didactic Step-by-Step Resolution */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Resolução e Explicação Didática
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                      {q.explanation}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-xs text-slate-600 dark:text-zinc-300">
                      <span className="font-semibold">Conteúdo didático:</span>{' '}
                      <span>{q.study_title || q.topic}</span>
                    </div>
                    <a
                      href={getReliableStudyUrl(q)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shrink-0 shadow-xs"
                    >
                      <span>Estudar Este Assunto</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

// ============================================================================
// COMPONENT 3: FLASHCARDS VIEW
// ============================================================================
const FlashcardsView: React.FC = () => {
  const [cards, setCards] = useState<FlashcardRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('Todas');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newSubject, setNewSubject] = useState('Matemática');
  const [newTopic, setNewTopic] = useState('');
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = () => {
    const list = sqliteService.getFlashcards();
    setCards(list);
  };

  const filteredCards = cards.filter((c) => {
    if (selectedSubject !== 'Todas' && c.subject !== selectedSubject) return false;
    return true;
  });

  const currentCard = filteredCards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredCards.length - 1);
    }
  };

  const handleRating = (rating: 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;
    sqliteService.reviewFlashcard(currentCard.id, rating);
    handleNext();
  };

  const handleDeleteCard = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm('Deseja excluir este flashcard?')) {
      sqliteService.deleteFlashcard(id);
      loadCards();
      if (currentIndex >= filteredCards.length - 1) {
        setCurrentIndex(Math.max(0, filteredCards.length - 2));
      }
      setIsFlipped(false);
    }
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    sqliteService.createFlashcard({
      subject: newSubject,
      topic: newTopic.trim() || 'Geral',
      front: newFront.trim(),
      back: newBack.trim()
    });

    setNewTopic('');
    setNewFront('');
    setNewBack('');
    setShowAddModal(false);
    loadCards();
  };

  const subjects = ['Todas', 'Matemática', 'Língua Portuguesa', 'Ciências', 'História', 'Geografia'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 mb-2">
            <Brain className="w-3.5 h-3.5" />
            Memorização Ativa
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            Flashcards de Fórmulas e Regras
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Memorize fórmulas e regras frequentes para vestibulares de escolas técnicas.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shrink-0 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Flashcard</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {subjects.map((subj) => (
          <button
            key={subj}
            onClick={() => {
              setSelectedSubject(subj);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSubject === subj
                ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {filteredCards.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 border border-slate-200 dark:border-zinc-800 text-center space-y-4">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
            Nenhum flashcard encontrado para esta matéria
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
          >
            Criar Primeiro Flashcard
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span>
              Cartão <strong>{currentIndex + 1}</strong> de <strong>{filteredCards.length}</strong>
            </span>
            <span>Clique no cartão para ver a resposta</span>
          </div>

          <div
            onClick={() => setIsFlipped((prev) => !prev)}
            className={`cursor-pointer min-h-64 sm:min-h-72 p-8 rounded-2xl border transition-all duration-200 flex flex-col justify-between select-none shadow-sm ${
              isFlipped
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-500/20'
                : 'bg-white dark:bg-[#18181b] border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium">
                  {currentCard.subject}
                </span>
                <span className="text-xs text-slate-500 dark:text-zinc-400">
                  {currentCard.topic}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {isFlipped ? 'Resposta' : 'Pergunta / Conceito'}
                </span>
                <button
                  onClick={(e) => handleDeleteCard(e, currentCard.id)}
                  title="Excluir card"
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="my-auto py-6 text-center">
              <p
                className={`leading-relaxed text-base sm:text-lg font-medium ${
                  isFlipped
                    ? 'text-emerald-950 dark:text-emerald-100'
                    : 'text-slate-900 dark:text-zinc-100 font-serif'
                }`}
              >
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'Clique para ver a pergunta' : 'Clique para virar e conferir a resposta'}</span>
            </div>
          </div>

          {isFlipped ? (
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                Como você se sentiu com esta resposta?
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleRating('hard')}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-800 transition-colors"
                >
                  Difícil
                </button>
                <button
                  onClick={() => handleRating('good')}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-800 transition-colors"
                >
                  Bom
                </button>
                <button
                  onClick={() => handleRating('easy')}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  Fácil
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold transition-colors shadow-sm"
              >
                <span>Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                Criar Novo Flashcard
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Disciplina
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-medium"
                >
                  <option value="Matemática">Matemática</option>
                  <option value="Língua Portuguesa">Língua Portuguesa</option>
                  <option value="Ciências">Ciências</option>
                  <option value="História">História</option>
                  <option value="Geografia">Geografia</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Tópico / Conteúdo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Geometria Plana, Crase, Revolução de 1817..."
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Frente do Cartão (Pergunta / Conceito)
                </label>
                <textarea
                  rows={3}
                  placeholder="O que você quer lembrar?"
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Verso do Cartão (Resposta / Fórmula / Explicação)
                </label>
                <textarea
                  rows={3}
                  placeholder="A resposta exata ou fórmula para memorizar."
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm"
                >
                  Salvar Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENT 4: CADERNO DE ERROS VIEW
// ============================================================================
interface CadernoDeErrosViewProps {
  onStartSimulado: () => void;
}

const CadernoDeErrosView: React.FC<CadernoDeErrosViewProps> = ({ onStartSimulado }) => {
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('Todas');
  const [retryAnswers, setRetryAnswers] = useState<Record<number, number>>({});
  const [showRetryResult, setShowRetryResult] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadErrors();
  }, []);

  const loadErrors = () => {
    const list = sqliteService.getWrongQuestions();
    setWrongQuestions(list);
  };

  const subjects = ['Todas', ...Array.from(new Set(wrongQuestions.map((q) => q.subject)))];

  const filtered = wrongQuestions.filter((q) => {
    if (selectedSubject !== 'Todas' && q.subject !== selectedSubject) return false;
    return true;
  });

  const handleSelectRetryOption = (questionId: number, optionIndex: number) => {
    setRetryAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
    setShowRetryResult((prev) => ({
      ...prev,
      [questionId]: true
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 mb-2">
            <BookX className="w-3.5 h-3.5" />
            Caderno de Erros Pessoais
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            Revisão e Aprendizado dos Seus Erros
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Aqui ficam reunidas as questões que você errou nos simulados realizados, com explicações didáticas e links diretos para você dominar o assunto.
          </p>
        </div>

        <button
          onClick={onStartSimulado}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shrink-0 transition-colors shadow-sm"
        >
          <span>Fazer Novo Simulado</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {wrongQuestions.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 border border-slate-200 dark:border-zinc-800 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
            Nenhum erro registrado até o momento!
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
            Assim que você concluir um Simulado e tiver algum erro, as questões aparecerão aqui com explicações detalhadas passo a passo e materiais de apoio.
          </p>
          <button
            onClick={onStartSimulado}
            className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold transition-colors"
          >
            Iniciar Meu Primeiro Simulado
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSubject === subj
                    ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((q, idx) => {
              const retryChoice = retryAnswers[q.id];
              const isRetried = showRetryResult[q.id];
              const isRetryCorrect = retryChoice === q.correct_index;

              return (
                <div
                  key={q.id}
                  className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                        Item #{idx + 1}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                        {q.subject}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400">
                        {q.topic}
                      </span>
                    </div>
                  </div>

                  {q.context_text && (
                    <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-zinc-800/40 text-xs text-slate-700 dark:text-zinc-300 italic font-serif leading-relaxed">
                      {q.context_text}
                    </div>
                  )}

                  <div className="text-xs sm:text-sm text-slate-900 dark:text-zinc-100 leading-relaxed font-medium">
                    {q.statement}
                  </div>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isCorrect = optIdx === q.correct_index;
                      const isSelected = retryChoice === optIdx;

                      let style = 'bg-slate-50 dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#222227] border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200';
                      if (isRetried) {
                        if (isCorrect) {
                          style = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-semibold';
                        } else if (isSelected) {
                          style = 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 line-through';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectRetryOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-lg border text-xs flex items-start gap-2.5 transition-colors ${style}`}
                        >
                          <span className="font-bold shrink-0">({letter})</span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isRetried && (
                    <div className="pt-1">
                      {isRetryCorrect ? (
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Excelente! Você acertou a questão na nova tentativa.
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                          <XCircle className="w-4 h-4" />
                          Ainda não foi dessa vez. Veja a explicação detalhada e a aula recomendada abaixo:
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Resolução e Explicação Detalhada
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                        {q.explanation}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="text-xs text-slate-600 dark:text-zinc-300">
                        <span className="font-semibold">Conteúdo didático:</span>{' '}
                        <span>{q.study_title || q.topic}</span>
                      </div>
                      <a
                        href={getReliableStudyUrl(q)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shrink-0 shadow-xs"
                      >
                        <span>Estudar Este Assunto</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('simulados');
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [wrongQuestionsCount, setWrongQuestionsCount] = useState(0);

  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = async () => {
    try {
      await sqliteService.init();
      const stats = sqliteService.getPerformanceStats();
      setWrongQuestionsCount(stats.wrongQuestionIds.length);
      setIsDbReady(true);
    } catch (err: any) {
      console.error('Failed to initialize database:', err);
      setDbError('Não foi possível inicializar o banco de dados. Recarregue a página.');
    }
  };

  const handleRefreshStats = () => {
    if (!isDbReady) return;
    const stats = sqliteService.getPerformanceStats();
    setWrongQuestionsCount(stats.wrongQuestionIds.length);
  };

  if (dbError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-rose-200 dark:border-rose-900 shadow-md max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Erro de Inicialização</h2>
          <p className="text-xs text-slate-600 dark:text-zinc-400">{dbError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!isDbReady) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 animate-pulse">
          <Database className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-50">Carregando Simulou...</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Sincronizando banco de questões SQLite
          </p>
        </div>
        <Loader2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col transition-colors duration-150">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        wrongQuestionsCount={wrongQuestionsCount}
      />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'simulados' && (
          <SimuladoView
            onRefreshStats={handleRefreshStats}
            onGoToErrors={() => setCurrentTab('errors')}
          />
        )}

        {currentTab === 'flashcards' && <FlashcardsView />}

        {currentTab === 'errors' && (
          <CadernoDeErrosView onStartSimulado={() => setCurrentTab('simulados')} />
        )}
      </main>

      {/* Clean Academic Footer with Graffiti Tag at bottom */}
      <footer className="border-t border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-zinc-400">
          <div>
            <strong>Simulou</strong>
          </div>
          <div className="flex items-center gap-3">
            <span>Simulados</span>
            <span>•</span>
            <span>Flashcards</span>
            <span>•</span>
            <span>Treino por Matéria</span>
            <span>•</span>
            <span>Gabarito Comentado</span>
          </div>
        </div>

        {/* Bottom Graffiti Tag: "Feito por lou." */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/50 text-center">
          <>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Rubik+Spray+Paint&family=Sedgwick+Ave+Display&display=swap');`}</style>
            <span
              className="inline-block select-none hover:scale-110 transition-transform cursor-default text-emerald-400"
              style={{
                fontFamily: "'Rubik Spray Paint', 'Sedgwick Ave Display', 'Permanent Marker', cursive",
                fontSize: '2rem',
                letterSpacing: '0.08em',
                transform: 'rotate(-4deg)',
                WebkitTextStroke: '1.5px #022c22',
                paintOrder: 'stroke fill',
                textShadow: '3px 3px 0 #022c22, 5px 5px 0 rgba(16,185,129,0.35), 0 0 12px rgba(52,211,153,0.5)',
              }}
            >
              Feito por LOU
            </span>
          </>
        </div>
      </footer>
    </div>
  );
}

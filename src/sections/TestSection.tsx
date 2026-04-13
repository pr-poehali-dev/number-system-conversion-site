import { useState } from 'react';
import Icon from '@/components/ui/icon';

const TOTAL_QUESTIONS = 10;

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyConfig {
  label: string;
  desc: string;
  emoji: string;
  color: string;
  pairs: [number, number][];
  maxVal: (fromBase: number) => number;
  deltaRange: number;
}

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: 'Лёгкий',
    desc: 'Только двоичная ↔ десятичная, числа до 15',
    emoji: '🟢',
    color: 'var(--neon-green)',
    pairs: [[10, 2], [2, 10]],
    maxVal: () => 15,
    deltaRange: 3,
  },
  medium: {
    label: 'Средний',
    desc: 'Все четыре системы, числа до 63',
    emoji: '🟡',
    color: '#ff9f00',
    pairs: [[10, 2], [2, 10], [10, 8], [8, 10], [10, 16], [16, 10]],
    maxVal: () => 63,
    deltaRange: 6,
  },
  hard: {
    label: 'Сложный',
    desc: 'Прямые переводы между всеми системами, числа до 255',
    emoji: '🔴',
    color: 'rgba(255,60,60,0.9)',
    pairs: [[10, 2], [2, 10], [10, 16], [16, 10], [2, 16], [16, 2], [8, 10], [10, 8], [8, 16], [16, 8], [2, 8], [8, 2]],
    maxVal: (fromBase) => fromBase === 2 ? 255 : fromBase === 8 ? 255 : 255,
    deltaRange: 12,
  },
};

interface TestQuestion {
  fromBase: number;
  toBase: number;
  value: string;
  correct: string;
  options: string[];
  decimalVal: number;
}

interface UserAnswer {
  chosen: string;
  correct: string;
  question: TestQuestion;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateQuestion(used: Set<string>, difficulty: Difficulty): TestQuestion {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  let fromBase: number, toBase: number, num: number, value: string, correct: string, key: string;
  let attempts = 0;
  do {
    [fromBase, toBase] = cfg.pairs[Math.floor(Math.random() * cfg.pairs.length)];
    const maxVal = cfg.maxVal(fromBase);
    num = Math.floor(Math.random() * (maxVal - 2)) + 2;
    value = num.toString(fromBase).toUpperCase();
    correct = num.toString(toBase).toUpperCase();
    key = `${fromBase}-${toBase}-${value}`;
    attempts++;
  } while (used.has(key) && attempts < 50);
  used.add(key);

  const wrongSet = new Set<string>([correct]);
  const wrongs: string[] = [];
  let tries = 0;
  while (wrongs.length < 3 && tries < 120) {
    tries++;
    const delta = Math.floor(Math.random() * cfg.deltaRange * 2) - cfg.deltaRange;
    const candidate = num + delta;
    if (candidate < 1) continue;
    const w = candidate.toString(toBase).toUpperCase();
    if (!wrongSet.has(w)) { wrongSet.add(w); wrongs.push(w); }
  }
  while (wrongs.length < 3) {
    const w = (num + wrongs.length + 1).toString(toBase).toUpperCase();
    if (!wrongSet.has(w)) { wrongSet.add(w); wrongs.push(w); }
  }

  return { fromBase, toBase, value, correct, options: shuffle([correct, ...wrongs]), decimalVal: num };
}

function buildQuestions(difficulty: Difficulty): TestQuestion[] {
  const used = new Set<string>();
  return Array.from({ length: TOTAL_QUESTIONS }, () => generateQuestion(used, difficulty));
}

const BASE_LABEL: Record<number, string> = { 2: 'двоичную', 8: 'восьмеричную', 10: 'десятичную', 16: 'шестнадцатеричную' };
const BASE_TAG: Record<number, string> = { 2: '₂', 8: '₈', 10: '₁₀', 16: '₁₆' };
const BASE_COLOR: Record<number, string> = { 2: 'var(--neon-blue)', 8: 'var(--neon-purple)', 10: '#ff9f00', 16: 'var(--neon-green)' };

function getGrade(correct: number): { label: string; color: string; emoji: string } {
  const pct = (correct / TOTAL_QUESTIONS) * 100;
  if (pct === 100) return { label: 'Отлично!', color: 'var(--neon-green)', emoji: '🏆' };
  if (pct >= 80) return { label: 'Хорошо', color: 'var(--neon-blue)', emoji: '⭐' };
  if (pct >= 60) return { label: 'Неплохо', color: '#ff9f00', emoji: '📚' };
  return { label: 'Нужно повторить', color: 'rgba(255,60,60,0.9)', emoji: '💡' };
}

export default function TestSection() {
  const [phase, setPhase] = useState<'start' | 'quiz' | 'result'>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);

  const startTest = (diff: Difficulty = difficulty) => {
    setQuestions(buildQuestions(diff));
    setCurrent(0);
    setChosen(null);
    setConfirmed(false);
    setAnswers([]);
    setPhase('quiz');
  };

  const confirmAnswer = () => {
    if (!chosen) return;
    const q = questions[current];
    const newAnswers = [...answers, { chosen, correct: q.correct, question: q }];
    setAnswers(newAnswers);
    setConfirmed(true);
  };

  const next = () => {
    if (current + 1 >= TOTAL_QUESTIONS) {
      setPhase('result');
    } else {
      setCurrent(c => c + 1);
      setChosen(null);
      setConfirmed(false);
    }
  };

  // ---- START SCREEN ----
  if (phase === 'start') {
    const cfg = DIFFICULTY_CONFIG[difficulty];
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 animate-float"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(57,255,122,0.1))', border: '1px solid rgba(0,212,255,0.3)' }}>
          <Icon name="ClipboardList" size={36} style={{ color: 'var(--neon-blue)' }} />
        </div>
        <h2 className="font-oswald text-5xl font-bold mb-3"><span className="neon-text-blue">ТЕСТ</span></h2>
        <p className="text-muted-foreground text-lg mb-8">Перевод систем счисления</p>

        {/* Difficulty picker */}
        <div className="w-full mb-8">
          <div className="text-xs text-muted-foreground font-oswald tracking-widest mb-3">ВЫБЕРИ СЛОЖНОСТЬ</div>
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, DifficultyConfig][]).map(([key, d]) => {
              const isActive = difficulty === key;
              return (
                <button
                  key={key}
                  onClick={() => setDifficulty(key)}
                  className="rounded-2xl p-4 text-center transition-all duration-200 hover:scale-[1.03]"
                  style={{
                    border: `2px solid ${isActive ? d.color : 'rgba(255,255,255,0.08)'}`,
                    background: isActive ? `${d.color}12` : 'transparent',
                  }}
                >
                  <div className="text-2xl mb-2">{d.emoji}</div>
                  <div className="font-oswald font-bold text-base mb-1" style={{ color: isActive ? d.color : 'var(--foreground)' }}>{d.label}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{d.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active difficulty hint */}
        <div className="glass rounded-xl px-5 py-3 mb-8 text-sm text-muted-foreground w-full text-left flex items-center gap-2">
          <span className="text-lg">{cfg.emoji}</span>
          <span><span style={{ color: cfg.color }} className="font-semibold">{cfg.label}:</span> {cfg.desc}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full mb-8">
          {[['10', 'вопросов'], ['4', 'варианта'], ['≈5', 'минут']].map(([v, l]) => (
            <div key={l} className="glass rounded-xl py-4">
              <div className="font-oswald text-3xl font-bold neon-text-blue">{v}</div>
              <div className="text-xs text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>

        <button onClick={() => startTest(difficulty)} className="neon-btn px-12 py-4 rounded-2xl font-oswald text-xl tracking-wide w-full">
          Начать тест
        </button>
      </div>
    );
  }

  // ---- RESULT SCREEN ----
  if (phase === 'result') {
    const correctCount = answers.filter(a => a.chosen === a.correct).length;
    const grade = getGrade(correctCount);
    const pct = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    const dcfg = DIFFICULTY_CONFIG[difficulty];

    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: `${dcfg.color}18`, color: dcfg.color, border: `1px solid ${dcfg.color}40` }}>
            {dcfg.emoji} {dcfg.label}
          </div>
          <div className="text-5xl mb-4">{grade.emoji}</div>
          <h2 className="font-oswald text-4xl font-bold mb-2" style={{ color: grade.color }}>{grade.label}</h2>
          <div className="font-oswald text-6xl font-bold mb-1" style={{ color: grade.color }}>{correctCount}<span className="text-muted-foreground text-3xl">/{TOTAL_QUESTIONS}</span></div>
          <div className="text-muted-foreground mb-6">{pct}% правильных ответов</div>

          {/* Progress bar */}
          <div className="w-full h-3 rounded-full bg-secondary overflow-hidden mb-8">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: `linear-gradient(90deg, var(--neon-blue), ${grade.color})` }} />
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => startTest(difficulty)} className="neon-btn px-8 py-3 rounded-xl font-oswald text-lg tracking-wide">
              Ещё раз
            </button>
            <button onClick={() => setPhase('start')} className="glass px-8 py-3 rounded-xl font-oswald text-lg tracking-wide text-muted-foreground hover:text-foreground transition-colors">
              Сменить уровень
            </button>
          </div>
        </div>

        {/* Breakdown */}
        <h3 className="font-oswald text-xl font-bold mb-4 text-foreground">Разбор ответов:</h3>
        <div className="space-y-3">
          {answers.map((a, i) => {
            const isOk = a.chosen === a.correct;
            const q = a.question;
            return (
              <div key={i} className="rounded-xl p-4 flex items-start gap-3"
                style={{ background: isOk ? 'rgba(57,255,122,0.06)' : 'rgba(255,60,60,0.06)', border: `1px solid ${isOk ? 'rgba(57,255,122,0.25)' : 'rgba(255,60,60,0.25)'}` }}>
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: isOk ? 'rgba(57,255,122,0.2)' : 'rgba(255,60,60,0.2)', color: isOk ? 'var(--neon-green)' : 'rgba(255,60,60,0.9)' }}>
                  {isOk ? '✓' : '✗'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground font-medium mb-1">
                    <span style={{ color: BASE_COLOR[q.fromBase] }} className="font-oswald font-bold">{q.value}{BASE_TAG[q.fromBase]}</span>
                    <span className="text-muted-foreground mx-1.5">→</span>
                    <span className="text-muted-foreground">{BASE_LABEL[q.toBase]}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Твой ответ: <span className="font-oswald font-bold" style={{ color: isOk ? 'var(--neon-green)' : 'rgba(255,60,60,0.9)' }}>{a.chosen}{BASE_TAG[q.toBase]}</span>
                    {!isOk && <> · Верный: <span className="font-oswald font-bold neon-text-green">{a.correct}{BASE_TAG[q.toBase]}</span></>}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground/50 flex-shrink-0">#{i + 1}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---- QUIZ SCREEN ----
  const q = questions[current];
  const progress = ((current) / TOTAL_QUESTIONS) * 100;
  const dcfg = DIFFICULTY_CONFIG[difficulty];

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-oswald text-sm text-muted-foreground tracking-widest">ВОПРОС {current + 1} / {TOTAL_QUESTIONS}</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${dcfg.color}18`, color: dcfg.color }}>{dcfg.emoji} {dcfg.label}</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
            <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i < answers.length
                  ? (answers[i].chosen === answers[i].correct ? 'var(--neon-green)' : 'rgba(255,60,60,0.7)')
                  : i === current ? 'var(--neon-blue)' : 'rgba(255,255,255,0.1)'
              }} />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden mb-8">
        <div className="h-full rounded-full transition-all duration-500 animate-pulse-glow" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-green))' }} />
      </div>

      {/* Question card */}
      <div className="neon-border rounded-2xl p-6 mb-6 text-center animate-fade-in-up">
        <div className="text-xs text-muted-foreground font-oswald tracking-widest mb-4">ПЕРЕВЕДИ ЧИСЛО В {BASE_LABEL[q.toBase].toUpperCase()} СИСТЕМУ</div>
        <div className="font-oswald text-6xl font-bold mb-2 tracking-widest" style={{ color: BASE_COLOR[q.fromBase] }}>
          {q.value}
          <span className="text-2xl ml-1 opacity-60">{BASE_TAG[q.fromBase]}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          из <span style={{ color: BASE_COLOR[q.fromBase] }}>{q.fromBase}-ичной</span>
          {' '}в <span style={{ color: BASE_COLOR[q.toBase] }}>{q.toBase}-ичную</span>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {q.options.map((opt, i) => {
          const isChosen = chosen === opt;
          const isCorrect = opt === q.correct;
          let borderColor = 'rgba(0,212,255,0.2)';
          let bg = 'transparent';
          let textColor = 'var(--foreground)';

          if (confirmed) {
            if (isCorrect) { borderColor = 'rgba(57,255,122,0.6)'; bg = 'rgba(57,255,122,0.08)'; textColor = 'var(--neon-green)'; }
            else if (isChosen && !isCorrect) { borderColor = 'rgba(255,60,60,0.6)'; bg = 'rgba(255,60,60,0.08)'; textColor = 'rgba(255,60,60,0.9)'; }
          } else if (isChosen) {
            borderColor = 'var(--neon-blue)';
            bg = 'rgba(0,212,255,0.08)';
            textColor = 'var(--neon-blue)';
          }

          return (
            <button
              key={opt}
              disabled={confirmed}
              onClick={() => setChosen(opt)}
              className="relative rounded-xl p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-default"
              style={{ border: `1.5px solid ${borderColor}`, background: bg, color: textColor }}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: isChosen || (confirmed && isCorrect) ? `${borderColor}30` : 'rgba(255,255,255,0.05)', color: textColor }}>
                  {['A', 'B', 'C', 'D'][i]}
                </div>
                <span className="font-oswald text-xl font-bold tracking-widest">{opt}</span>
                {confirmed && isCorrect && <Icon name="Check" size={16} className="ml-auto flex-shrink-0" style={{ color: 'var(--neon-green)' }} />}
                {confirmed && isChosen && !isCorrect && <Icon name="X" size={16} className="ml-auto flex-shrink-0" style={{ color: 'rgba(255,60,60,0.9)' }} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      {!confirmed ? (
        <button
          onClick={confirmAnswer}
          disabled={!chosen}
          className="neon-btn w-full py-3.5 rounded-xl font-oswald text-lg tracking-wide disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          Подтвердить ответ
        </button>
      ) : (
        <div className="animate-fade-in-up">
          <div className={`text-center mb-4 font-oswald text-lg font-semibold ${chosen === q.correct ? 'neon-text-green' : ''}`}
            style={chosen !== q.correct ? { color: 'rgba(255,60,60,0.9)' } : {}}>
            {chosen === q.correct ? '✓ Правильно!' : `✗ Верный ответ: ${q.correct}${BASE_TAG[q.toBase]}`}
          </div>
          <button onClick={next} className="neon-btn w-full py-3.5 rounded-xl font-oswald text-lg tracking-wide">
            {current + 1 < TOTAL_QUESTIONS ? 'Следующий вопрос →' : 'Посмотреть результаты →'}
          </button>
        </div>
      )}
    </div>
  );
}

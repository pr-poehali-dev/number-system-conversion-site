import { useState } from 'react';
import Icon from '@/components/ui/icon';

// ==================== TYPES ====================
type Section = 'home' | 'converter' | 'theory' | 'examples' | 'trainer';

// ==================== CONVERTER LOGIC ====================
interface ConversionStep {
  title: string;
  detail: string;
  highlight?: string;
}

function convertWithSteps(value: string, fromBase: number, toBase: number): { result: string; steps: ConversionStep[] } {
  const steps: ConversionStep[] = [];
  if (!value.trim()) return { result: '', steps: [] };

  const decimal = parseInt(value.toUpperCase(), fromBase);
  if (isNaN(decimal)) return { result: 'Ошибка', steps: [{ title: 'Ошибка', detail: 'Введённое значение не соответствует выбранной системе счисления.' }] };

  if (fromBase === 10 && toBase === 10) {
    steps.push({ title: 'Число уже в десятичной системе', detail: `${value} = ${decimal}` });
    return { result: decimal.toString(), steps };
  }

  if (fromBase !== 10) {
    const digits = value.toUpperCase().split('');
    const calcStr = digits.map((d, i) => {
      const power = digits.length - 1 - i;
      const val = parseInt(d, fromBase);
      return `${d}×${fromBase}^${power}=${val * Math.pow(fromBase, power)}`;
    }).join(' + ');
    steps.push({
      title: `Шаг 1: Перевод из ${fromBase}-ичной в десятичную`,
      detail: `Раскладываем по позициям:`,
      highlight: `${calcStr} = ${decimal}`
    });
  } else {
    steps.push({
      title: `Шаг 1: Исходное число в десятичной системе`,
      detail: `Число ${value} уже в десятичной. Используем его напрямую: ${decimal}`,
    });
  }

  if (toBase === 10) {
    steps.push({ title: 'Шаг 2: Результат — уже в десятичной системе', detail: `Десятичное значение: ${decimal}` });
    return { result: decimal.toString(), steps };
  }

  let num = decimal;
  const divSteps: string[] = [];
  const remainders: number[] = [];
  if (num === 0) return { result: '0', steps: [{ title: 'Результат', detail: '0 в любой системе счисления равно 0' }] };

  while (num > 0) {
    const rem = num % toBase;
    const remChar = rem >= 10 ? String.fromCharCode(55 + rem) : rem.toString();
    divSteps.push(`${num} ÷ ${toBase} = ${Math.floor(num / toBase)}, остаток ${remChar}`);
    remainders.push(rem);
    num = Math.floor(num / toBase);
  }

  const result = remainders.reverse().map(r => r >= 10 ? String.fromCharCode(55 + r) : r.toString()).join('');
  steps.push({
    title: `Шаг 2: Перевод ${decimal} из десятичной в ${toBase}-ичную`,
    detail: 'Делим на основание и записываем остатки:',
    highlight: divSteps.join('\n') + `\n→ Читаем остатки снизу вверх: ${result}`
  });

  return { result, steps };
}

// ==================== HOME ====================
function HomeSection({ setSection }: { setSection: (s: Section) => void }) {
  const features = [
    { icon: 'ArrowLeftRight', title: 'Конвертер', desc: 'Переводи числа между системами с пошаговым объяснением', section: 'converter' as Section, color: 'var(--neon-blue)' },
    { icon: 'BookOpen', title: 'Теория', desc: 'Понятные объяснения двоичной, восьмеричной, шестнадцатеричной систем', section: 'theory' as Section, color: 'var(--neon-purple)' },
    { icon: 'Layers', title: 'Примеры', desc: 'Разобранные примеры с пошаговыми решениями', section: 'examples' as Section, color: '#ff9f00' },
    { icon: 'Zap', title: 'Тренажёр', desc: 'Проверь знания в интерактивных заданиях', section: 'trainer' as Section, color: 'var(--neon-green)' },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden pt-24 pb-20 px-6 bg-grid">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, var(--neon-blue), transparent)' }} />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, var(--neon-green), transparent)' }} />

        <div className="relative max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 text-sm font-medium" style={{ color: 'var(--neon-blue)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--neon-green)' }} />
            Интерактивный учебник
          </div>

          <h1 className="font-oswald text-6xl md:text-8xl font-bold mb-6 leading-none tracking-tight">
            <span className="neon-text-blue">СИСТЕМЫ</span>
            <br />
            <span className="text-foreground">СЧИСЛЕНИЯ</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-golos leading-relaxed">
            Осваивай перевод чисел между двоичной, восьмеричной, десятичной и шестнадцатеричной системами — с понятными объяснениями на каждом шагу
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => setSection('converter')} className="neon-btn px-8 py-3 rounded-xl font-oswald text-lg tracking-wide">
              Открыть конвертер
            </button>
            <button onClick={() => setSection('trainer')} className="neon-btn-green px-8 py-3 rounded-xl font-oswald text-lg tracking-wide">
              Начать тренировку
            </button>
          </div>
        </div>

        <div className="hidden md:flex justify-center gap-6 mt-16">
          {[['2', 'Двоичная'], ['8', 'Восьмерич.'], ['10', 'Десятичная'], ['16', 'Шестнадц.']].map(([base, name], i) => (
            <div key={base} className="glass rounded-2xl px-6 py-4 text-center animate-float" style={{ animationDelay: `${i * 0.3}s`, borderColor: 'rgba(0,212,255,0.2)' }}>
              <div className="font-oswald text-3xl font-bold neon-text-blue">{base}</div>
              <div className="text-xs text-muted-foreground mt-1">{name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f) => (
            <button key={f.section} onClick={() => setSection(f.section)} className="neon-border rounded-2xl p-6 text-left transition-all duration-300 group hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl flex-shrink-0" style={{ background: `${f.color}20`, border: `1px solid ${f.color}40` }}>
                  <Icon name={f.icon} size={24} style={{ color: f.color }} />
                </div>
                <div>
                  <h3 className="font-oswald text-xl font-semibold mb-1" style={{ color: f.color }}>{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
                <Icon name="ChevronRight" size={18} className="ml-auto text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-10">
          {[['4', 'Системы счисления'], ['∞', 'Примеров для практики'], ['100%', 'Бесплатно']].map(([val, label]) => (
            <div key={label} className="glass rounded-xl p-5 text-center">
              <div className="font-oswald text-3xl font-bold neon-text-blue mb-1">{val}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== CONVERTER ====================
function ConverterSection() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);
  const [result, setResult] = useState<{ result: string; steps: ConversionStep[] } | null>(null);

  const bases = [
    { value: 2, label: 'Двоичная (2)' },
    { value: 8, label: 'Восьмеричная (8)' },
    { value: 10, label: 'Десятичная (10)' },
    { value: 16, label: 'Шестнадцатеричная (16)' },
  ];

  const handleConvert = () => {
    if (!input.trim()) return;
    setResult(convertWithSteps(input.trim(), fromBase, toBase));
  };

  const handleSwap = () => {
    setFromBase(toBase);
    setToBase(fromBase);
    setResult(null);
    setInput('');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="font-oswald text-4xl font-bold mb-2"><span className="neon-text-blue">КОНВЕРТЕР</span></h2>
      <p className="text-muted-foreground mb-8">Введи число и получи пошаговое объяснение перевода</p>

      <div className="neon-border rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex-1 min-w-36">
            <label className="text-xs text-muted-foreground mb-1 block font-oswald tracking-wide">ИЗ СИСТЕМЫ</label>
            <select value={fromBase} onChange={e => { setFromBase(Number(e.target.value)); setResult(null); }} className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground font-golos">
              {bases.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>
          <button onClick={handleSwap} className="mt-5 p-2.5 rounded-xl glass hover:scale-110 transition-transform">
            <Icon name="ArrowLeftRight" size={18} style={{ color: 'var(--neon-blue)' }} />
          </button>
          <div className="flex-1 min-w-36">
            <label className="text-xs text-muted-foreground mb-1 block font-oswald tracking-wide">В СИСТЕМУ</label>
            <select value={toBase} onChange={e => { setToBase(Number(e.target.value)); setResult(null); }} className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground font-golos">
              {bases.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1 block font-oswald tracking-wide">ВВЕДИ ЧИСЛО</label>
          <input
            value={input}
            onChange={e => { setInput(e.target.value); setResult(null); }}
            onKeyDown={e => e.key === 'Enter' && handleConvert()}
            placeholder={fromBase === 16 ? 'Например: 1F или FF' : fromBase === 2 ? 'Например: 1010' : fromBase === 8 ? 'Например: 17' : 'Например: 255'}
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 font-oswald text-2xl text-foreground placeholder:text-muted-foreground/50 tracking-widest"
          />
        </div>
        <button onClick={handleConvert} className="neon-btn w-full py-3 rounded-xl font-oswald text-lg tracking-wide">Перевести</button>
      </div>

      {result && result.result && (
        <div className="animate-fade-in-up">
          {result.result !== 'Ошибка' && (
            <div className="neon-border rounded-2xl p-6 mb-4 text-center" style={{ borderColor: 'rgba(57,255,122,0.3)' }}>
              <div className="text-sm text-muted-foreground mb-1 font-oswald tracking-wide">РЕЗУЛЬТАТ</div>
              <div className="font-oswald text-5xl font-bold neon-text-green tracking-widest">{result.result}</div>
              <div className="text-xs text-muted-foreground mt-2">{input} ({fromBase}) = {result.result} ({toBase})</div>
            </div>
          )}
          <div className="space-y-3">
            <h3 className="font-oswald text-lg font-semibold" style={{ color: 'var(--neon-blue)' }}>Пошаговое объяснение:</h3>
            {result.steps.map((step, i) => (
              <div key={i} className="step-card p-4">
                <div className="font-oswald font-semibold mb-1 text-foreground">{step.title}</div>
                <div className="text-sm text-muted-foreground mb-2">{step.detail}</div>
                {step.highlight && <div className="code-block text-sm whitespace-pre-wrap" style={{ color: 'var(--neon-blue)' }}>{step.highlight}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== THEORY ====================
function TheorySection() {
  const systems = [
    { base: 2, name: 'Двоичная', color: 'var(--neon-blue)', digits: '0, 1', desc: 'Основа цифровой электроники. Используется в компьютерах, так как транзистор имеет два состояния: включён и выключён.', example: '1011₂ = 1×8 + 0×4 + 1×2 + 1×1 = 11₁₀', use: 'Процессоры, память, сетевые протоколы' },
    { base: 8, name: 'Восьмеричная', color: 'var(--neon-purple)', digits: '0–7', desc: 'Компактная запись двоичных чисел. Каждая восьмеричная цифра соответствует ровно трём двоичным битам.', example: '17₈ = 1×8 + 7 = 15₁₀', use: 'Unix-права доступа, старые системы' },
    { base: 10, name: 'Десятичная', color: '#ff9f00', digits: '0–9', desc: 'Привычная система счисления для людей. Появилась исторически — по числу пальцев на руках.', example: '255₁₀ — просто двести пятьдесят пять', use: 'Повседневные вычисления, финансы' },
    { base: 16, name: 'Шестнадцатеричная', color: 'var(--neon-green)', digits: '0–9, A–F', desc: 'Компактная и удобная запись. Каждая цифра — ровно 4 бита (nibble). A=10, B=11, C=12, D=13, E=14, F=15.', example: 'FF₁₆ = 15×16 + 15 = 255₁₀', use: 'Цвета (#FF5733), адреса памяти, хеши' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="font-oswald text-4xl font-bold mb-2"><span style={{ color: 'var(--neon-purple)' }}>ТЕОРИЯ</span></h2>
      <p className="text-muted-foreground mb-8">Четыре основные системы счисления в программировании</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {systems.map(sys => (
          <div key={sys.base} className="neon-border rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]" style={{ borderColor: `${sys.color}30` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="font-oswald text-4xl font-bold" style={{ color: sys.color }}>{sys.base}</div>
              <div>
                <div className="font-oswald text-lg font-semibold text-foreground">{sys.name}</div>
                <div className="text-xs text-muted-foreground">Цифры: {sys.digits}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{sys.desc}</p>
            <div className="code-block text-sm mb-2" style={{ color: sys.color }}>{sys.example}</div>
            <div className="text-xs text-muted-foreground">Применение: {sys.use}</div>
          </div>
        ))}
      </div>

      <h3 className="font-oswald text-2xl font-bold mb-4 text-foreground">Таблица соответствия</h3>
      <div className="overflow-x-auto rounded-2xl neon-border">
        <table className="theory-table w-full text-sm">
          <thead>
            <tr>
              <th>Десятичная</th><th>Двоичная</th><th>Восьмеричная</th><th>Шестнадцатеричная</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {Array.from({ length: 16 }, (_, i) => (
              <tr key={i}>
                <td className="text-foreground font-medium">{i}</td>
                <td style={{ color: 'var(--neon-blue)' }}>{i.toString(2).padStart(4, '0')}</td>
                <td style={{ color: 'var(--neon-purple)' }}>{i.toString(8)}</td>
                <td style={{ color: 'var(--neon-green)' }}>{i.toString(16).toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== EXAMPLES ====================
function ExamplesSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const examples = [
    {
      title: 'Перевод 42 из десятичной в двоичную', from: '42₁₀', to: '101010₂',
      steps: [
        { action: '42 ÷ 2', result: '= 21, остаток 0' }, { action: '21 ÷ 2', result: '= 10, остаток 1' },
        { action: '10 ÷ 2', result: '= 5, остаток 0' }, { action: '5 ÷ 2', result: '= 2, остаток 1' },
        { action: '2 ÷ 2', result: '= 1, остаток 0' }, { action: '1 ÷ 2', result: '= 0, остаток 1' },
        { action: 'Читаем остатки снизу вверх', result: '101010' },
      ],
      note: 'Метод деления на основание — универсальный для перевода в любую систему'
    },
    {
      title: 'Перевод 1A3 из 16-ричной в десятичную', from: '1A3₁₆', to: '419₁₀',
      steps: [
        { action: '1 × 16² = 1 × 256', result: '= 256' }, { action: 'A × 16¹ = 10 × 16', result: '= 160' },
        { action: '3 × 16⁰ = 3 × 1', result: '= 3' }, { action: '256 + 160 + 3', result: '= 419' },
      ],
      note: 'A в 16-ричной = 10 в десятичной. Применяем позиционный принцип.'
    },
    {
      title: 'Перевод 255 из десятичной в шестнадцатеричную', from: '255₁₀', to: 'FF₁₆',
      steps: [
        { action: '255 ÷ 16', result: '= 15, остаток 15 (F)' }, { action: '15 ÷ 16', result: '= 0, остаток 15 (F)' },
        { action: 'Читаем остатки снизу вверх', result: 'FF' },
      ],
      note: 'Остатки 10–15 записываем буквами A–F'
    },
    {
      title: 'Перевод 111111₂ в восьмеричную', from: '111111₂', to: '77₈',
      steps: [
        { action: 'Группируем по 3 бита справа', result: '111 111' }, { action: '111₂ = 4+2+1', result: '= 7' },
        { action: '111₂ = 4+2+1', result: '= 7' }, { action: 'Объединяем', result: '77₈' },
      ],
      note: 'Быстрый способ: 3 двоичных бита = 1 восьмеричная цифра!'
    },
    {
      title: 'Перевод 3C из 16-ричной в двоичную', from: '3C₁₆', to: '00111100₂',
      steps: [
        { action: '3₁₆ → 4 бита', result: '0011' }, { action: 'C₁₆ = 12 → 4 бита', result: '1100' },
        { action: 'Объединяем', result: '00111100' },
      ],
      note: 'Каждая шестнадцатеричная цифра = ровно 4 двоичных бита'
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="font-oswald text-4xl font-bold mb-2"><span style={{ color: '#ff9f00' }}>ПРИМЕРЫ</span></h2>
      <p className="text-muted-foreground mb-8">Нажми на задачу, чтобы увидеть подробное решение</p>

      <div className="space-y-4">
        {examples.map((ex, i) => (
          <div key={i} className="neon-border rounded-2xl overflow-hidden transition-all duration-300">
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full p-5 text-left flex items-center gap-4 hover:bg-white/[0.02]">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-oswald font-bold text-sm" style={{ background: 'rgba(255,159,0,0.15)', color: '#ff9f00' }}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-golos font-semibold text-foreground mb-0.5">{ex.title}</div>
                <div className="text-sm text-muted-foreground">
                  <span style={{ color: 'var(--neon-blue)' }}>{ex.from}</span>
                  <span className="mx-2">→</span>
                  <span style={{ color: 'var(--neon-green)' }}>{ex.to}</span>
                </div>
              </div>
              <Icon name={openIdx === i ? 'ChevronUp' : 'ChevronDown'} size={18} className="text-muted-foreground flex-shrink-0" />
            </button>

            {openIdx === i && (
              <div className="px-5 pb-5 animate-fade-in-up">
                <div className="space-y-2 mb-4">
                  {ex.steps.map((step, j) => (
                    <div key={j} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold" style={{ background: 'rgba(255,159,0,0.2)', color: '#ff9f00' }}>{j + 1}</div>
                      <div className="code-block flex-1 flex justify-between text-sm flex-wrap gap-2">
                        <span className="text-foreground">{step.action}</span>
                        <span style={{ color: 'var(--neon-green)' }} className="font-bold">{step.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {ex.note && (
                  <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(255,159,0,0.08)', border: '1px solid rgba(255,159,0,0.2)' }}>
                    <Icon name="Lightbulb" size={16} style={{ color: '#ff9f00', flexShrink: 0 }} />
                    <span className="text-sm text-muted-foreground">{ex.note}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== TRAINER ====================
interface TrainerTask {
  question: string;
  fromBase: number;
  toBase: number;
  value: string;
  answer: string;
  hint: string;
}

function generateTask(): TrainerTask {
  const pairs: [number, number][] = [[10, 2], [2, 10], [10, 16], [16, 10], [2, 16], [8, 10], [10, 8]];
  const [fromBase, toBase] = pairs[Math.floor(Math.random() * pairs.length)];
  const maxVal = fromBase === 2 ? 15 : 255;
  const num = Math.floor(Math.random() * maxVal) + 1;
  const value = num.toString(fromBase).toUpperCase();
  const answer = num.toString(toBase).toUpperCase();
  const baseNames: Record<number, string> = { 2: 'двоичную', 8: 'восьмеричную', 10: 'десятичную', 16: 'шестнадцатеричную' };
  return { question: `Переведи число ${value}₍${fromBase}₎ в ${baseNames[toBase]} систему`, fromBase, toBase, value, answer, hint: `Подсказка: ${value} в десятичной = ${num}` };
}

function TrainerSection() {
  const [task, setTask] = useState<TrainerTask>(generateTask);
  const [userAnswer, setUserAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);

  const handleCheck = () => {
    if (!userAnswer.trim()) return;
    const isCorrect = userAnswer.trim().toUpperCase() === task.answer.toUpperCase();
    setStatus(isCorrect ? 'correct' : 'wrong');
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    setStreak(s => isCorrect ? s + 1 : 0);
  };

  const nextTask = () => {
    setTask(generateTask());
    setUserAnswer('');
    setStatus('idle');
    setShowHint(false);
    setShowSolution(false);
  };

  const solution = convertWithSteps(task.value, task.fromBase, task.toBase);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-oswald text-4xl font-bold"><span className="neon-text-green">ТРЕНАЖЁР</span></h2>
        <div className="flex gap-3">
          <div className="glass rounded-xl px-3 py-2 text-center">
            <div className="font-oswald text-xl font-bold neon-text-green">{score.correct}/{score.total}</div>
            <div className="text-xs text-muted-foreground">Счёт</div>
          </div>
          {streak >= 2 && (
            <div className="glass rounded-xl px-3 py-2 text-center animate-pulse-glow">
              <div className="font-oswald text-xl font-bold" style={{ color: '#ff9f00' }}>🔥 {streak}</div>
              <div className="text-xs text-muted-foreground">Серия</div>
            </div>
          )}
        </div>
      </div>
      <p className="text-muted-foreground mb-8">Реши задачу и проверь ответ</p>

      <div className="neon-border rounded-2xl p-6 mb-5">
        <div className="text-xs text-muted-foreground font-oswald tracking-widest mb-3">ЗАДАНИЕ</div>
        <div className="font-golos text-xl text-foreground font-semibold mb-6 leading-relaxed">{task.question}</div>

        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1 block font-oswald tracking-wide">ТВОЙ ОТВЕТ</label>
          <input
            value={userAnswer}
            onChange={e => { setUserAnswer(e.target.value); setStatus('idle'); }}
            onKeyDown={e => e.key === 'Enter' && (status === 'idle' ? handleCheck() : nextTask())}
            placeholder="Введи ответ..."
            disabled={status !== 'idle'}
            className={`w-full bg-secondary border border-border rounded-xl px-4 py-3 font-oswald text-2xl text-foreground tracking-widest placeholder:text-muted-foreground/50 ${status === 'correct' ? 'correct' : status === 'wrong' ? 'wrong' : ''}`}
          />
        </div>

        {status === 'idle' && (
          <div className="flex gap-3">
            <button onClick={handleCheck} className="neon-btn-green flex-1 py-3 rounded-xl font-oswald text-lg tracking-wide">Проверить</button>
            <button onClick={() => setShowHint(!showHint)} className="glass px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="HelpCircle" size={18} />
            </button>
          </div>
        )}

        {status === 'correct' && (
          <div className="text-center py-2">
            <div className="font-oswald text-2xl neon-text-green mb-3">✓ Правильно!</div>
            <button onClick={nextTask} className="neon-btn-green px-8 py-3 rounded-xl font-oswald text-lg tracking-wide">Следующая задача →</button>
          </div>
        )}

        {status === 'wrong' && (
          <div className="space-y-3">
            <div className="text-center">
              <div className="font-oswald text-xl mb-1" style={{ color: 'rgba(255,60,60,0.9)' }}>✗ Не совсем...</div>
              <div className="text-sm text-muted-foreground">Правильный ответ: <span className="font-oswald font-bold neon-text-green">{task.answer}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowSolution(!showSolution)} className="flex-1 glass py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors">
                {showSolution ? 'Скрыть решение' : 'Показать решение'}
              </button>
              <button onClick={nextTask} className="neon-btn px-5 py-2.5 rounded-xl font-oswald tracking-wide">Дальше →</button>
            </div>
          </div>
        )}
      </div>

      {showHint && status === 'idle' && (
        <div className="animate-fade-in-up glass rounded-xl p-4 mb-4 text-sm text-muted-foreground flex items-start gap-2">
          <Icon name="Lightbulb" size={16} style={{ color: '#ff9f00', flexShrink: 0 }} />
          {task.hint}
        </div>
      )}

      {showSolution && (
        <div className="animate-fade-in-up space-y-3">
          <h3 className="font-oswald text-lg font-semibold" style={{ color: 'var(--neon-blue)' }}>Пошаговое решение:</h3>
          {solution.steps.map((step, i) => (
            <div key={i} className="step-card p-4">
              <div className="font-oswald font-semibold mb-1 text-foreground text-sm">{step.title}</div>
              <div className="text-xs text-muted-foreground mb-2">{step.detail}</div>
              {step.highlight && <div className="code-block text-xs whitespace-pre-wrap" style={{ color: 'var(--neon-blue)' }}>{step.highlight}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [section, setSection] = useState<Section>('home');

  const navItems: { id: Section; label: string; icon: string }[] = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'converter', label: 'Конвертер', icon: 'ArrowLeftRight' },
    { id: 'theory', label: 'Теория', icon: 'BookOpen' },
    { id: 'examples', label: 'Примеры', icon: 'Layers' },
    { id: 'trainer', label: 'Тренажёр', icon: 'Zap' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-1 justify-between">
          <button onClick={() => setSection('home')} className="font-oswald text-xl font-bold neon-text-blue flex-shrink-0 mr-2">
            NUM<span className="text-foreground">BASE</span>
          </button>
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${section === item.id ? 'font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                style={section === item.id ? { background: 'var(--neon-blue)', color: '#050d14' } : {}}
              >
                <Icon name={item.icon} size={14} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="pt-14">
        {section === 'home' && <HomeSection setSection={setSection} />}
        {section === 'converter' && <ConverterSection />}
        {section === 'theory' && <TheorySection />}
        {section === 'examples' && <ExamplesSection />}
        {section === 'trainer' && <TrainerSection />}
      </div>
    </div>
  );
}

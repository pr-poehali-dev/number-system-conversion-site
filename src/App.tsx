import { useState } from 'react';
import Icon from '@/components/ui/icon';

// ==================== TYPES ====================
type Section = 'home' | 'converter' | 'theory' | 'examples' | 'test';

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
    { icon: 'ClipboardList', title: 'Тест', desc: '10 вопросов с выбором ответа и итоговой оценкой', section: 'test' as Section, color: 'var(--neon-green)' },
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
            <button onClick={() => setSection('test')} className="neon-btn-green px-8 py-3 rounded-xl font-oswald text-lg tracking-wide">
              Пройти тест
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

interface ArithExample {
  title: string;
  system: string;
  systemColor: string;
  operation: string;
  operationIcon: string;
  columnLines: { label?: string; value: string; comment?: string; isResult?: boolean; isSeparator?: boolean; isCarry?: boolean }[];
  explanation: string[];
  note: string;
  check: string;
}

const ARITH_EXAMPLES: ArithExample[] = [
  {
    title: 'Сложение в двоичной системе',
    system: 'Двоичная (2)', systemColor: 'var(--neon-blue)',
    operation: 'Сложение', operationIcon: '+',
    columnLines: [
      { label: 'Перенос', value: '  1 1 1  ', isCarry: true },
      { value: '  1 0 1 1', comment: '= 11₁₀' },
      { label: '+', value: '  1 1 0 1', comment: '= 13₁₀' },
      { isSeparator: true, value: '' },
      { value: '1 1 0 0 0', comment: '= 24₁₀', isResult: true },
    ],
    explanation: [
      'Бит 0 (правый): 1+1 = 10₂ → пишем 0, перенос 1',
      'Бит 1: 1+0+1(перенос) = 10₂ → пишем 0, перенос 1',
      'Бит 2: 0+1+1(перенос) = 10₂ → пишем 0, перенос 1',
      'Бит 3: 1+1+1(перенос) = 11₂ → пишем 1, перенос 1',
      'Бит 4: 0+0+1(перенос) = 1 → пишем 1',
      'Результат: 11000₂ = 24₁₀ ✓',
    ],
    note: 'Таблица сложения: 0+0=0, 0+1=1, 1+1=10, 1+1+1=11. Перенос передаётся в следующий разряд.',
    check: '11₁₀ + 13₁₀ = 24₁₀ ✓',
  },
  {
    title: 'Вычитание в двоичной системе',
    system: 'Двоичная (2)', systemColor: 'var(--neon-blue)',
    operation: 'Вычитание', operationIcon: '−',
    columnLines: [
      { value: '1 0 1 1 0', comment: '= 22₁₀' },
      { label: '−', value: '  0 1 1 1', comment: '= 7₁₀' },
      { isSeparator: true, value: '' },
      { value: '  1 1 1 1', comment: '= 15₁₀', isResult: true },
    ],
    explanation: [
      'Бит 0: 0−1 нельзя → занимаем из бит 1. Бит 1 = 0, идём дальше.',
      'Занимаем из бит 2 (=1). Бит 2 становится 0, бит 1 = 10₂.',
      'Бит 1 отдаёт бит 0: бит 0 = 10₂ − 1 = 1, бит 1 = 1−1 = 0... считаем поразрядно.',
      'Бит 0: 10₂−1 = 1 (с заёмом)', 'Бит 1: 0₂−1 = 1 (с заёмом)', 'Бит 2: 0₂−1 = 1 (с заёмом)',
      'Бит 3: 1₂−0 = 1', 'Результат: 1111₂ = 15₁₀ ✓',
    ],
    note: 'При нехватке берём заём из старшего разряда: занятый разряд даёт +2 к текущему.',
    check: '22₁₀ − 7₁₀ = 15₁₀ ✓',
  },
  {
    title: 'Умножение в двоичной системе',
    system: 'Двоичная (2)', systemColor: 'var(--neon-blue)',
    operation: 'Умножение', operationIcon: '×',
    columnLines: [
      { value: '    1 0 1 1', comment: '= 11₁₀' },
      { label: '×', value: '      1 0 1', comment: '= 5₁₀' },
      { isSeparator: true, value: '' },
      { label: '×1:', value: '    1 0 1 1', comment: 'сдвиг 0' },
      { label: '×0:', value: '  0 0 0 0 ·', comment: 'сдвиг 1, =0' },
      { label: '×1:', value: '1 0 1 1 · ·', comment: 'сдвиг 2' },
      { isSeparator: true, value: '' },
      { value: '1 1 0 1 1 1', comment: '= 55₁₀', isResult: true },
    ],
    explanation: [
      'Умножаем 1011 на каждую цифру множителя (с права налево):',
      '1011 × 1 = 1011 (сдвиг 0 влево)',
      '1011 × 0 = 0000 (сдвиг 1 влево)',
      '1011 × 1 = 1011 (сдвиг 2 влево)',
      'Складываем три частичных произведения:',
      '001011 + 000000 + 101100 = 110111₂',
    ],
    note: 'Умножение в двоичной — это сдвиги и сложения. Именно так работает процессор!',
    check: '11₁₀ × 5₁₀ = 55₁₀ ✓',
  },
  {
    title: 'Деление в двоичной системе',
    system: 'Двоичная (2)', systemColor: 'var(--neon-blue)',
    operation: 'Деление', operationIcon: '÷',
    columnLines: [
      { value: '1 1 0 1 ÷ 1 1 = ?', comment: '13÷3=?' },
      { isSeparator: true, value: '' },
      { label: 'Шаг 1:', value: '11 ÷ 11 = 1', comment: 'первые 2 бита' },
      { label: '', value: '11 − 11 = 00', comment: 'остаток 0' },
      { label: 'Шаг 2:', value: '001 ÷ 11 = 0', comment: 'недостаточно' },
      { label: 'Шаг 3:', value: '0011 → нет', comment: 'сносим следующий' },
      { label: 'Итог:', value: '100 остаток 1', comment: '=4 ост. 1', isResult: true },
    ],
    explanation: [
      'Делитель: 11₂ = 3, делимое: 1101₂ = 13',
      'Берём 2 старших бита: 11₂. 11÷11 = 1, остаток 0.',
      'Сносим следующий бит: получаем 00. 0÷11 = 0.',
      'Сносим следующий бит: получаем 001. 1÷11 = 0.',
      'Берём 01 + следующий = 011. 11÷11 = 1, остаток 0.',
      'Частное: 100₂ = 4. Остаток: 1₂ = 1.',
      'Проверка: 4 × 3 + 1 = 13 ✓',
    ],
    note: 'Деление в столбик в двоичной работает так же, как в десятичной — но деление только на 0 или 1.',
    check: '13₁₀ ÷ 3₁₀ = 4 ост. 1 ✓',
  },
  {
    title: 'Сложение в восьмеричной системе',
    system: 'Восьмеричная (8)', systemColor: 'var(--neon-purple)',
    operation: 'Сложение', operationIcon: '+',
    columnLines: [
      { label: 'Перенос', value: '  1    ', isCarry: true },
      { value: '  3 7 5', comment: '= 253₁₀' },
      { label: '+', value: '  2 4 6', comment: '= 166₁₀' },
      { isSeparator: true, value: '' },
      { value: '  6 4 3', comment: '= 419₁₀', isResult: true },
    ],
    explanation: [
      'Разряд 0: 5+6 = 11₁₀ = 13₈ → пишем 3, перенос 1',
      'Разряд 1: 7+4+1(перенос) = 12₁₀ = 14₈ → пишем 4, перенос 1',
      'Разряд 2: 3+2+1(перенос) = 6₁₀ = 6₈ → пишем 6',
      'Результат: 643₈ = 419₁₀ ✓',
    ],
    note: 'Если сумма цифр ≥ 8 — вычитаем 8 и передаём перенос 1. Цифры 0–7, девятки нет!',
    check: '253₁₀ + 166₁₀ = 419₁₀ ✓',
  },
  {
    title: 'Сложение в шестнадцатеричной системе',
    system: 'Шестнадцатеричная (16)', systemColor: 'var(--neon-green)',
    operation: 'Сложение', operationIcon: '+',
    columnLines: [
      { label: 'Перенос', value: '    1  ', isCarry: true },
      { value: '  A B 8', comment: '= 2744₁₀' },
      { label: '+', value: '  3 F 9', comment: '= 1017₁₀' },
      { isSeparator: true, value: '' },
      { value: '  E F 1', comment: '= 3761₁₀', isResult: true },
    ],
    explanation: [
      'Разряд 0: 8+9 = 17₁₀ = 11₁₆ → пишем 1, перенос 1',
      'Разряд 1: B+F+1 = 11+15+1 = 27₁₀ = 1B₁₆ → пишем B, перенос 1',
      'Разряд 2: A+3+1 = 10+3+1 = 14₁₀ = E₁₆ → пишем E',
      'Результат: EF1₁₆ = 3761₁₀ ✓',
    ],
    note: 'A=10, B=11, C=12, D=13, E=14, F=15. Если сумма ≥ 16 — делим нацело на 16, пишем остаток, переносим частное.',
    check: '2744₁₀ + 1017₁₀ = 3761₁₀ ✓',
  },
  {
    title: 'Вычитание в шестнадцатеричной системе',
    system: 'Шестнадцатеричная (16)', systemColor: 'var(--neon-green)',
    operation: 'Вычитание', operationIcon: '−',
    columnLines: [
      { value: '  F 3 C', comment: '= 3900₁₀' },
      { label: '−', value: '  A 7 E', comment: '= 2686₁₀' },
      { isSeparator: true, value: '' },
      { value: '  4 B E', comment: '= 1214₁₀', isResult: true },
    ],
    explanation: [
      'Разряд 0: C−E = 12−14 < 0 → занимаем 16. 12+16−14 = 14₁₀ = E₁₆',
      'Разряд 1: 3−7−1(заём) = 3−8 < 0 → занимаем 16. 3+16−7−1 = 11₁₀ = B₁₆',
      'Разряд 2: F−A−1(заём) = 15−10−1 = 4₁₀ = 4₁₆',
      'Результат: 4BE₁₆ = 1214₁₀ ✓',
    ],
    note: 'Заём в 16-ричной равен 16 (не 10). Не забывай вычитать единицу за заём из следующего разряда.',
    check: '3900₁₀ − 2686₁₀ = 1214₁₀ ✓',
  },
  {
    title: 'Умножение в восьмеричной системе',
    system: 'Восьмеричная (8)', systemColor: 'var(--neon-purple)',
    operation: 'Умножение', operationIcon: '×',
    columnLines: [
      { value: '    2 5', comment: '= 21₁₀' },
      { label: '×', value: '      7', comment: '= 7₁₀' },
      { isSeparator: true, value: '' },
      { label: 'Ш.1:', value: '5×7 = 35₁₀ = 43₈', comment: '→ 3, пер. 4' },
      { label: 'Ш.2:', value: '2×7+4 = 18₁₀ = 22₈', comment: '→ 22' },
      { isSeparator: true, value: '' },
      { value: '  2 2 3', comment: '= 147₁₀', isResult: true },
    ],
    explanation: [
      '5 × 7 = 35₁₀. Переводим в восьмеричную: 35÷8=4 ост.3 → пишем 3, перенос 4',
      '2 × 7 = 14₁₀, плюс перенос 4 = 18₁₀. 18÷8=2 ост.2 → пишем 2, перенос 2',
      'Перенос 2 записываем как есть.',
      'Результат: 223₈ = 147₁₀ ✓',
    ],
    note: 'Умножаем как обычно в десятичной, но промежуточные результаты переводим в восьмеричную для записи.',
    check: '21₁₀ × 7₁₀ = 147₁₀ ✓',
  },
];

function ColumnBlock({ lines, systemColor }: { lines: ArithExample['columnLines'], systemColor: string }) {
  return (
    <div className="rounded-xl p-5 font-mono text-base leading-7" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${systemColor}25` }}>
      {lines.map((line, i) => (
        <div key={i}>
          {line.isSeparator ? (
            <div className="border-t my-1" style={{ borderColor: `${systemColor}40` }} />
          ) : (
            <div className="flex items-baseline gap-3">
              <span className="w-16 text-right flex-shrink-0 text-xs" style={{ color: line.isCarry ? '#ff9f00' : `${systemColor}80` }}>
                {line.label ?? ''}
              </span>
              <span
                className="tracking-widest font-bold text-lg"
                style={{ color: line.isResult ? systemColor : line.isCarry ? '#ff9f00' : 'var(--foreground)' }}
              >
                {line.value}
              </span>
              {line.comment && (
                <span className="text-xs ml-1" style={{ color: `${systemColor}70` }}>{line.comment}</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ExamplesSection() {
  const [tab, setTab] = useState<'convert' | 'arith'>('convert');
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [openArith, setOpenArith] = useState<number | null>(null);

  const convertExamples = [
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

  const OPERATION_COLOR: Record<string, string> = {
    'Сложение': 'var(--neon-green)',
    'Вычитание': 'rgba(255,60,60,0.85)',
    'Умножение': '#ff9f00',
    'Деление': 'var(--neon-purple)',
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="font-oswald text-4xl font-bold mb-2"><span style={{ color: '#ff9f00' }}>ПРИМЕРЫ</span></h2>
      <p className="text-muted-foreground mb-6">Нажми на задачу, чтобы увидеть подробное решение</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 p-1 rounded-xl glass w-fit">
        {([['convert', 'Перевод чисел', 'ArrowLeftRight'], ['arith', 'Арифметика в столбик', 'Calculator']] as const).map(([id, label, icon]) => (
          <button
            key={id}
            onClick={() => { setTab(id); setOpenIdx(null); setOpenArith(null); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={tab === id ? { background: '#ff9f00', color: '#050d14', fontWeight: 700 } : { color: 'var(--muted-foreground)' }}
          >
            <Icon name={icon} size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Convert tab */}
      {tab === 'convert' && (
        <div className="space-y-4">
          {convertExamples.map((ex, i) => (
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
      )}

      {/* Arith tab */}
      {tab === 'arith' && (
        <div className="space-y-4">
          {ARITH_EXAMPLES.map((ex, i) => {
            const opColor = OPERATION_COLOR[ex.operation];
            const isOpen = openArith === i;
            return (
              <div key={i} className="rounded-2xl overflow-hidden transition-all duration-300" style={{ border: `1px solid ${ex.systemColor}25` }}>
                <button
                  onClick={() => setOpenArith(isOpen ? null : i)}
                  className="w-full p-5 text-left flex items-center gap-4 hover:bg-white/[0.02]"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-oswald font-bold text-lg"
                    style={{ background: `${opColor}20`, color: opColor }}>
                    {ex.operationIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-golos font-semibold text-foreground mb-1">{ex.title}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${ex.systemColor}15`, color: ex.systemColor }}>
                        {ex.system}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${opColor}15`, color: opColor }}>
                        {ex.operation}
                      </span>
                    </div>
                  </div>
                  <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={18} className="text-muted-foreground flex-shrink-0" />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 animate-fade-in-up space-y-5">
                    {/* Column view */}
                    <div>
                      <div className="text-xs font-oswald tracking-widest text-muted-foreground mb-2">ПРИМЕР В СТОЛБИК</div>
                      <ColumnBlock lines={ex.columnLines} systemColor={ex.systemColor} />
                    </div>

                    {/* Explanation */}
                    <div>
                      <div className="text-xs font-oswald tracking-widest text-muted-foreground mb-2">РАЗБОР ПО ШАГАМ</div>
                      <div className="space-y-2">
                        {ex.explanation.map((step, j) => (
                          <div key={j} className="flex gap-3 items-start">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold flex-shrink-0"
                              style={{ background: `${opColor}20`, color: opColor }}>{j + 1}</div>
                            <div className="text-sm text-muted-foreground leading-relaxed">{step}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Note + check */}
                    <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: `${ex.systemColor}08`, border: `1px solid ${ex.systemColor}20` }}>
                      <Icon name="Lightbulb" size={16} style={{ color: ex.systemColor, flexShrink: 0 }} />
                      <span className="text-sm text-muted-foreground">{ex.note}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-oswald font-semibold" style={{ color: 'var(--neon-green)' }}>
                      <Icon name="Check" size={16} />
                      Проверка: {ex.check}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==================== TEST ====================
const TOTAL_QUESTIONS = 10;

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

function generateQuestion(used: Set<string>): TestQuestion {
  const pairs: [number, number][] = [[10, 2], [2, 10], [10, 16], [16, 10], [2, 16], [8, 10], [10, 8], [16, 8], [8, 2]];
  let fromBase: number, toBase: number, num: number, value: string, correct: string, key: string;
  let attempts = 0;
  do {
    [fromBase, toBase] = pairs[Math.floor(Math.random() * pairs.length)];
    const maxVal = fromBase === 2 ? 15 : fromBase === 8 ? 63 : 200;
    num = Math.floor(Math.random() * (maxVal - 3)) + 2;
    value = num.toString(fromBase).toUpperCase();
    correct = num.toString(toBase).toUpperCase();
    key = `${fromBase}-${toBase}-${value}`;
    attempts++;
  } while (used.has(key) && attempts < 50);
  used.add(key);

  // Generate 3 wrong options close to correct
  const wrongSet = new Set<string>([correct]);
  const wrongs: string[] = [];
  let tries = 0;
  while (wrongs.length < 3 && tries < 100) {
    tries++;
    const delta = Math.floor(Math.random() * 10) - 5;
    const candidate = (num + delta);
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

function buildQuestions(): TestQuestion[] {
  const used = new Set<string>();
  return Array.from({ length: TOTAL_QUESTIONS }, () => generateQuestion(used));
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

function TestSection() {
  const [phase, setPhase] = useState<'start' | 'quiz' | 'result'>('start');
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);

  const startTest = () => {
    setQuestions(buildQuestions());
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
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 animate-float"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(57,255,122,0.1))', border: '1px solid rgba(0,212,255,0.3)' }}>
          <Icon name="ClipboardList" size={36} style={{ color: 'var(--neon-blue)' }} />
        </div>
        <h2 className="font-oswald text-5xl font-bold mb-3"><span className="neon-text-blue">ТЕСТ</span></h2>
        <p className="text-muted-foreground text-lg mb-2">Перевод систем счисления</p>
        <p className="text-muted-foreground/60 text-sm mb-10 max-w-md">
          10 вопросов с выбором одного правильного ответа из четырёх. Переводи числа между двоичной, восьмеричной, десятичной и шестнадцатеричной системами.
        </p>

        <div className="grid grid-cols-3 gap-4 w-full mb-10">
          {[['10', 'вопросов'], ['4', 'варианта'], ['≈5', 'минут']].map(([v, l]) => (
            <div key={l} className="glass rounded-xl py-4">
              <div className="font-oswald text-3xl font-bold neon-text-blue">{v}</div>
              <div className="text-xs text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>

        <button onClick={startTest} className="neon-btn px-12 py-4 rounded-2xl font-oswald text-xl tracking-wide">
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

    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="text-5xl mb-4">{grade.emoji}</div>
          <h2 className="font-oswald text-4xl font-bold mb-2" style={{ color: grade.color }}>{grade.label}</h2>
          <div className="font-oswald text-6xl font-bold mb-1" style={{ color: grade.color }}>{correctCount}<span className="text-muted-foreground text-3xl">/{TOTAL_QUESTIONS}</span></div>
          <div className="text-muted-foreground mb-6">{pct}% правильных ответов</div>

          {/* Progress bar */}
          <div className="w-full h-3 rounded-full bg-secondary overflow-hidden mb-8">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: `linear-gradient(90deg, var(--neon-blue), ${grade.color})` }} />
          </div>

          <button onClick={startTest} className="neon-btn px-8 py-3 rounded-xl font-oswald text-lg tracking-wide mr-3">
            Пройти снова
          </button>
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

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-oswald text-sm text-muted-foreground tracking-widest">ВОПРОС {current + 1} / {TOTAL_QUESTIONS}</span>
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

// ==================== MAIN APP ====================
export default function App() {
  const [section, setSection] = useState<Section>('home');

  const navItems: { id: Section; label: string; icon: string }[] = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'converter', label: 'Конвертер', icon: 'ArrowLeftRight' },
    { id: 'theory', label: 'Теория', icon: 'BookOpen' },
    { id: 'examples', label: 'Примеры', icon: 'Layers' },
    { id: 'test', label: 'Тест', icon: 'ClipboardList' },
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
        {section === 'test' && <TestSection />}
      </div>
    </div>
  );
}
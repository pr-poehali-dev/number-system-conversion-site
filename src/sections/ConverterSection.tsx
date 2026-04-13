import { useState } from 'react';
import Icon from '@/components/ui/icon';

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

export default function ConverterSection() {
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

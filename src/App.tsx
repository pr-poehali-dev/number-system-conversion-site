import { useState } from 'react';
import Icon from '@/components/ui/icon';
import HomeSection from '@/sections/HomeSection';
import ConverterSection from '@/sections/ConverterSection';
import ExamplesSection from '@/sections/ExamplesSection';
import TestSection from '@/sections/TestSection';

type Section = 'home' | 'converter' | 'theory' | 'examples' | 'test';

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

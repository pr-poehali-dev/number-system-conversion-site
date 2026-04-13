import Icon from '@/components/ui/icon';

type Section = 'home' | 'converter' | 'theory' | 'examples' | 'test';

export default function HomeSection({ setSection }: { setSection: (s: Section) => void }) {
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

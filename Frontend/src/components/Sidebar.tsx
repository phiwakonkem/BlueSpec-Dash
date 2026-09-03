type Props = {
  activeView: 'log' | 'overview' | 'history';
  onChange: (view: 'log' | 'overview' | 'history') => void;
};

export default function Sidebar({ activeView, onChange }: Props) {
  const items = [
    { id: 'log' as const, label: 'Log & Review' },
    { id: 'overview' as const, label: 'Operations Overview' },
    { id: 'history' as const, label: 'History' },
  ];

  return (
    <aside className="w-56 shrink-0 border-r border-white/10 flex flex-col">
      <div className="px-6 py-7">
        <p className="font-serif text-lg text-ink">Bluespec</p>
        <p className="font-mono text-[11px] text-muted tracking-wide mt-0.5">Command</p>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`text-left px-3 py-2 rounded text-sm transition-colors ${
              activeView === item.id
                ? 'bg-brass/10 text-brass'
                : 'text-muted hover:text-ink hover:bg-white/5'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
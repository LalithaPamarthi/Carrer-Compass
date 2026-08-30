interface SectionHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function SectionHeader({ title, description, children }: SectionHeaderProps) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {description ? <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
      {children ? <div className="flex shrink-0 items-center gap-2">{children}</div> : null}
    </header>
  );
}

export function SignalBars({ signals }: { signals: { label: string; value: number; note: string }[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {signals.map((s) => (
        <li key={s.label} className="surface-card p-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium">{s.label}</span>
            <span className="text-sm font-semibold tabular-nums">{s.value}</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-700"
              style={{ width: `${Math.max(0, Math.min(100, s.value))}%` }}
            />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.note}</p>
        </li>
      ))}
    </ul>
  );
}

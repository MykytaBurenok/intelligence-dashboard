type ImpactCardProps = {
  label: string;
  name: string;
  value: string;
  change: string;
  description: string;
  intensity: number;
};

export default function ImpactCard({
  label,
  name,
  value,
  change,
  description,
  intensity,
}: ImpactCardProps) {
  const positive = change.startsWith("+");

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)]">
            {label}
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--text-muted)]">
            {name}
          </p>
        </div>
        <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[var(--shadow-glow)]" />
      </div>
      <p className="mt-3 text-2xl font-semibold text-[var(--text)]">{value}</p>
      <p
        className={`mt-1 text-sm font-semibold ${
          positive ? "text-[var(--success)]" : "text-[var(--danger)]"
        }`}
      >
        {change}
      </p>
      <div className="mt-4 h-1 rounded-full bg-[var(--surface-strong)]">
        <div
          className="metric-line h-full rounded-full"
          style={{ width: `${intensity}%` }}
        />
      </div>
      <p className="mt-3 text-xs leading-5 text-[var(--text-faint)]">
        {description}
      </p>
    </div>
  );
}

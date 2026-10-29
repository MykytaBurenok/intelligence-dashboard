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
  const numericChange = Number.parseFloat(change.replace("%", ""));
  const hasNumericChange = Number.isFinite(numericChange) && /%$/.test(change);
  const changeClass = hasNumericChange
    ? numericChange > 0
      ? "text-[var(--success)]"
      : numericChange < 0
        ? "text-[var(--danger)]"
        : "text-[var(--text-muted)]"
    : "text-[var(--text-muted)]";
  const safeIntensity = Number.isFinite(intensity)
    ? Math.min(100, Math.max(0, intensity))
    : 0;

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

      <p className={`mt-1 text-sm font-semibold ${changeClass}`}>{change}</p>

      <div className="mt-4 h-1 rounded-full bg-[var(--surface-strong)]">
        <div
          className="metric-line h-full rounded-full"
          style={{ width: `${safeIntensity}%` }}
        />
      </div>

      <p className="mt-3 text-xs leading-5 text-[var(--text-faint)]">
        {description}
      </p>
    </div>
  );
}

type SummaryCardProps = {
  label: string;
  value: number;
  hint?: string;
};

export function SummaryCard({ label, value, hint }: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-sand bg-surface p-5">
      <p className="text-sm text-taupe">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-forest">{value}</p>
      {hint && <p className="mt-1 text-xs text-taupe/70">{hint}</p>}
    </div>
  );
}
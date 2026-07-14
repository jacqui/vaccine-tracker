const styles: Record<string, string> = {
  available: "text-available bg-available-bg",
  in_trials: "text-trials bg-trials-bg",
  in_development: "text-dev bg-dev-bg",
  none: "text-none bg-none-bg",
};

export function StatusBadge({ status, large = false }: { status: string; large?: boolean }) {
  const label = status.replace("_", " ");
  const size = large ? "text-sm px-3 py-1.5" : "text-xs px-2.5 py-1";
  return (
    <span
      className={`inline-block font-mono uppercase tracking-wide rounded-full ${size} ${
        styles[status] ?? styles.none
      }`}
    >
      {label}
    </span>
  );
}

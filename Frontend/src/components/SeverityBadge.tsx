type Props = {
  severity: string;
};

const styles: Record<string, string> = {
  minor: 'bg-white/5 text-muted border-white/10',
  moderate: 'bg-brass/10 text-brass border-brass/30',
  severe: 'bg-rust/10 text-rust border-rust/30',
};

export default function SeverityBadge({ severity }: Props) {
  const style = styles[severity] ?? styles.minor;

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full border text-xs capitalize ${style}`}>
      {severity}
    </span>
  );
}
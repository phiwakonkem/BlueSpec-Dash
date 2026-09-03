import { useQuery } from '@tanstack/react-query';
import { fetchIncidents } from '../api';

export default function MetricsStrip() {
  const { data: incidents } = useQuery({
    queryKey: ['incidents'],
    queryFn: fetchIncidents,
  });

  const list = incidents ?? [];
  const total = list.length;
  const severe = list.filter((i) => i.damageSeverity === 'severe').length;
  const towing = list.filter((i) => i.towingRequired).length;

  const readouts = [
    { label: 'Total incidents', value: total },
    { label: 'Severe cases', value: severe },
    { label: 'Towing required', value: towing },
  ];

  return (
    <div className="flex divide-x divide-white/10 border-b border-white/10 px-8">
      {readouts.map((readout) => (
        <div key={readout.label} className="px-8 py-6 first:pl-0">
          <p className="font-serif text-4xl text-ink">{readout.value}</p>
          <p className="font-mono text-[11px] text-muted tracking-wide mt-1">{readout.label}</p>
        </div>
      ))}
    </div>
  );
}
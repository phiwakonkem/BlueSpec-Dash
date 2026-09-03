import { useQuery } from '@tanstack/react-query';
import { fetchIncidentHistory } from '../api';
import SeverityBadge from './SeverityBadge';

function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

export default function IncidentsHistory() {
  const { data: incidents, isLoading, isError } = useQuery({
    queryKey: ['incidents-history'],
    queryFn: fetchIncidentHistory,
  });

  return (
    <div className="border border-white/10 rounded-lg p-8">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-serif text-xl text-muted">Archive</h2>
        <span className="font-mono text-[11px] text-muted">Read-only record</span>
      </div>

      {isLoading && <p className="text-muted text-sm">Loading history...</p>}
      {isError && <p className="text-rust text-sm">Couldn't load history.</p>}

      {!isLoading && !isError && (incidents ?? []).length === 0 && (
        <p className="text-muted text-sm py-6">No archived incidents yet.</p>
      )}

      {!isLoading && !isError && (incidents ?? []).length > 0 && (
        <table className="w-full text-sm opacity-70">
          <thead>
            <tr className="text-left text-muted border-b border-white/10">
              <th className="pb-3 font-normal">Registration</th>
              <th className="pb-3 font-normal">Policy</th>
              <th className="pb-3 font-normal">Severity</th>
              <th className="pb-3 font-normal">Logged</th>
              <th className="pb-3 font-normal">Archived</th>
            </tr>
          </thead>
          <tbody>
            {(incidents ?? []).map((incident) => (
              <tr key={incident.id} className="border-b border-white/5">
                <td className="py-3 font-mono text-muted line-through decoration-white/20">
                  {incident.vehicleRegistration}
                </td>
                <td className="py-3 font-mono text-muted">{incident.policyId}</td>
                <td className="py-3">
                  <SeverityBadge severity={incident.damageSeverity} />
                </td>
                <td className="py-3 text-muted">
                  {new Date(incident.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 text-muted font-mono text-xs">
                  {incident.deletedAt ? timeAgo(incident.deletedAt) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
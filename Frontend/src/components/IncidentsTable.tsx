import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Truck, Archive } from 'lucide-react';
import { fetchIncidents, archiveIncident } from '../api';
import SeverityBadge from './SeverityBadge';

export default function IncidentsTable() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: incidents, isLoading, isError } = useQuery({
    queryKey: ['incidents'],
    queryFn: fetchIncidents,
  });

  const archiveMutation = useMutation({
    mutationFn: archiveIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['incidents-history'] });
    },
  });

  const filtered = (incidents ?? []).filter((incident) => {
    const matchesSearch =
      incident.vehicleRegistration.toLowerCase().includes(search.toLowerCase()) ||
      incident.policyId.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || incident.damageSeverity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="border border-white/10 rounded-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-ink">Incident log</h2>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-b border-white/15 pb-1.5">
            <Search size={14} className="text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search registration or policy"
              className="bg-transparent text-sm text-ink focus:outline-none placeholder:text-muted/50 w-52"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-transparent border-b border-white/15 pb-1.5 text-sm text-ink focus:outline-none"
          >
            <option value="all" className="bg-panel">All severities</option>
            <option value="minor" className="bg-panel">Minor</option>
            <option value="moderate" className="bg-panel">Moderate</option>
            <option value="severe" className="bg-panel">Severe</option>
          </select>
        </div>
      </div>

      {isLoading && <p className="text-muted text-sm">Loading incidents...</p>}
      {isError && <p className="text-rust text-sm">Couldn't load incidents. Check the backend is running.</p>}

      {!isLoading && !isError && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-white/10">
              <th className="pb-3 font-normal">Registration</th>
              <th className="pb-3 font-normal">Policy</th>
              <th className="pb-3 font-normal">Severity</th>
              <th className="pb-3 font-normal">Towing</th>
              <th className="pb-3 font-normal">Logged</th>
              <th className="pb-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((incident) => (
              <tr key={incident.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                <td className="py-3 font-mono text-ink">{incident.vehicleRegistration}</td>
                <td className="py-3 font-mono text-muted">{incident.policyId}</td>
                <td className="py-3">
                  <SeverityBadge severity={incident.damageSeverity} />
                </td>
                <td className="py-3">
                  {incident.towingRequired ? (
                    <Truck size={16} className="text-brass" />
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="py-3 text-muted">
                  {new Date(incident.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => archiveMutation.mutate(incident.id)}
                    disabled={archiveMutation.isPending}
                    title="Archive this incident"
                    className="opacity-0 group-hover:opacity-100 text-muted hover:text-rust transition-opacity disabled:opacity-40"
                  >
                    <Archive size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <p className="text-muted text-sm py-6">
          {incidents && incidents.length > 0 ? 'No incidents match that search.' : 'No incidents logged yet — the form above adds your first one here.'}
        </p>
      )}
    </div>
  );
}
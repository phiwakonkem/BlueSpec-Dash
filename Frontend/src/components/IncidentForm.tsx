import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Truck, Wrench, ClipboardCheck, Sparkles } from 'lucide-react';
import { createIncident, analyzeIncident, type Classification } from '../api';

const severityOptions = ['minor', 'moderate', 'severe'] as const;

const routingIcons: Record<string, typeof Truck> = {
  'Immediate Towing': Truck,
  'Desktop Assessment': ClipboardCheck,
  'Standard Panel-Beater Repair': Wrench,
};

export default function IncidentForm() {
  const queryClient = useQueryClient();

  const [vehicleRegistration, setVehicleRegistration] = useState('');
  const [policyId, setPolicyId] = useState('');
  const [description, setDescription] = useState('');
  const [towingRequired, setTowingRequired] = useState(false);
  const [damageSeverity, setDamageSeverity] = useState<typeof severityOptions[number]>('minor');
  const [analysis, setAnalysis] = useState<Classification | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: () => analyzeIncident(description, towingRequired),
    onSuccess: (result) => setAnalysis(result),
  });

  const createMutation = useMutation({
    mutationFn: createIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      setVehicleRegistration('');
      setPolicyId('');
      setDescription('');
      setTowingRequired(false);
      setDamageSeverity('minor');
      setAnalysis(null);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate({
      vehicleRegistration,
      policyId,
      description,
      towingRequired,
      damageSeverity,
      severityScore: analysis?.severityScore,
      recommendedRouting: analysis?.recommendedRouting,
    });
  }

  const inputClasses =
    'w-full bg-transparent border-b border-white/15 pb-2 text-ink focus:outline-none focus:border-brass transition-colors placeholder:text-muted/50';

  const RoutingIcon = analysis ? routingIcons[analysis.recommendedRouting] ?? Wrench : null;

  return (
    <form onSubmit={handleSubmit} className="border border-white/10 rounded-lg p-8">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-serif text-xl text-ink">Log incident</h2>
        <span className="font-mono text-[11px] text-muted">New entry</span>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <label className="block text-xs text-muted mb-2">Vehicle registration</label>
          <input
            value={vehicleRegistration}
            onChange={(e) => setVehicleRegistration(e.target.value)}
            required
            className={`${inputClasses} font-mono`}
            placeholder="CA 123-456"
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-2">Policy ID</label>
          <input
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
            required
            className={`${inputClasses} font-mono`}
            placeholder="POL-00214"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs text-muted mb-2">Incident description</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setAnalysis(null);
            }}
            required
            rows={3}
            className={inputClasses}
            placeholder="Describe what happened..."
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-2">Estimated damage severity</label>
          <select
            value={damageSeverity}
            onChange={(e) => setDamageSeverity(e.target.value as typeof severityOptions[number])}
            className={inputClasses}
          >
            {severityOptions.map((option) => (
              <option key={option} value={option} className="bg-panel">{option}</option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2.5 text-ink self-end pb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={towingRequired}
            onChange={(e) => {
              setTowingRequired(e.target.checked);
              setAnalysis(null);
            }}
            className="accent-brass w-4 h-4"
          />
          <span className="text-sm">Towing required</span>
        </label>
      </div>

      <button
        type="button"
        onClick={() => analyzeMutation.mutate()}
        disabled={!description || analyzeMutation.isPending}
        className="flex items-center gap-2 mt-6 text-sm text-brass border border-brass/30 rounded px-4 py-2 hover:bg-brass/10 disabled:opacity-40 transition-colors"
      >
        <Sparkles size={15} />
        {analyzeMutation.isPending ? 'Analyzing...' : 'Run AI analysis'}
      </button>

      {analysis && RoutingIcon && (
        <div className="mt-5 border border-brass/20 bg-brass/[0.04] rounded-lg p-5 flex items-start gap-4">
          <div className="w-9 h-9 rounded-full bg-brass/10 flex items-center justify-center shrink-0">
            <RoutingIcon size={16} className="text-brass" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <p className="font-serif text-ink">{analysis.recommendedRouting}</p>
              <span className="font-mono text-[11px] text-muted">
                severity {analysis.severityScore}/5
              </span>
            </div>
            {analysis.matchedSignals.length > 0 && (
              <p className="text-xs text-muted mt-1.5">
                Flagged on: {analysis.matchedSignals.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mt-6">
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-brass text-base font-medium px-5 py-2.5 rounded hover:bg-brass/90 disabled:opacity-50 transition-colors"
        >
          {createMutation.isPending ? 'Logging...' : 'Log incident'}
        </button>

        {createMutation.isError && (
          <p className="text-rust text-sm flex items-center gap-1.5">
            <AlertTriangle size={14} /> Something went wrong — try again.
          </p>
        )}
      </div>
    </form>
  );
}
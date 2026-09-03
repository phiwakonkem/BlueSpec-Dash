import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchIncidents } from '../api';

const SEVERITY_COLORS: Record<string, string> = {
  minor: '#8B8F98',
  moderate: '#B8935F',
  severe: '#8C3A2B',
};

export default function IncidentsCharts() {
  const { data: incidents } = useQuery({
    queryKey: ['incidents'],
    queryFn: fetchIncidents,
  });

  const list = incidents ?? [];

  const severityCounts = ['minor', 'moderate', 'severe'].map((severity) => ({
    severity,
    count: list.filter((i) => i.damageSeverity === severity).length,
  }));

  const towingCounts = [
    { name: 'Towing required', value: list.filter((i) => i.towingRequired).length },
    { name: 'No towing', value: list.filter((i) => !i.towingRequired).length },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-panel border border-white/10 rounded-lg p-6">
        <h2 className="font-serif text-lg text-ink mb-4">Incidents by severity</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={severityCounts}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
            <XAxis dataKey="severity" tick={{ fill: '#8B8F98', fontSize: 12 }} axisLine={{ stroke: '#ffffff1a' }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: '#8B8F98', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {severityCounts.map((entry) => (
                <Cell key={entry.severity} fill={SEVERITY_COLORS[entry.severity]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-panel border border-white/10 rounded-lg p-6">
        <h2 className="font-serif text-lg text-ink mb-4">Towing distribution</h2>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={towingCounts} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
              <Cell fill="#B8935F" />
              <Cell fill="#1E2229" stroke="#8B8F98" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-2 text-sm text-muted">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brass inline-block" /> Towing required</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-panel border border-muted inline-block" /> No towing</span>
        </div>
      </div>
    </div>
  );
}
const API_URL = 'http://localhost:4000';

export type Incident = {
  id: number;
  vehicleRegistration: string;
  policyId: string;
  description: string;
  towingRequired: boolean;
  damageSeverity: string;
  severityScore: number | null;
  recommendedRouting: string | null;
  createdAt: string;
  deletedAt: string | null;
};

export type NewIncident = {
  vehicleRegistration: string;
  policyId: string;
  description: string;
  towingRequired: boolean;
  damageSeverity: string;
  severityScore?: number;
  recommendedRouting?: string;
};

export async function fetchIncidents(): Promise<Incident[]> {
  const res = await fetch(`${API_URL}/api/incidents`);
  if (!res.ok) throw new Error('Failed to load incidents');
  return res.json();
}

export async function createIncident(incident: NewIncident): Promise<Incident> {
  const res = await fetch(`${API_URL}/api/incidents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incident),
  });
  if (!res.ok) throw new Error('Failed to create incident');
  return res.json();
}

export type Classification = {
  severityScore: number;
  recommendedRouting: string;
  matchedSignals: string[];
};

export async function analyzeIncident(description: string, towingRequired: boolean): Promise<Classification> {
  const res = await fetch(`${API_URL}/api/incidents/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, towingRequired }),
  });
  if (!res.ok) throw new Error('Failed to analyze incident');
  return res.json();
}

export async function fetchIncidentHistory(): Promise<Incident[]> {
  const res = await fetch(`${API_URL}/api/incidents/history`);
  if (!res.ok) throw new Error('Failed to load incident history');
  return res.json();
}

export async function archiveIncident(id: number): Promise<Incident> {
  const res = await fetch(`${API_URL}/api/incidents/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to archive incident');
  return res.json();
}
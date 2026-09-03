import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MetricsStrip from './components/MetricsStrip';
import IncidentForm from './components/IncidentForm';
import IncidentsTable from './components/IncidentsTable';
import IncidentsCharts from './components/IncidentsCharts';
import IncidentsHistory from './components/IncidentsHistory';

function App() {
  const [activeView, setActiveView] = useState<'log' | 'overview' | 'history'>('log');

  return (
    <div className="min-h-screen bg-base text-ink font-sans flex">
      <Sidebar activeView={activeView} onChange={setActiveView} />

      <div className="flex-1">
        <MetricsStrip />

        <main className="p-8 max-w-5xl space-y-8">
          {activeView === 'log' && (
            <>
              <IncidentForm />
              <IncidentsTable />
            </>
          )}
          {activeView === 'overview' && <IncidentsCharts />}
          {activeView === 'history' && <IncidentsHistory />}
        </main>
      </div>
    </div>
  );
}

export default App;
import React, { useEffect, useState } from 'react';

// Hooks
import { useDB } from './hooks/useDB.js';
import { useRoute } from './hooks/useRoute.js';

// Config & background
import { PALESTINE_PATTERN } from './config.js';

// Services (stats live da Google Sheet via JSONP)
import { fetchSheetStatsJSONP } from './services.js';

// Shell UI
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';

// Pagine
import Home from './pages/Home.jsx';
import Beneficiary from './pages/Beneficiary.jsx';
import Bike from './pages/Bike.jsx';
import Soccer from './pages/Soccer.jsx';
import Run from './pages/Run.jsx';
import Donate from './pages/Donate.jsx';
import ConfirmPayment from './pages/ConfirmPayment.jsx';

export default function App() {
  const { addPledge, markPledgePaid, addRegistration, derived } = useDB();
  const [route, navigate] = useRoute();

  // stats remote (raccolta fondi / team / iscritti), aggiornate ogni 60s
  const [remoteStats, setRemoteStats] = useState(null);
  useEffect(() => {
    const load = () => fetchSheetStatsJSONP().then(setRemoteStats).catch(() => {});
    load();
    const id = setInterval(load, 60000);
    const onVis = () => { if (!document.hidden) load(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  // router minimale (hash)
  const page = route || 'home';

  return (
    <div className="min-h-screen text-slate-900 relative">
      {/* pattern di sfondo */}
      <div
        className="fixed inset-0 -z-20"
        style={{ backgroundImage: PALESTINE_PATTERN, backgroundSize: '80px 80px' }}
      />
      {/* velo bianco per contrasto */}
      <div className="fixed inset-0 -z-10 bg-white/90" />

      <Nav navigate={navigate} />

      {page === 'donate' ? (
        <Donate addPledge={addPledge} navigate={navigate} markPledgePaid={markPledgePaid} />
      ) : page.startsWith('confirm') ? (
        <ConfirmPayment markPledgePaid={markPledgePaid} />
      ) : page === 'beneficiary' ? (
        <Beneficiary />
      ) : page === 'bike' ? (
        <Bike addRegistration={addRegistration} navigate={navigate} />
      ) : page === 'soccer' ? (
        <Soccer addRegistration={addRegistration} navigate={navigate} remoteStats={remoteStats} />
      ) : page === 'run' ? (
        <Run addRegistration={addRegistration} navigate={navigate} remoteStats={remoteStats} />
      ) : (
        <Home navigate={navigate} derived={derived} remoteStats={remoteStats} />
      )}

      <Footer />
    </div>
  );
}

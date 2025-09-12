import React from 'react';
import { useDB } from './hooks/useDB.js';
import { useRoute } from './hooks/useRoute.js';
import { PALESTINE_PATTERN } from './config.js';

import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import Beneficiary from './pages/Beneficiary.jsx';
import Bike from './pages/Bike.jsx';
import Soccer from './pages/Soccer.jsx';
import Run from './pages/Run.jsx';
import Donate from './pages/Donate.jsx';
import ConfirmPayment from './pages/ConfirmPayment.jsx';
import Registration from './pages/Registration.jsx';

export default function App() {
  const { addPledge, markPledgePaid, addRegistration, derived } = useDB();
  const [route, navigate] = useRoute();

  const page = route || 'home';

  return (
    <div className="min-h-screen text-slate-900 relative">
      <div className="fixed inset-0 -z-20" style={{ backgroundImage: PALESTINE_PATTERN, backgroundSize: '80px 80px' }} />
      <div className="fixed inset-0 -z-10 bg-white/90" />

      <Nav navigate={navigate} />

      {page === 'registration' ? (
        <Registration navigate={navigate} />
      ) : page === 'donate' ? (
        <Donate addPledge={addPledge} navigate={navigate} markPledgePaid={markPledgePaid} />
      ) : page.startsWith('confirm') ? (
        <ConfirmPayment markPledgePaid={markPledgePaid} />
      ) : page === 'beneficiary' ? (
        <Beneficiary />
      ) : page === 'bike' ? (
        <Bike addRegistration={addRegistration} navigate={navigate} />
      ) : page === 'soccer' ? (
        <Soccer addRegistration={addRegistration} navigate={navigate} />
      ) : page === 'run' ? (
        <Run addRegistration={addRegistration} navigate={navigate} />
      ) : (
        <Home navigate={navigate} derived={derived} />
      )}

      <Footer />
    </div>
  );
}

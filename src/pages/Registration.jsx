import React from 'react';
import { EVENT_CONFIG } from '../config.js';
import GradientHeader from '../components/GradientHeader.jsx';

const Registration = ({ navigate }) => {
  return (
    <>
      <GradientHeader
        title="Iscrizione all'evento"
        subtitle="Partecipa e sostieni l'iniziativa"
        chips={[`Data: ${EVENT_CONFIG.date}`, `Luogo: ${EVENT_CONFIG.location}`]}
      />
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h2 className="text-xl font-semibold">Cos'è Move for Gaza</h2>
            <p className="mt-2 text-slate-700">
              (Inseriremo qui il testo finale dell'evento: missione, destinatari, modalità.)
            </p>
          </section>
          <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h3 className="text-lg font-semibold">Iscriviti allo sport</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              <a onClick={(e)=>{e.preventDefault();navigate('bike')}} href="#/bike"
                 className="inline-flex items-center rounded-xl px-4 py-2 font-semibold text-white"
                 style={{ backgroundColor: '#000' }}>
                 Iscriviti – Bici
              </a>
              <a onClick={(e)=>{e.preventDefault();navigate('soccer')}} href="#/soccer"
                 className="inline-flex items-center rounded-xl px-4 py-2 font-semibold text-white"
                 style={{ backgroundColor: '#000' }}>
                 Iscriviti – Calcio
              </a>
              <a onClick={(e)=>{e.preventDefault();navigate('run')}} href="#/run"
                 className="inline-flex items-center rounded-xl px-4 py-2 font-semibold text-white"
                 style={{ backgroundColor: '#000' }}>
                 Iscriviti – Corsa
              </a>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Le tre pagine restano attive ma non compaiono nel menu.
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default Registration;

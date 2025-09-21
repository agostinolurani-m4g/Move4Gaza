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
            <h2 className="text-xl font-semibold">Move4Gaza</h2>
            <p className="mt-2 text-slate-700">
              {EVENT_CONFIG.descrizione_evento_concreto}
            </p>
          </section>
          <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h2 className="text-xl font-semibold">Ride4Gaza</h2>
            <p className="mt-2 text-slate-700">
              {EVENT_CONFIG.descrizione_bici}
            </p>
          </section>
          <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h2 className="text-xl font-semibold">Play4Gaza</h2>
            <p className="mt-2 text-slate-700">
              {EVENT_CONFIG.descrizione_calcio}
            </p>
          </section>
          <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h2 className="text-xl font-semibold">Run4Gaza</h2>
            <p className="mt-2 text-slate-700">
              {EVENT_CONFIG.descrizione_corsa}
            </p>
          </section>
          <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h3 className="text-lg font-semibold">Iscriviti allo sport</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              <a onClick={(e)=>{e.preventDefault();navigate('bike')}} href="#/bike"
                 className="inline-flex bg-green-700 items-center rounded-xl px-4 py-2 font-semibold text-black"
                 style={{ backgroundColor: '#009739' }}>
                 Iscriviti – Bici
              </a>
              <a onClick={(e)=>{e.preventDefault();navigate('soccer')}} href="#/soccer"
                 className="inline-flex bg-green-700 items-center rounded-xl px-4 py-2 font-semibold text-black"
                 style={{ backgroundColor: '#009739' }}>
                 Iscriviti – Calcio
              </a>
              <a onClick={(e)=>{e.preventDefault();navigate('run')}} href="#/run"
                 className="inline-flex bg-green-700 items-center rounded-xl px-4 py-2 font-semibold text-black"
                 style={{ backgroundColor: '#009739' }}>
                 Iscriviti – Corsa
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Registration;

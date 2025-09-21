import React, { useEffect, useState } from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { fetchRecentDonationsJSONP } from '../services.js';
import Hero from '../components/Hero.jsx';
import FAQSection from '../components/FAQSection.jsx';
import { fetchRegistrationsJSONP } from '../services.js';

fetchRegistrationsJSONP('reg_bike', 500).then((data) => {
  console.log('Fetched bike registrations:', data);
});
fetchRegistrationsJSONP('reg_run', 500).then((data) => {
  console.log('Fetched bike registrations:', data);
});
fetchRegistrationsJSONP('reg_soccer', 500).then((data) => {
  console.log('Fetched bike registrations:', data);
});

// Home page showing the event overview, live stats, activities and FAQs.
const Home = ({ navigate, derived, remoteStats }) => {
  const [recentPaid, setRecentPaid] = useState([]);
  // Poll recent donations to show a live ticker of paid pledges.
  useEffect(() => {
    const load = () => {
      fetchRecentDonationsJSONP(6)
        .then(setRecentPaid)
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Hero navigate={navigate} />
      {/* Stats section overlapping the hero */}
      <section className="-mt+10 relative z-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              label: 'Soldi raccolti',
              value: formatCurrency(
                remoteStats?.totals?.raised ?? derived.raised,
                EVENT_CONFIG.currency,
              ),
            },
            {
              label: 'Iscritti bici',
              value: remoteStats?.totals?.riders ?? derived.riders,
            },
            {
              label: 'Squadre calcio',
              value: remoteStats?.totals?.teamsSoccer ?? derived.teamsSoccer,
            },
            {
              label: 'Squadre corsa',
              value: remoteStats?.totals?.teamsRun ?? derived.teamsRun,
            },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/10"
            >
              <p className="text-sm text-slate-600">{s.label}</p>
              <p
                className="mt-1 text-2xl font-extrabold"
                style={{ color: THEME.primary }}
              >
                {String(s.value)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Cause and participation instructions */}
      <section className="mt-10 py-10 bg-green-700 text-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-black">
              {EVENT_CONFIG.cause.heading}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-black">
              {EVENT_CONFIG.cause.text}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10 text-black">
            <h3 className="text-lg font-semibold">Come partecipare</h3>
            <ol className="mt-2 text-sm list-decimal pl-5 space-y-1">
              <li>
                Iscriviti a{' '}
                <a
                  href="#/bike"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('bike');
                  }}
                  className="underline"
                >
                  Bici
                </a>
                ,{' '}
                <a
                  href="#/soccer"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('soccer');
                  }}
                  className="underline"
                >
                  Calcio
                </a>{' '}
                o{' '}
                <a
                  href="#/run"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('run');
                  }}
                  className="underline"
                >
                  Corsa
                </a>
                .
              </li>
              <li>
                Se vuoi, registra una donazione da <strong>20 €</strong> o più in{' '}
                <a
                  href="#/donate"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('donate');
                  }}
                  className="underline"
                >
                  Donazioni
                </a>
                .
              </li>
              <li>
                Arrivo al <strong>centro sportivo</strong>: cibo, interventi, focus;{' '}
                <strong>parcheggio bici sicuro</strong> e{' '}
                <strong>spogliatoi</strong>.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Activities section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Attività</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            <a
              href="#/bike"
              onClick={(e) => {
                e.preventDefault();
                navigate('bike');
              }}
              className="rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
              style={{ backgroundColor: THEME.primary, color: 'white' }}
            >
              <h3 className="text-xl font-semibold text-black">Giro in bici</h3>
              <p className="mt-2 text-sm text-black">
                Tracciato che ricalca forma e larghezza della Striscia di Gaza. Ritmo
                sociale, non competitivo. 
              </p>
              <div
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold "
                style={{ color: THEME.ink }}
              >
                Dettagli & iscrizione →
              </div>
            </a>
            <a
              href="#/bike"
              onClick={(e) => {
                e.preventDefault();
                navigate('bike');
              }}
              className="rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
              style={{ backgroundColor: THEME.primary, color: 'white' }}
            >
              <h3 className="text-xl font-semibold text-black">Giro cittadino in bici</h3>
              <p className="mt-2 text-sm text-black">
                Tracciato di 20 km sul naviglio grande e per campi per raggiungere l'evento all'Arci Olmi. 
              </p>
              <div
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold "
                style={{ color: THEME.ink }}
              >
                Dettagli & iscrizione →
              </div>
            </a>
            <a
              href="#/soccer"
              onClick={(e) => {
                e.preventDefault();
                navigate('soccer');
              }}
              className="rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
              style={{ backgroundColor: THEME.primary, color: 'white' }}
            >
              <h3 className="text-xl font-semibold text-black">Torneo di calcio</h3>
              <p className="mt-2 text-sm text-black">
                5 vs 5 per l'inclusione. 4 partite da 15'. Aperto a tuttə.
              </p>
              <div
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: THEME.ink }}
              >
                Dettagli & iscrizione →
              </div>
            </a>
            <a
              href="#/run"
              onClick={(e) => {
                e.preventDefault();
                navigate('run');
              }}
              className="rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
              style={{ backgroundColor: THEME.primary, color: 'white' }}
            >
              <h3 className="text-xl font-semibold text-black">Corsa a squadre</h3>
              <p className="mt-2 text-sm text-black">
                Corsa non competitiva di 14 km da fare singolarmente o in squadra (staffetta), partenza e arrivo all'Arci Olmi.
              </p>
              <div
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: THEME.ink }}
              >
                Dettagli & iscrizione →
              </div>
            </a>
          </div>

          {EVENT_CONFIG.beneficiary && (
            <div className="mt-8 rounded-2xl p-6 shadow ring-1 ring-black/10"
                 style={{ backgroundColor: THEME.primary }}>
              <h3 className="text-lg font-semibold">Beneficiario</h3>
              <p className="mt-1 text-sm text-black">
                {EVENT_CONFIG.beneficiary.blurb}
              </p>
              <p className="mt-2 text-sm">
                <a
                  className="underline"
                  href={EVENT_CONFIG.beneficiary.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {EVENT_CONFIG.beneficiary.name}
                </a>{' '}
                {EVENT_CONFIG.beneficiary.cf ? (
                  <>— {EVENT_CONFIG.beneficiary.cf}</>
                ) : null}
              </p>
            </div>
          )}
        </div>

        {/* Live donations */}
        <section className="mt-10 py-10">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Donazioni LIVE</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentPaid.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-slate-200 p-4 bg-white shadow-sm"
                >
                  <p className="text-sm text-slate-600">
                    {new Date(p.paidAt || p.createdAt).toLocaleString('it-IT')}
                  </p>
                  <p className="font-semibold mt-1">{p.name || 'Anonimo'}</p>
                  <p className="text-sm">
                    {p.teamName ? `Squadra: ${p.teamName}` : '—'}
                  </p>
                  <p className="mt-2 text-emerald-700 font-bold">
                    {formatCurrency(p.amount, EVENT_CONFIG.currency)}
                  </p>
                </div>
              ))}
              {recentPaid.length === 0 && (
                <p className="text-sm text-black">
                  Nessuna donazione recente.
                </p>
              )}
            </div>
          </div>
        </section>

        <FAQSection navigate={navigate} />
      </section>
    </>
  );
};

export default Home;

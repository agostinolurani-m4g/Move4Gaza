import React, { useState } from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';
import GradientHeader from '../components/GradientHeader.jsx';
import GPXMap from '../components/GPXMap.jsx';
import { postSheet } from '../services.js';
import { fetchRegistrationsJSONP } from '../services.js';

fetchRegistrationsJSONP('bike', 500).then((data) => {
  console.log('Fetched bike registrations:', data);
});

// Registration form and route details for the bike event.
const Bike = ({ addRegistration, navigate }) => {
  const [level, setLevel] = useState('Principiante');
  const [distance, setDistance] = useState('112');

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const plain = Object.fromEntries(fd.entries());
    const saved = addRegistration('bike', plain);
    postSheet('reg_bike', saved);
    e.currentTarget.reset();
    alert(
      'Iscrizione bici registrata. Puoi donare quando vuoi dalla pagina Donazioni.',
    );
    navigate('');
  };

  return (
    <>
      <GradientHeader
        title="Ride 4 Gaza"
        subtitle="Tracciato in scala reale che ricalca forma e lunghezza della Striscia di Gaza, con lo scopo 
        di sensibilizzare le persone sulla situazione umanitaria e politica della regione, rendendo 
        tangibile le reali dimensioni di Gaza."
        chips={[
          `Data: ${EVENT_CONFIG.date}`,
          `Luogo: ${EVENT_CONFIG.location}`,
          'Manifestazione silenziosa e pacifica',
        ]}
      />
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Route selection and map */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Percorso</h2>
            <div className="mb-3 inline-flex rounded-2xl ring-1 ring-black/10 bg-white overflow-hidden">
              {EVENT_CONFIG.bike.distances.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setDistance(d.key)}
                  className={`px-4 py-2 text-sm font-medium ${
                    distance === d.key ? 'bg-emerald-50' : ''
                  }`}
                  style={
                    distance === d.key ? { color: THEME.primary } : undefined
                  }
                >
                  {d.label}
                </button>
              ))}
            </div>
            <GPXMap
              src={EVENT_CONFIG.routes.bike[distance]?.gpx}
              label={
                distance === '112'
                  ? 'Il tracciato 112 km ricalca forma e larghezza della Striscia di Gaza.'
                  : 'Percorso 20 km cittadino, ritmo sociale.'
              }
              downloadName={
                distance === '112' ? 'bike-112.gpx' : 'bike-20.gpx'
              }
            />
            <div className="mt-3 text-sm">
              {EVENT_CONFIG.routes.bike[distance]?.stravaRouteId && (
                <iframe
                  title="Strava route"
                  height="405"
                  width="100%"
                  frameBorder="0"
                  allowTransparency
                  scrolling="no"
                  src={`https://www.strava.com/routes/${EVENT_CONFIG.routes.bike[distance].stravaRouteId}/embed`}
                />
              )}
              {EVENT_CONFIG.routes.bike[distance]?.stravaSegmentUrl && (
                <p className="mt-2">
                  Segmento Strava:{' '}
                  <a
                    className="underline"
                    href={EVENT_CONFIG.routes.bike[distance].stravaSegmentUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    apri su Strava
                  </a>
                </p>
              )}
            </div>

            <p className="mt-2 text-xs text-slate-600">
              112 km: ricalca forma e larghezza della Striscia di Gaza. 20 km: cittadino, ritmo sociale.
            </p>
          </div>

          {/* Registration info and donation notice */}
          <aside className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h3 className="font-semibold">Iscrizione</h3>
            <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
              <li>
                <strong>Per iscriversi è necessaria una donazione</strong> (min. 20 €).
              </li>
              <li className="text-red-600">
                <strong>Il pranzo NON è incluso</strong>.
              </li>
              <li>
                Donazione consigliata: <strong>≥ 20 €</strong>.
              </li>
            </ul>
            <div className="mt-3 flex gap-2">
              <a
                href="#/donate"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('donate');
                }}
                className="rounded-xl px-4 py-2 font-semibold text-white"
                style={{ backgroundColor: THEME.primary }}
              >
                Vai a donazioni
              </a>
            </div>
            <p className="mt-3 text-xs text-slate-600">
              Donazioni destinate a{' '}
              <a
                className="underline"
                href={EVENT_CONFIG.beneficiary.url}
                target="_blank"
                rel="noreferrer"
              >
                {EVENT_CONFIG.beneficiary.name}
              </a>
              .
            </p>
          </aside>
        </div>
      </section>
      {/* Registration form */}
      <section className="py-2">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h2 className="text-lg font-semibold">Modulo — Bici (individuale)</h2>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Nome</label>
                  <input
                    name="name"
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Cognome</label>
                  <input
                    name="surname"
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Telefono</label>
                  <input
                    type="tel"
                    name="phone"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Squadra (opz.)</label>
                  <input
                    name="teamName"
                    placeholder="nome squadra (se vuoi)"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  className="rounded-xl px-4 py-2 font-semibold text-white"
                  style={{ backgroundColor: THEME.primary }}
                >
                  Invia iscrizione
                </button>
              </div>
              <input type="hidden" name="distance" value={distance} />
            </form>
          </div>
          <div className="mt-6">
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                navigate('');
              }}
              className="text-sm font-semibold"
              style={{ color: THEME.primary }}
            >
              ← Torna alla home
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Bike;

import React, { useState, useEffect } from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';
import GradientHeader from '../components/GradientHeader.jsx';
import GPXMap from '../components/GPXMap.jsx';
import PaymentOptions from '../components/PaymentOptions.jsx';
import { postSheet, fetchTopTeamsJSONP } from '../services.js';
import { formatCurrency } from '../utils/formatCurrency.js';
const MIN_PER_PERSON = 15;
const Run = ({ addRegistration, navigate, remoteStats }) => {
  const [members, setMembers] = useState(4);
  const [topTeams, setTopTeams] = useState([]);useEffect(() => {
    const load = () => {
      fetchTopTeamsJSONP('run', 5)
        .then(setTopTeams)
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  const teamsNow = remoteStats?.totals?.teamsRun ?? 0;
  const runFull = 100 >= 50;

  // Donazione: 20 €/personaconst normalizedMembers = Math.min(10, Math.max(3, Number(members) || 3));// Dati percorso (per banner a sinistra)
  const route = EVENT_CONFIG?.routes?.run || {};
  const meta = route.meta || {};
  const lengthVal =
    meta.length || meta.distance || meta.distanceKm || meta.distance_km|| route.distance;
  const elevVal = meta.elevation || meta.elevationM || meta.elevation_m;
  const startVal = route.start || meta.start || EVENT_CONFIG?.run?.start || EVENT_CONFIG?.locationStart;
  const finishVal = meta.finish || EVENT_CONFIG?.run?.finish || EVENT_CONFIG?.locationFinish;
  const timeVal =
    route.time || meta.time ||
    (meta.startTime && meta.endTime ? `${meta.startTime} – ${meta.endTime}` : EVENT_CONFIG?.run?.time);

  const fmtLen = typeof lengthVal === 'number' ? `${lengthVal} km` : (lengthVal || '—');
  const fmtElev = typeof elevVal === 'number' ? `${elevVal} m D+` : (elevVal || '—');

  const submit = (e) => {
    e.preventDefault();
    if (runFull) return;

    const fd = new FormData(e.currentTarget);
    const count = Number(fd.get('count') || members || 3);
    const runners = Array.from({ length: count }, (_, i) => fd.get(`runner_${i + 1}`)).filter(Boolean);
    const rec = Object.fromEntries(fd.entries());
    delete rec.count;

    const saved = addRegistration('run', {
      ...rec,
      runners,
      count,
    });

    postSheet('reg_run', saved);
    alert('Squadra corsa registrata. Grazie per la donazione!');
    navigate('');
  };
return (
    <>
      <GradientHeader
        title="Run4Gaza"
        subtitle="Corsa singola o staffetta di 7 o 14 km"
        chips={[
          `Data: ${EVENT_CONFIG.date}`,
          'Partenza e Arrivo: Arci Olmi'
        ]}
      />

      {/* DESCRIZIONE EVENTO (prima della mappa) */}
      <section className="py-4">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/10">
            <h2 className="text-lg font-semibold">Descrizione evento</h2>
            <p className="mt-2 text-sm sm:text-base text-black/80 leading-relaxed">
              {EVENT_CONFIG?.descrizione_corsa ||
                EVENT_CONFIG?.run?.description ||
                'Manifestazione silenziosa e pacifica aperta a tuttə. Percorso adatto a gruppi e staffette.'}
            </p>
          </div>
        </div>
      </section>

      {/* MAPPA FULL-WIDTH con banner a sinistra */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Banner info percorso (sinistra) */}
            <aside className="order-2 lg:order-1 lg:col-span-1 rounded-2xl bg-white p-5 shadow ring-1 ring-black/10">
              <h3 className="font-semibold">Info percorso</h3>
              <ul className="mt-2 text-sm space-y-1">
                <li><span className="font-medium">Lunghezza:</span> {fmtLen}</li>
                <li><span className="font-medium">Partenza e Arrivo:</span> {startVal || '—'}</li>
                <li><span className="font-medium">Orari:</span> {timeVal || '—'}</li>
              </ul>
              <div className="mt-3 flex gap-2">
                {route.gpx && (
                  <a
                    href={route.gpx}
                    download="run.gpx"
                    className="rounded-xl px-4 py-2 font-semibold text-white"
                    style={{ backgroundColor: THEME.primary }}
                  >
                    Scarica GPX
                  </a>
                )}
                {route.stravaRouteId && (
                  <a
                    className="rounded-xl px-4 py-2 font-semibold ring-1 ring-black/10"
                    href={`https://www.strava.com/routes/${route.stravaRouteId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Apri su Strava
                  </a>
                )}
              </div>
            </aside>

            {/* Mappa grande (destra) */}
            <div className="order-1 lg:order-2 lg:col-span-3 rounded-2xl bg-white p-3 shadow ring-1 ring-black/10">
              <h2 className="text-xl font-semibold mb-2">Mappa</h2>
              <GPXMap
                src={route.gpx}
                label="Manifestazione silenziosa e pacifica."
                downloadName="run.gpx"
              />
              {/* Embed Strava opzionale */}
              <div className="mt-3 text-sm">
                {route.stravaRouteId && (
                  <iframe
                    title="Strava route"
                    height="405"
                    width="100%"
                    frameBorder="0"
                    allowTransparency
                    scrolling="no"
                    src={`https://www.strava.com/routes/${route.stravaRouteId}/embed`}
                  />
                )}
                {route.stravaSegmentUrl && (
                  <p className="mt-2">
                    Segmento Strava:{' '}
                    <a
                      className="underline"
                      href={route.stravaSegmentUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      apri su Strava
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM ISCRIZIONE + DONAZIONE (solo qui sotto) */}

      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h2 className="text-lg font-semibold">Iscrizione — Corsa singola</h2>
            {runFull && (
              <p className="mt-2 text-sm text-red-600">
                <strong>Limite iscrizioni raggiunto</strong>. Puoi venire direttamente domani al campo!!! Arci Olmi, via degli ulivi 2!!
              </p>
            )}
            <p className="mt-2 text-sm">
              <strong>Donazione propedeutica all’iscrizione</strong> (min. 15 €/persona).{' '}
              <span className="text-red-600">Il pranzo non è incluso.</span>
            </p>

            <form onSubmit={submit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Nome e cognome</label>
                <input
                  name="name"
                  required
                  disabled={runFull}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  disabled={runFull}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Telefono</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  disabled={runFull}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Distanza</label>
                <select
                  name="distance"
                  required
                  disabled={runFull}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                >
                  <option value="7">7 km (singola)</option>
                  <option value="14">14 km (singolo)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Partecipi in staffetta?</label>
                <select
                  name="staffetta"
                  required
                  disabled={runFull}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                >
                  <option value="no">No</option>
                  <option value="si">Sì</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Nome squadra (opzionale)</label>
                <input
                  name="teamName"
                  disabled={runFull}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                  placeholder="Se partecipi in staffetta"
                />
              </div>
              <div className="self-end text-sm md:col-span-2">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="waiver" required disabled={runFull} />
                  <span>Dichiaro idoneità fisica.</span>
                </label>
              </div>

              {!runFull && (
                <div className="md:col-span-2 mt-2 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
                  <h3 className="text-sm sm:text-base font-semibold">Donazione obbligatoria per iscriversi</h3>
                  <p className="mt-1 text-xs sm:text-sm">
                    Minimo <strong>{MIN_PER_PERSON} €</strong> a persona.
                  </p>
                  <p className="mt-3"></p>
                  <PaymentOptions />
                </div>
              )}

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={runFull}
                  className="flex-1 rounded-xl px-4 py-2 font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: THEME.primary }}
                >
                  {runFull ? 'Iscrizioni chiuse (pieno)' : 'Invia iscrizione'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('donate')}
                  className="flex-1 text-center rounded-xl bg-white px-4 py-2 font-semibold ring-1 ring-black/10 hover:bg-slate-50"
                >
                  Fai una donazione
                </button>
              </div>
            </form>
          </div>
          

          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate('')}
              className="text-sm font-semibold"
              style={{ color: THEME.primary }}
            >
              ← Torna alla home
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Run;

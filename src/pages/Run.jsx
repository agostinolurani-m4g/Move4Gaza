import React, { useState, useEffect } from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';
import GradientHeader from '../components/GradientHeader.jsx';
import GPXMap from '../components/GPXMap.jsx';
import { postSheet, fetchTopTeamsJSONP } from '../services.js';
import { formatCurrency } from '../utils/formatCurrency.js';

// Registration and map for the group run. Shows the GPX route,
// handles team sign‑up and displays top teams by donations. Accepts
// optional remoteStats to determine if the run is full. Navigates back
// home or to the donate page as appropriate.
const Run = ({ addRegistration, navigate, remoteStats }) => {
  // Team size for the run: minimum 3, maximum 10. Defaults to 4.
  const [members, setMembers] = useState(4);
  // Leaderboard data for top teams. Refreshed every minute.
  const [topTeams, setTopTeams] = useState([]);
  useEffect(() => {
    const load = () => {
      fetchTopTeamsJSONP('run', 5)
        .then(setTopTeams)
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  // Determine if the run has reached its team limit.
  const teamsNow = remoteStats?.totals?.teamsRun ?? 0;
  const runFull = teamsNow >= (EVENT_CONFIG.limits?.runTeamsMax || Infinity);

  // Handle submission of the registration form. Extract runner names,
  // persist via addRegistration and notify the user.
  const submit = (e) => {
    e.preventDefault();
    if (runFull) return;
    const fd = new FormData(e.currentTarget);
    const count = Number(fd.get('count') || members || 3);
    const runners = Array.from({ length: count }, (_, i) => fd.get(`runner_${i + 1}`)).filter(Boolean);
    const rec = Object.fromEntries(fd.entries());
    delete rec.count;
    const saved = addRegistration('run', { ...rec, runners, count });
    postSheet('reg_run', saved);
    alert('Squadra corsa registrata. Grazie! (Ricorda: donazione propedeutica all’iscrizione)');
    navigate('');
  };

  return (
    <>
      <GradientHeader
        title="Corsa a squadre — Manifestazione"
        subtitle="Silenziosa e pacifica, partenza dal Duomo"
        chips={[
          `Data: ${EVENT_CONFIG.date}`,
          'Partenza: Duomo di Milano',
          'Arrivo: Centro sportivo',
          'Donazione consigliata: 20 €',
        ]}
      />

      {/* Map and description */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Mappa</h2>
            <GPXMap
              src={EVENT_CONFIG.routes.run.gpx}
              label="Manifestazione silenziosa e pacifica, partenza dal Duomo."
              downloadName="run.gpx"
            />
            <div className="mt-3 text-sm">
              {EVENT_CONFIG.routes.run.stravaRouteId && (
                <iframe
                  title="Strava route"
                  height="405"
                  width="100%"
                  frameBorder="0"
                  allowTransparency
                  scrolling="no"
                  src={`https://www.strava.com/routes/${EVENT_CONFIG.routes.run.stravaRouteId}/embed`}
                />
              )}
              {EVENT_CONFIG.routes.run.stravaSegmentUrl && (
                <p className="mt-2">
                  Segmento Strava:{' '}
                  <a
                    className="underline"
                    href={EVENT_CONFIG.routes.run.stravaSegmentUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    apri su Strava
                  </a>
                </p>
              )}
            </div>
          </div>

          <aside className="lg:col-span-1 rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h3 className="font-semibold">Iscrizione</h3>
            <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
              <li>
                <strong>Donazione propedeutica all’iscrizione</strong> (min. 20 € a persona).
              </li>
              <li className="text-red-600">
                <strong>Il pranzo NON è incluso</strong>.
              </li>
            </ul>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => navigate('donate')}
                className="rounded-xl px-4 py-2 font-semibold text-white"
                style={{ backgroundColor: THEME.primary }}
              >
                Vai a donazioni
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* Registration form */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h2 className="text-lg font-semibold">Iscrizione — Corsa (squadra)</h2>
            {runFull && (
              <p className="mt-2 text-sm text-red-600">
                <strong>Limite squadre raggiunto</strong>. Tieni d’occhio questa pagina per eventuali riaperture.
              </p>
            )}
            <p className="mt-2 text-sm">
              <strong>Donazione propedeutica all’iscrizione</strong> (min. 20 €/persona).{' '}
              <span className="text-red-600">Il pranzo non è incluso.</span>
            </p>
            <form onSubmit={submit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium">Nome squadra</label>
                <input
                  name="teamName"
                  required
                  disabled={runFull}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium">Instagram squadra (opz.)</label>
                <input
                  name="instagram"
                  placeholder="https://instagram.com/tuasquadra"
                  disabled={runFull}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Referente</label>
                <input
                  name="captain"
                  required
                  disabled={runFull}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email referente</label>
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
                  disabled={runFull}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">N. componenti</label>
                <input
                  type="number"
                  name="count"
                  min={3}
                  max={10}
                  value={members}
                  onChange={(e) => setMembers(Number(e.target.value))}
                  disabled={runFull}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[...Array(Math.min(10, Math.max(3, members)))].map((_, i) => (
                  <div key={i}>
                    <label className="block text-xs font-medium">Runner {i + 1}</label>
                    <input
                      name={`runner_${i + 1}`}
                      disabled={runFull}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                  </div>
                ))}
              </div>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Rif. donazione (opz.)</label>
                  <input
                    name="donationRef"
                    placeholder="email o ID ricevuta"
                    disabled={runFull}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div className="self-end text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" name="waiver" required disabled={runFull} />
                    <span>Dichiaro idoneità fisica dei partecipanti.</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={runFull}
                  className="flex-1 rounded-xl px-4 py-2 font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: THEME.primary }}
                >
                  {runFull ? 'Iscrizioni chiuse (pieno)' : 'Invia iscrizione squadra'}
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

          {/* Top teams by donations */}
          <div className="mt-6 rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
            <h3 className="font-semibold">Top squadre per donazioni</h3>
            {topTeams.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">Ancora nessuna squadra in classifica.</p>
            ) : (
              <ol className="mt-2 text-sm list-decimal pl-5 space-y-1">
                {topTeams.map((t, i) => (
                  <li key={i}>
                    <span className="font-medium">{t.teamName || '—'}</span> —{' '}
                    {formatCurrency(t.total, EVENT_CONFIG.currency)}
                  </li>
                ))}
              </ol>
            )}
          </div>
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
      </section>
    </>
  );
};

export default Run;
import React, { useState, useEffect } from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';
import GradientHeader from '../components/GradientHeader.jsx';
import GPXMap from '../components/GPXMap.jsx';
import { postSheet, fetchTopTeamsJSONP } from '../services.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import PayPalPayBox from '../components/PayPalPayBox.jsx';

const Run = ({ addRegistration, navigate, remoteStats }) => {
  const [members, setMembers] = useState(4);
  const [topTeams, setTopTeams] = useState([]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [orderId, setOrderId] = useState(null);

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

  const teamsNow = remoteStats?.totals?.teamsRun ?? 0;
  const runFull = teamsNow >= (EVENT_CONFIG.limits?.runTeamsMax || Infinity);

  // Donazione: 20 €/persona
  const MIN_PER_PERSON = 15;
  const normalizedMembers = Math.min(10, Math.max(3, Number(members) || 3));
  const requiredAmount = MIN_PER_PERSON * normalizedMembers;
  const donationOk = paidAmount >= requiredAmount;

  // Dati percorso (per banner a sinistra)
  const route = EVENT_CONFIG?.routes?.run || {};
  const meta = route.meta || {};
  const lengthVal =
    meta.length || meta.distance || meta.distanceKm || meta.distance_km;
  const elevVal = meta.elevation || meta.elevationM || meta.elevation_m;
  const startVal = meta.start || EVENT_CONFIG?.run?.start || EVENT_CONFIG?.locationStart;
  const finishVal = meta.finish || EVENT_CONFIG?.run?.finish || EVENT_CONFIG?.locationFinish;
  const timeVal =
    meta.time ||
    (meta.startTime && meta.endTime ? `${meta.startTime} – ${meta.endTime}` : EVENT_CONFIG?.run?.time);

  const fmtLen = typeof lengthVal === 'number' ? `${lengthVal} km` : (lengthVal || '—');
  const fmtElev = typeof elevVal === 'number' ? `${elevVal} m D+` : (elevVal || '—');

  const submit = (e) => {
    e.preventDefault();
    if (runFull) return;
    if (!donationOk) {
      alert('Completa prima la donazione per procedere con l’iscrizione.');
      return;
    }
    const fd = new FormData(e.currentTarget);
    const count = Number(fd.get('count') || members || 3);
    const runners = Array.from({ length: count }, (_, i) => fd.get(`runner_${i + 1}`)).filter(Boolean);
    const rec = Object.fromEntries(fd.entries());
    delete rec.count;

    const saved = addRegistration('run', {
      ...rec,
      runners,
      count,
      donation: { amount: paidAmount, orderId },
    });

    postSheet('reg_run', saved);
    alert('Squadra corsa registrata. Grazie per la donazione!');
    navigate('');
  };

  const pledge = {
    id: `run_${Date.now()}`,
    purpose: 'donation',
    amount: requiredAmount,
  };

  return (
    <>
      <GradientHeader
        title="Run4Gaza"
        subtitle="Corsa singola o staffetta di 14 km che corrisponde alla percentuale di territorio Palestinese non occupato da Israele"
        chips={[
          `Data: ${EVENT_CONFIG.date}`,
          'Partenza e Arrivo: Arci Olmi',
          'Donazione consigliata: 20 €',
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
                <li><span className="font-medium">Dislivello:</span> {fmtElev}</li>
                <li><span className="font-medium">Partenza:</span> {startVal || '—'}</li>
                <li><span className="font-medium">Arrivo:</span> {finishVal || '—'}</li>
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
                  <label className="block text-sm font-medium">Rif. donazione</label>
                  <input
                    name="donationRef"
                    placeholder="email o ID ricevuta"
                    value={orderId || ''}
                    readOnly
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

              {!runFull && (
                <div className="md:col-span-2 mt-2 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
                  <h3 className="text-sm sm:text-base font-semibold">Donazione obbligatoria per iscriversi</h3>
                  <p className="mt-1 text-xs sm:text-sm">
                    Minimo <strong>{MIN_PER_PERSON} €</strong> a persona. Con <strong>{normalizedMembers}</strong>{' '}
                    componenti l'importo richiesto è <strong>{requiredAmount} €</strong>.
                  </p>
                  <div className="mt-1 max-w-xs mx-auto">
                    <PayPalPayBox
                      compact
                      pledge={pledge}
                      onPaid={(amt, id) => {
                        setPaidAmount(Number(amt || 0));
                        setOrderId(id);
                      }}
                    />
                  </div>
                  <p className={`mt-1 text-xs ${donationOk ? 'text-green-700' : 'text-red-700'}`}>
                    {donationOk
                      ? `Donazione registrata: ${paidAmount} € (ID ordine: ${orderId || '—'})`
                      : `Donazione non ancora sufficiente: ${paidAmount} € su ${requiredAmount} €`}
                  </p>
                </div>
              )}

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={runFull || !donationOk}
                  className="flex-1 rounded-xl px-4 py-2 font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: THEME.primary }}
                >
                  {runFull
                    ? 'Iscrizioni chiuse (pieno)'
                    : donationOk
                    ? 'Invia iscrizione squadra'
                    : 'Completa la donazione per proseguire'}
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

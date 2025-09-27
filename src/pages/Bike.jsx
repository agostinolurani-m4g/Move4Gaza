import React, { useState } from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';
import GradientHeader from '../components/GradientHeader.jsx';
import GPXMap from '../components/GPXMap.jsx';
import { postSheet, fetchRegistrationsJSONP } from '../services.js';
import PayPalPayBox from '../components/PayPalPayBox.jsx';

fetchRegistrationsJSONP('bike', 500).then((data) => {
  console.log('Fetched bike registrations:', data);
});

const Bike = ({ addRegistration, navigate }) => {
  const [level, setLevel] = useState('Principiante');
  const [distance, setDistance] = useState('112');

  const [paidAmount, setPaidAmount] = useState(0);
  const [orderId, setOrderId] = useState(null);

  const MIN_PER_PERSON = 15;
  const requiredAmount = MIN_PER_PERSON;
  const donationOk = paidAmount >= requiredAmount;

  const submit = (e) => {
    e.preventDefault();
    if (!donationOk) {
      alert('Completa prima la donazione (min. 20 €) per procedere con l’iscrizione.');
      return;
    }
    const fd = new FormData(e.currentTarget);
    const plain = Object.fromEntries(fd.entries());
    const saved = addRegistration('bike', {
      ...plain,
      distance,
      donation: { amount: paidAmount, orderId },
    });
    postSheet('reg_bike', saved);
    e.currentTarget.reset();
    alert('Iscrizione bici registrata. Grazie per la donazione!');
    navigate('');
  };

  const pledge = {
    id: `bike_${Date.now()}`,
    purpose: 'donation',
    amount: requiredAmount,
  };

  // Dati route selezionata per banner sinistro
  const route = EVENT_CONFIG.routes.bike[distance] || {};
  const meta = route.meta || {};
  const fmtLen = typeof meta.distance === 'number' ? `${meta.distance} km` : (meta.distance || meta.length || '—');
  const fmtElev = typeof meta.elevation === 'number' ? `${meta.elevation} m D+` : (meta.elevation || '—');
  const startVal = meta.start || EVENT_CONFIG?.bike?.start || EVENT_CONFIG?.location;
  const finishVal = meta.finish || EVENT_CONFIG?.bike?.finish || EVENT_CONFIG?.location;
  const timeVal = meta.time || EVENT_CONFIG?.bike?.time || EVENT_CONFIG?.time;

  return (
    <>
      <GradientHeader
        title="Ride4Gaza"
        subtitle="Tracciato in scala reale che ricalca forma e lunghezza della Striscia di Gaza, con lo scopo 
        di sensibilizzare le persone sulla situazione umanitaria e politica della regione, rendendo 
        tangibile le reali dimensioni di Gaza."
        chips={[
          `Data: ${EVENT_CONFIG.date}`,
          `Luogo: ${EVENT_CONFIG.location}`,
          'Manifestazione silenziosa e pacifica',
        ]}
      />

      {/* Descrizione evento (coerente con Run) */}
      <section className="py-4">
        <div className="max-w-3xl mx-auto px-4">
          {(EVENT_CONFIG.descrizione_bici || EVENT_CONFIG.bike?.description) && (
            <div className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/10">
              <h2 className="text-lg font-semibold">Descrizione evento</h2>
              <p className="mt-2 text-sm sm:text-base text-black/80 leading-relaxed">
                {EVENT_CONFIG.descrizione_bici || EVENT_CONFIG.bike?.description}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Sezione mappa larga + banner sinistro con info e GPX */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Banner info percorso (sinistra) */}
          <aside className="lg:col-span-1 rounded-2xl bg-white p-5 shadow ring-1 ring-black/10">
            <h3 className="font-semibold">Info percorso</h3>
            <ul className="mt-2 text-sm space-y-1">
              <li><span className="font-medium">Lunghezza:</span> {fmtLen}</li>
              <li><span className="font-medium">Dislivello:</span> {fmtElev}</li>
              <li><span className="font-medium">Partenza:</span> {startVal || '—'}</li>
              <li><span className="font-medium">Arrivo:</span> {finishVal || '—'}</li>
              <li><span className="font-medium">Orari:</span> {timeVal || '—'}</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              {route.gpx && (
                <a
                  href={route.gpx}
                  download={distance === '112' ? 'bike-112.gpx' : 'bike-20.gpx'}
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

          {/* Colonna mappa & scelte (destra, grande) */}
          <div className="lg:col-span-3">
            {/* Route selection (resta) */}
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
                  style={distance === d.key ? { color: THEME.primary } : undefined}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-white p-3 shadow ring-1 ring-black/10">
              <GPXMap
                src={route?.gpx}
                label={
                  distance === '112'
                    ? 'Il tracciato 112 km ricalca forma e larghezza della Striscia di Gaza.'
                    : 'Percorso 20 km cittadino, ritmo sociale.'
                }
                downloadName={distance === '112' ? 'bike-112.gpx' : 'bike-20.gpx'}
              />
            </div>

            <div className="mt-3 text-sm">
              {route?.stravaRouteId && (
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
              {route?.stravaSegmentUrl && (
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

            <p className="mt-2 text-xs text-slate-600">
              112 km: ricalca forma e larghezza della Striscia di Gaza. 20 km: cittadino, ritmo sociale.
            </p>
          </div>

        </div>
      </section>

      {/* Form iscrizione (invariato, con gating donazione) */}
      <section className="py-2">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h2 className="text-lg font-semibold">Modulo — Bici (individuale)</h2>
            <p className="mt-2 text-sm">
              <strong>Donazione propedeutica all’iscrizione</strong> (minimo {MIN_PER_PERSON} €).{' '}
              <span className="text-red-600">Il pranzo non è incluso.</span>
            </p>

            <form onSubmit={submit} className="mt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Nome</label>
                  <input name="name" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Cognome</label>
                  <input name="surname" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input type="email" name="email" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Telefono</label>
                  <input type="tel" name="phone" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Squadra (opz.)</label>
                  <input name="teamName" placeholder="nome squadra (se vuoi)" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Riferimento donazione</label>
                  <input
                    name="donationRef"
                    placeholder="email o ID ricevuta"
                    value={orderId || ''} readOnly
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </div>
              </div>

              <div className="mt-2 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
                <h3 className="text-sm sm:text-base font-semibold">Donazione obbligatoria per iscriversi</h3>
                <p className="mt-1 text-xs sm:text-sm">
                  Minimo <strong>{MIN_PER_PERSON} €</strong>. Importo richiesto: <strong>{requiredAmount} €</strong>.
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

              <div className="flex gap-3">
                <button
                  className="rounded-xl px-4 py-2 font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: THEME.primary }}
                  type="submit"
                  disabled={!donationOk}
                >
                  {donationOk ? 'Invia iscrizione' : 'Completa la donazione per proseguire'}
                </button>
              </div>

              <input type="hidden" name="distance" value={distance} />
              <input type="hidden" name="level" value={level} />
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

import React, { useState, useEffect } from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';
import GradientHeader from '../components/GradientHeader.jsx';
import { postSheet, fetchTopTeamsJSONP } from '../services.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import PayPalPayBox from '../components/PayPalPayBox.jsx';

const Soccer = ({ addRegistration, navigate, remoteStats }) => {
  const [members, setMembers] = useState(6);
  const [topTeams, setTopTeams] = useState([]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const load = () => {
      fetchTopTeamsJSONP('soccer', 5).then(setTopTeams).catch(() => {});
    };
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  const teamsNow = remoteStats?.totals?.teamsSoccer ?? EVENT_CONFIG.soccer?.teamsCount ?? 0;
  const soccerMax = EVENT_CONFIG.limits?.soccerTeamsMax || Infinity;
  const soccerFull = teamsNow >= soccerMax;

  const MIN_PER_PERSON = 15;
  const MIN_PER_TEAM = 75;
  const normalizedMembers = Math.min(12, Math.max(5, Number(members) || 5));
  const requiredAmount = Math.max(MIN_PER_TEAM, MIN_PER_PERSON * normalizedMembers);
  const donationOk = paidAmount >= requiredAmount;

  const submit = (e) => {
    e.preventDefault();
    if (!donationOk) {
      alert("Completa prima la donazione per procedere con l'iscrizione.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const count = Number(fd.get('count') || members || 5);
    const players = Array.from({ length: count }, (_, i) => fd.get(`player_${i + 1}`)).filter(Boolean);
    const rec = Object.fromEntries(fd.entries());
    delete rec.count;
    const saved = addRegistration('soccer', { ...rec, players, count, donation: { amount: paidAmount, orderId } });
    postSheet('reg_soccer', saved);
    alert('Squadra calcio registrata. Potete donare quando volete.');
    navigate('');
  };

  const pledge = {
    id: `soccer_${Date.now()}`,
    purpose: 'donation',
    amount: requiredAmount,
  };

  // Meta torneo per banner sinistro
  const meta = EVENT_CONFIG?.soccer || {};
  const when = meta.time || EVENT_CONFIG?.time || '—';
  const where = EVENT_CONFIG?.location || '—';

  return (
    <>
      <GradientHeader
        title="Play 4 Gaza"
        subtitle="Torneo di calcio a 5, squadre miste, non competitivo"
        chips={[
          `Data: ${EVENT_CONFIG.date}`,
          `Luogo: ${EVENT_CONFIG.location}`,
          'Donazione consigliata: 20 €/persona',
        ]}
      />

      {/* Descrizione evento (prima del form) */}
      <section className="py-4">
        <div className="max-w-3xl mx-auto px-4">
          {(EVENT_CONFIG.descrizione_calcio || Number.isFinite(teamsNow)) && (
            <div className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/10">
              {EVENT_CONFIG.descrizione_calcio && (
                <p className="text-sm sm:text-base text-black/80 leading-relaxed">
                  {EVENT_CONFIG.descrizione_calcio}
                </p>
              )}
              {Number.isFinite(teamsNow) && (
                <p className="mt-2 text-sm sm:text-base">
                  <span className="font-semibold">Squadre iscritte:</span>{' '}
                  {soccerMax !== Infinity ? `${teamsNow} / ${soccerMax}` : teamsNow}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Layout ampio: banner sinistra + form destra */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Banner info torneo (sinistra) */}
          <aside className="lg:col-span-1 rounded-2xl bg-white p-5 shadow ring-1 ring-black/10">
            <h3 className="font-semibold">Info torneo</h3>
            <ul className="mt-2 text-sm space-y-1">
              <li><span className="font-medium">Data:</span> {EVENT_CONFIG.date}</li>
              <li><span className="font-medium">Luogo:</span> {where}</li>
              <li><span className="font-medium">Orario:</span> {when}</li>
              <li><span className="font-medium">Formato:</span> 5 vs 5 (misto)</li>
              <li><span className="font-medium">Min. donazione:</span> 20 €/persona — 100 €/squadra</li>
            </ul>
          </aside>

          {/* Card iscrizione (destra) */}
          <div className="lg:col-span-3 rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h2 className="text-lg font-semibold">Iscrizione — Calcio (squadra)</h2>
            {soccerFull && (
              <p className="mt-2 text-sm text-red-600">
                <strong>Limite squadre raggiunto</strong>. Tieni d’occhio questa pagina per eventuali riaperture.
              </p>
            )}
            <p className="mt-2 text-sm">
              <strong>Donazione propedeutica all’iscrizione</strong> (min. 20 €/persona - 100 €/squadra).{' '}
              <span className="text-red-600">Il pranzo non è incluso.</span>
            </p>

            {/* FORM */}
            <form onSubmit={submit} className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium">Nome squadra</label>
                <input name="teamName" required disabled={soccerFull}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Email capitanə</label>
                  <input
                    name="donationRef"
                    placeholder="email o ID ricevuta"
                    value={orderId || ''} readOnly disabled={soccerFull}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Referente (capitanə)</label>
                  <input name="captain" required disabled={soccerFull}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Telefono</label>
                  <input type="tel" name="phone" disabled={soccerFull}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">N. giocatori e giocatrici</label>
                  <input type="number" name="count" min={5} max={12} value={members}
                    onChange={(e) => setMembers(Number(e.target.value))}
                    disabled={soccerFull}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </div>
              </div>

              <div className="space-y-2">
                {[...Array(Math.min(12, Math.max(5, members)))].map((_, i) => (
                  <div key={i}>
                    <label className="block text-xs font-medium">Giocatorə {i + 1}</label>
                    <input name={`player_${i + 1}`} disabled={soccerFull}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                  </div>
                ))}
              </div>

              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" name="fairplay" required disabled={soccerFull} />
                <span>Accetto regolamento fair play.</span>
              </label>

              {/* DONAZIONE (come prima, solo impaginata) */}
              {!soccerFull && (
                <div className="mt-4 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
                  <h3 className="text-sm sm:text-base font-semibold">Donazione obbligatoria per iscriversi</h3>
                  <p className="mt-1 text-xs sm:text-sm">
                    Minimo <strong>{MIN_PER_PERSON} €</strong> a persona (min. squadra <strong>{MIN_PER_TEAM} €</strong>).
                    Con <strong>{normalizedMembers}</strong> componenti l'importo richiesto è <strong>{requiredAmount} €</strong>.
                  </p>
                  <div className="mt-1 max-w-xs mx-auto">
                    <PayPalPayBox
                      compact
                      pledge={pledge}
                      onPaid={(amt, id) => { setPaidAmount(Number(amt || 0)); setOrderId(id); }}
                    />
                  </div>
                  <p className={`mt-1 text-xs ${donationOk ? 'text-green-700' : 'text-red-700'}`}>
                    {donationOk
                      ? `Donazione registrata: ${paidAmount} € (ID ordine: ${orderId || '—'})`
                      : `Donazione non ancora sufficiente: ${paidAmount} € su ${requiredAmount} €`}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={soccerFull || !donationOk}
                  className="rounded-xl px-4 py-2 font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: THEME.primary }}
                >
                  {soccerFull
                    ? 'Iscrizioni chiuse (pieno)'
                    : donationOk
                    ? 'Invia iscrizione squadra'
                    : 'Completa la donazione per proseguire'}
                </button>
              </div>
            </form>
          </div>

          {/* Top teams (resta, solo posizione sotto) */}
          <div className="lg:col-span-4">
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

          <div className="lg:col-span-4">
            <button
              type="button"
              onClick={() => navigate('')}
              className="mt-6 text-sm font-semibold"
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

export default Soccer;

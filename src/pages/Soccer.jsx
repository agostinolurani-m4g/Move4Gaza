import React, { useState, useEffect } from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';
import GradientHeader from '../components/GradientHeader.jsx';
import { postSheet, fetchTopTeamsJSONP } from '../services.js';
import { formatCurrency } from '../utils/formatCurrency.js';

// Registration form and leaderboard for the 5‑a‑side soccer tournament.
// Accepts optional remoteStats to determine when the maximum number of teams
// has been reached. Uses the addRegistration helper to persist the team to
// local storage and Google Sheets. Provides navigation back to the home
// page or to the donate page.
const Soccer = ({ addRegistration, navigate, remoteStats }) => {
  // Number of players in the team. Defaults to 6 (5 + 1 reserve).
  const [members, setMembers] = useState(6);
  // Track the current leaderboard of top donor teams. Polls every 60s.
  const [topTeams, setTopTeams] = useState([]);
  useEffect(() => {
    const load = () => {
      fetchTopTeamsJSONP('soccer', 5)
        .then(setTopTeams)
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  // Calculate if the registration limit has been hit. Fallback to 0 if
  // remoteStats is undefined. Limits are defined in EVENT_CONFIG.limits.
  const teamsNow = remoteStats?.totals?.teamsSoccer ?? 0;
  const soccerFull = teamsNow >= (EVENT_CONFIG.limits?.soccerTeamsMax || Infinity);

  // Handle form submission. Collect the number of players, assemble an array
  // of provided names, and persist the registration. Afterwards display a
  // simple alert and return the user to the home page.
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const count = Number(fd.get('count') || members || 5);
    const players = Array.from({ length: count }, (_, i) => fd.get(`player_${i + 1}`)).filter(Boolean);
    const rec = Object.fromEntries(fd.entries());
    delete rec.count;
    const saved = addRegistration('soccer', { ...rec, players, count });
    postSheet('reg_soccer', saved);
    alert('Squadra calcio registrata. Potete donare quando volete.');
    navigate('');
  };

  return (
    <>
      <GradientHeader
        title="Torneo di calcio — 5 vs 5"
        subtitle="Inclusivo, aperto a tuttə, non competitivo"
        chips={[
          `Data: ${EVENT_CONFIG.date}`,
          `Luogo: ${EVENT_CONFIG.location}`,
          'Donazione consigliata: 20 €/persona',
        ]}
      />
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h2 className="text-lg font-semibold">Iscrizione — Calcio (squadra)</h2>
            {soccerFull && (
              <p className="mt-2 text-sm text-red-600">
                <strong>Limite squadre raggiunto</strong>. Tieni d’occhio questa pagina per eventuali riaperture.
              </p>
            )}
            <p className="mt-2 text-sm">
              <strong>Donazione propedeutica all’iscrizione</strong> (min. 20 €/persona).{' '}
              <span className="text-red-600">Il pranzo non è incluso.</span>
            </p>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium">Nome squadra</label>
                <input
                  name="teamName"
                  required
                  disabled={soccerFull}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Instagram (opz.)</label>
                  <input
                    name="instagram"
                    placeholder="https://instagram.com/tuasquadra"
                    disabled={soccerFull}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email/ID donazione (opz.)</label>
                  <input
                    name="donationRef"
                    placeholder="email o ID ricevuta"
                    disabled={soccerFull}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Referente (capitano)</label>
                  <input
                    name="captain"
                    required
                    disabled={soccerFull}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email referente</label>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={soccerFull}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Telefono</label>
                  <input
                    type="tel"
                    name="phone"
                    disabled={soccerFull}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">N. giocatori</label>
                  <input
                    type="number"
                    name="count"
                    min={5}
                    max={12}
                    value={members}
                    onChange={(e) => setMembers(Number(e.target.value))}
                    disabled={soccerFull}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                {[...Array(Math.min(12, Math.max(5, members)))].map((_, i) => (
                  <div key={i}>
                    <label className="block text-xs font-medium">Giocatore {i + 1}</label>
                    <input
                      name={`player_${i + 1}`}
                      disabled={soccerFull}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                  </div>
                ))}
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" name="fairplay" required disabled={soccerFull} />
                <span>Accetto regolamento fair play.</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={soccerFull}
                  className="rounded-xl px-4 py-2 font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: THEME.primary }}
                >
                  {soccerFull ? 'Iscrizioni chiuse (pieno)' : 'Invia iscrizione squadra'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('donate')}
                  className="rounded-xl px-4 py-2 font-semibold bg-white ring-1 ring-black/10 hover:bg-slate-50"
                >
                  Fai una donazione
                </button>
              </div>
            </form>

            {/* Leaderboard of top donor teams */}
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
        </div>
      </section>
    </>
  );
};

export default Soccer;
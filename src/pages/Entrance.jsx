import React from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';
import GradientHeader from '../components/GradientHeader.jsx';
import PaymentOptions from '../components/PaymentOptions.jsx';
import { postSheet, fetchRegistrationsJSONP } from '../services.js';
const MIN_PER_PERSON = 15;
const requiredAmount = 15;
// Precarico (in sola lettura) le iscrizioni ingresso per eventuali statistiche/admin
fetchRegistrationsJSONP('ingresso', 500).then((data) => {
  console.log('Fetched ingresso registrations:', data);
});

const Ingresso = ({ addRegistration, navigate }) => {
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const plain = Object.fromEntries(fd.entries());

    // Salvataggio su stato/app + Google Sheet dedicato
    const saved = addRegistration('ingresso', {
      ...plain,
      // normalizzo alcuni valori numerici
      lunchCount: Number(plain.lunchCount || 0),
    });
    postSheet('reg_ingresso', saved);

    e.currentTarget.reset();
    alert('Iscrizione ingresso registrata. Grazie!');
    navigate('');
  };

  return (
    <>
      <GradientHeader
        title="Ride4Gaza — Ingresso"
        subtitle="Registrazione per chi partecipa al pranzo e/o segue gli interventi finali."
        chips={[
          `Data: ${EVENT_CONFIG.date}`,
          `Luogo: ${EVENT_CONFIG.location}`,
          'Manifestazione silenziosa e pacifica',
        ]}
      />

      {/* Descrizione evento */}
      <section className="py-4">
        <div className="max-w-3xl mx-auto px-4">
          {(EVENT_CONFIG.descrizione_ingresso || EVENT_CONFIG.ingresso?.description || EVENT_CONFIG.description) && (
            <div className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/10">
              <h2 className="text-lg font-semibold">Descrizione</h2>
              <p className="mt-2 text-sm sm:text-base text-black/80 leading-relaxed">
                {EVENT_CONFIG.descrizione_ingresso || EVENT_CONFIG.ingresso?.description || EVENT_CONFIG.description}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Solo form di iscrizione (niente mappa) */}
      <section className="py-2">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h2 className="text-lg font-semibold">Modulo — Ingresso senza sport (pranzo-tifo-talk)</h2>
            <p className="mt-2 text-sm">
              Compila questo modulo per registrarti all’ingresso.
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
                  <label className="block text-sm font-medium">Telefono (opz.)</label>
                  <input type="tel" name="phone" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Note (opz.)</label>
                <textarea name="notes" rows={3} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
              </div>
              <div className="mt-2 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
                <h3 className="text-sm sm:text-base font-semibold">Donazione obbligatoria per iscriversi</h3>
                <p className="mt-1 text-xs sm:text-sm">
                  Minimo <strong>{MIN_PER_PERSON} €</strong>. Importo richiesto: <strong>{requiredAmount} €</strong>.
                </p>
                <PaymentOptions />
              </div>

              <div className="flex gap-3">
                <button
                  className="rounded-xl px-4 py-2 font-semibold text-white"
                  style={{ backgroundColor: THEME.primary }}
                  type="submit"
                >
                  Invia iscrizione
                </button>
              </div>

              <input type="hidden" name="category" value="ingresso" />
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

export default Ingresso;

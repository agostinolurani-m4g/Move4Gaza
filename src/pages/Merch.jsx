import React, { useState } from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';
import GradientHeader from '../components/GradientHeader.jsx';
import PaymentOptionsMerch from '../components/PaymentOptionsMerch.jsx';
import { postSheet, fetchRegistrationsJSONP } from '../services.js';

// Log (come per bike)
fetchRegistrationsJSONP('merch', 500).then((data) => {
  console.log('Fetched merch registrations:', data);
});

// Prezzo unico
const PRICE_EUR = 15;
const Merch = ({ addRegistration, navigate }) => {
  const [loading, setLoading] = useState(false);

  const goHome = () => navigate('/', { replace: true }); // ← assoluto, non ""

  const submit = (kind) => async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const plain = Object.fromEntries(fd.entries());

    const saved = addRegistration('merch', {
      ...plain,
      item: plain.item || kind,
      kind,
      price: PRICE_EUR,
      id: crypto?.randomUUID?.() || `reg_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    });

    try {
      setLoading(true);
      await postSheet('reg_merch', saved);
      form?.reset?.();
      alert('Ordine registrato! Ti inviamo una mail con le istruzioni di pagamento.');
      setTimeout(() => window.location.replace('/'), 0);
    } catch (err) {
      console.error('[MERCH] submit error', err);
      alert("Errore nell'invio. Riprova o scrivici a info@move4gaza.org");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GradientHeader
        title="Merch solidale"
        subtitle="Sostieni Move4Gaza acquistando calze e t‑shirt sostenibili. Tutti i ricavi saranno inviati a Gaza Sunbirds. Materiali certificati OEKO‑TEX® (cotone italiano e bambù portoghese)."
        chips={[`Prezzo unitario: ${PRICE_EUR}€`, 'Produzione sostenibile', 'Acquisto solidale']}
      />

      {/* CALZE */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/10">
            <h2 className="text-lg font-semibold">Calze Solidali</h2>
            <p className="mt-2 text-sm text-black/80">
              Calze <strong>Socks With A Cause</strong> – produzione solidale.
              <br />
              <strong>Modelli disponibili:</strong> 1, 2 e 4.
              <br />
              <strong>Materiali:</strong> 1 e 2 in <em>cotone pettinato</em> (spugna/deportivo), 4 in <em>bambù</em>. Cotone 🇮🇹 – Bambù 🇵🇹 – tutti certificati OEKO‑TEX®.
            </p>
            <div className="mt-2 text-sm text-black/70">Taglie: 36–40 (Small) • 41–45 (Large).</div>
            <div className="aspect-[4/3 ] w-full rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
              {/* Se hai i file in /public/images aggiorna gli src sotto */}
              <img
                src="/calze_m4g.jpeg"
                alt="Calze solidali"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h3 className="text-base font-semibold">Ordina le calze — {PRICE_EUR}€</h3>
            <form onSubmit={submit('socks')} className="mt-4 space-y-3">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Modello</label>
                  <select name="model" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2">
                    <option value="1">1 – Cotone pettinato</option>
                    <option value="2">2 – Cotone pettinato</option>
                    <option value="4">4 – Bambù</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Taglia</label>
                  <select name="size" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2">
                    <option value="36-40">36–40 (Small)</option>
                    <option value="41-45">41–45 (Large)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Quantità</label>
                  <input type="number" name="qty" min={1} defaultValue={1} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Note (opz.)</label>
                  <input name="notes" placeholder="Es. indirizzo, richieste…" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </div>
              </div>

              <div className="mt-2 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
                <h4 className="text-sm font-semibold">Pagamento</h4>
                <p className="text-xs">Dopo l'ordine riceverai istruzioni. Inserisci nella causale: <b>nome cognome + articolo</b>.</p>
                <PaymentOptionsMerch />
              </div>

              <div className="flex gap-3">
                <button disabled={loading} className="rounded-xl px-4 py-2 font-semibold text-white disabled:opacity-50" style={{ backgroundColor: THEME.primary }} type="submit">
                  Invia ordine calze
                </button>
                <span className="self-center text-sm">Totale indicativo: {PRICE_EUR}€ x quantità</span>
              </div>

              <input type="hidden" name="price" value={PRICE_EUR} />
              <input type="hidden" name="item" value="socks" />
            </form>
          </div>
        </div>
      </section>

      {/* T‑SHIRT */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/10">
            <h2 className="text-lg font-semibold">T‑Shirt Move4Gaza</h2>
            <p className="mt-2 text-sm text-black/80">
              Design <strong>giallo.Studio</strong> e produzione sostenibile di <strong>Legno</strong>. Modello unisex.
              Taglie disponibili: XS, S, M, L, XL.
            </p>
            <div className="aspect-[4/3 ] w-full rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
                  {/* Se hai i file in /public/images aggiorna gli src sotto */}
                  <img
                    src="/magliette_m4g.png"
                    alt="Magliette solidali"
                    className="w-full h-full object-cover"
                  />
                </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
            <h3 className="text-base font-semibold">Ordina la T‑Shirt — {PRICE_EUR}€</h3>
            <form onSubmit={submit('tshirt')} className="mt-4 space-y-3">
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
                  <label className="block text-sm font-medium">Taglia</label>
                  <select name="size" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2">
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Quantità</label>
                  <input type="number" name="qty" min={1} defaultValue={1} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Note (opz.)</label>
                  <input name="notes" placeholder="Es. indirizzo, richieste…" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </div>
              </div>

              <div className="mt-2 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
                <h4 className="text-sm font-semibold">Pagamento</h4>
                <p className="text-xs">Dopo l'ordine riceverai istruzioni. Inserisci nella causale: <b>nome cognome + articolo</b>.</p>
                <PaymentOptionsMerch />
              </div>

              <div className="flex gap-3">
                <button disabled={loading} className="rounded-xl px-4 py-2 font-semibold text-white disabled:opacity-50" style={{ backgroundColor: THEME.primary }} type="submit">
                  Invia ordine t‑shirt
                </button>
              </div>

              <input type="hidden" name="price" value={PRICE_EUR} />
              <input type="hidden" name="item" value="tshirt" />
            </form>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/10">
            <h3 className="text-base font-semibold">Info & contatti</h3>
            <p className="mt-2 text-sm text-black/80">
              Per domande: <a className="underline" href="mailto:info@move4gaza.org">info@move4gaza.org</a>
            </p>
            <p className="mt-1 text-xs text-black/60">Nota: tutti i ricavi saranno inviati a Gaza Sunbirds.</p>
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

export default Merch;
import React, { useState } from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';
import QuickAmounts from './QuickAmounts.jsx';
import PayPalPayBox from './PayPalPayBox.jsx';
import { postSheet } from '../services.js';

// Form allowing a participant to record a pledge and choose a payment method.
// Once a pledge is saved it offers payment options such as PayPal or IBAN.
const PreCheckout = ({ addPledge, navigate, markPledgePaid }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const [purpose, setPurpose] = useState("donation");
  const [amount, setAmount] = useState(20);
  const [method, setMethod] = useState("paypal");
  const [justCreated, setJustCreated] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    const pledge = addPledge({
      name,
      email,
      teamName,
      purpose,
      amount: Number(amount || 0),
      method,
    });
    setJustCreated(pledge);
    postSheet('pledge', pledge);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
      <h3 className="text-lg font-semibold">Registra l'impegno e scegli il metodo</h3>
      <form onSubmit={submit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Nome e cognome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Squadra (opz.)</label>
          <input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="nome squadra (se vuoi)"
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Scopo</label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
          >
            <option value="donation">Solo donazione</option>
            <option value="bike">Iscrizione Bici</option>
            <option value="soccer">Iscrizione Calcio (squadra)</option>
            <option value="run">Iscrizione Corsa (squadra)</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Importo consigliato</label>
          <div className="mt-2">
            <QuickAmounts value={amount} onPick={(v) => setAmount(v)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Importo</label>
          <input
            type="number"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Metodo</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
          >
            <option value="paypal">PayPal</option>
            <option value="iban">Bonifico (IBAN)</option>
            <option value="stripe" disabled={EVENT_CONFIG.payments.stripeComingSoon}>
              Stripe (in arrivo)
            </option>
          </select>
        </div>
        <div className="sm:col-span-2 flex gap-3">
          <button
            className="rounded-xl px-4 py-2 font-semibold text-white"
            style={{ backgroundColor: THEME.primary }}
          >
            Salva e mostra pagamento
          </button>
          <button
            type="button"
            onClick={() => navigate(purpose === 'donation' ? 'donate' : purpose)}
            className="rounded-xl px-4 py-2 font-semibold bg-white ring-1 ring-black/10 hover:bg-slate-50"
          >
            Vai alla pagina attività
          </button>
        </div>
      </form>

      {justCreated && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
          <p>
            <strong>Pledge registrato.</strong> ID: <code>{justCreated.id}</code>
          </p>

          {method === 'paypal' && (
            <PayPalPayBox
              pledge={justCreated}
              onPaid={(amt, orderID) => {
                // 1) update local DB with real amount
                markPledgePaid(justCreated.id, orderID, Number(amt || 0));
                // 2) verify on server and write to sheet
                postSheet('paypal_verify', { pledgeId: justCreated.id, orderID });
              }}
            />
          )}

          {method === 'iban' && (
            <div className="mt-3">
              <p className="mb-1">Esegui un bonifico a:</p>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Intestatario:</strong> {EVENT_CONFIG.payments.ibanOwner}
                </li>
                <li>
                  <strong>IBAN:</strong> {EVENT_CONFIG.payments.iban}
                </li>
                <li>
                  <strong>Banca:</strong> {EVENT_CONFIG.payments.ibanBank}
                </li>
                <li>
                  <strong>Causale:</strong> {`Donazione ${EVENT_CONFIG.title} — ${justCreated.id}`}
                </li>
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => navigator.clipboard?.writeText(EVENT_CONFIG.payments.iban)}
                  className="rounded-lg px-3 py-2 ring-1 ring-black/10 bg-white"
                >
                  Copia IBAN
                </button>
                <button
                  onClick={() => navigate(`confirm?${justCreated.id}`)}
                  className="rounded-lg px-3 py-2 text-white"
                  style={{ backgroundColor: THEME.primary }}
                >
                  Ho effettuato il bonifico
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PreCheckout;
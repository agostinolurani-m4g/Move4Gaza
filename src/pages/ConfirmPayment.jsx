import React, { useState } from 'react';
import { THEME } from '../config.js';
import { postSheet } from '../services.js';

// Page for confirming an offline payment (e.g. bank transfer). The pledge ID
// is extracted from the URL hash query string. When the user provides a
// reference and confirms, the pledge is marked as paid locally and a
// notification is sent via Google Sheets. Displays a thank‑you message
// after completion.
const ConfirmPayment = ({ markPledgePaid, route }) => {
  // Extract pledge ID from the hash. Supports both #/confirm?ID and #?ID.
  const id = typeof window !== 'undefined'
    ? (window.location.hash.split('?')[1] || '').replace('#', '')
    : '';
  const [reference, setReference] = useState('');
  const [done, setDone] = useState(false);
  const confirm = () => {
    if (!id) {
      alert('Nessun ID pledge trovato');
      return;
    }
    markPledgePaid(id, reference);
    postSheet('pledge_paid', {
      id,
      reference,
      paidAt: new Date().toISOString(),
      status: 'paid',
    });
    setDone(true);
  };
  return (
    <section className="py-12 bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-2xl font-bold">Conferma pagamento</h2>
        <p className="mt-2 text-sm text-slate-700">
          ID pledge: <code>{id || '—'}</code>
        </p>
        {!done ? (
          <div className="mt-4 rounded-xl border border-slate-200 p-4">
            <label className="block text-sm font-medium">
              Riferimento/ID transazione (opz.)
            </label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="es. numero ricevuta / causale"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            <button
              onClick={confirm}
              className="mt-3 rounded-xl px-4 py-2 font-semibold text-white"
              style={{ backgroundColor: THEME.primary }}
            >
              Conferma come pagato
            </button>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            Grazie! Abbiamo registrato il pagamento.
          </div>
        )}
      </div>
    </section>
  );
};

export default ConfirmPayment;
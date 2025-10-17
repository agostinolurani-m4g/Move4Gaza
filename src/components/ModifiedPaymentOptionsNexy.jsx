import React, { useState } from 'react';
import { THEME } from '../config.js';

// Inserisci qui l’URL completo del tuo Apps Script (exec)
const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzsiFCo5hlg-PLGTKEphWo89cpS8bmAVXF__IYxjc0CcvGbsIuOOYjCQT7AGvEyayu_/exec';

const SECRET = 'Amaro25';

// Opzioni di default per returnUrl, cancelUrl e description. Modifica secondo necessità.
const RETURN_URL = 'https://move-4-gaza.it/#/menu';
const CANCEL_URL = 'https://move-4-gaza.it/#/menu';
const DESCRIPTION = 'Donazione';

/**
 * Componente React per avviare un pagamento con NexyPay/XPay.
 * Aggiunge campi per nome e cognome e integra `urlpost` per notifiche server-to-server.
 */
const ModifiedPaymentOptionsNexy = () => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    // Validate amount
    const euro = parseFloat(amount.replace(',', '.'));
    if (!euro || euro <= 0) {
      alert('Inserisci un importo valido');
      return;
    }
    // Validate name and surname
    if (!name.trim() || !surname.trim()) {
      alert('Inserisci nome e cognome');
      return;
    }
    const importoCents = String(Math.round(euro * 100));
    setLoading(true);

    try {
      if (!SCRIPT_URL) {
        throw new Error("L’URL della web‑app Apps Script non è configurato (SCRIPT_URL è undefined)");
      }
      // Costruisci la URL di firma con parametri necessari, inclusi nome/cognome e baseUrl per urlpost
      const url = `${SCRIPT_URL}?action=signNexi` +
                  `&importo=${encodeURIComponent(importoCents)}` +
                  `&secret=${encodeURIComponent(SECRET)}` +
                  `&name=${encodeURIComponent(name)}` +
                  `&surname=${encodeURIComponent(surname)}` +
                  `&baseUrl=${encodeURIComponent(SCRIPT_URL)}` +
                  `&returnUrl=${encodeURIComponent(RETURN_URL)}` +
                  `&cancelUrl=${encodeURIComponent(CANCEL_URL)}` +
                  `&description=${encodeURIComponent(DESCRIPTION)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || 'Errore generazione MAC');
      }

      // Crea e sottometti il form verso Nexi. Utilizza i parametri restituiti da signNexi.
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.requestUrl;
      const fields = [];
      fields.push(['alias', data.alias]);
      fields.push(['importo', data.importo]);
      fields.push(['divisa', data.divisa]);
      fields.push(['codTrans', data.codTrans]);
      fields.push(['url', data.url]);
      fields.push(['url_back', data.url_back]);
      fields.push(['mac', data.mac]);
      if (data.descrizione) {
        fields.push(['descrizione', data.descrizione]);
      }
      // urlpost è presente solo se signNexi l'ha generato
      if (data.urlpost) {
        fields.push(['urlpost', data.urlpost]);
      }
      fields.forEach(([nameField, valueField]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = nameField;
        input.value = valueField;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Si è verificato un errore imprevisto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/10">
      <h3 className="text-xl font-bold">Pagamento con NexyPay</h3>
      <form onSubmit={handlePay} className="mt-4 space-y-3">
        <label className="block text-sm font-medium text-slate-600">
          Nome
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="es. Mario"
            className="mt-1 block w-full rounded-md border p-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-600">
          Cognome
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="es. Rossi"
            className="mt-1 block w-full rounded-md border p-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-600">
          Importo (in euro)
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="es. 10,00"
            className="mt-1 block w-full rounded-md border p-2"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-block rounded-xl px-4 py-2 font-semibold text-white"
          style={{ backgroundColor: THEME.primary }}
        >
          {loading ? 'Attendere…' : 'Paga con NexyPay'}
        </button>
      </form>
    </div>
  );
};

export default ModifiedPaymentOptionsNexy;
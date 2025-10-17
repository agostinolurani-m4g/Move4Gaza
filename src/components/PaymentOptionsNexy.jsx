import React, { useState } from 'react';
import { THEME } from '../config.js';

// Inserisci qui l’URL completo del tuo Apps Script (exec)
const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzsiFCo5hlg-PLGTKEphWo89cpS8bmAVXF__IYxjc0CcvGbsIuOOYjCQT7AGvEyayu_/exec';

const SECRET = 'Amaro25';

const PaymentOptionsNexy = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    const euro = parseFloat(amount.replace(',', '.'));
    if (!euro || euro <= 0) {
      alert('Inserisci un importo valido');
      return;
    }

    const importoCents = String(Math.round(euro * 100));
    setLoading(true);

    try {
      if (!SCRIPT_URL) {
        throw new Error('L’URL della web‑app Apps Script non è configurato (SCRIPT_URL è undefined)');
      }

      // Costruisci la URL con tutti i parametri necessari
      const url = `${SCRIPT_URL}?action=signNexi` +
                  `&importo=${encodeURIComponent(importoCents)}` +
                  `&secret=${encodeURIComponent(SECRET)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.ok) {
          throw new Error(data.error || 'Errore generazione MAC');
      }

      // Crea e sottometti il form verso Nexi
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.requestUrl;
      [
        ['alias', data.alias],
        ['importo', data.importo],
        ['divisa', data.divisa],
        ['codTrans', data.codTrans],
        ['url', data.url],
        ['url_back', data.url_back],
        ['urlpost', data.urlpost],
        ['mac', data.mac],
      ].forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
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

export default PaymentOptionsNexy;

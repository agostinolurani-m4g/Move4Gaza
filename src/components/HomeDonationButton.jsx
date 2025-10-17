import React, { useState } from 'react';
import { THEME } from '../config.js';

// URL della tua Web App Apps Script (deployment /exec)
const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzX1GSwvKjF_GcaFheEn4YpOvqpIzp0GFg4TKsywjpixF4EJdyk4b45MdaTNzi5gHaw/exec';
const SECRET = 'Amaro25';

export default function HomeDonationButton({
  amountCents = 1500,                        // 15,00 €
  label = 'Dona €15',
  returnUrl = 'https://move-4-gaza.com',     // metti la tua pagina OK
  cancelUrl = 'https://move-4-gaza.com',     // metti la tua pagina KO
  description = 'Donazione'
}) {
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    try {
      setLoading(true);

      // 1) chiama Apps Script per farti firmare i parametri Nexi
      const qs = new URLSearchParams({
        secret: SECRET,
        action: 'signNexi',
        importo: String(amountCents),
        returnUrl,
        cancelUrl,
        description,
      });
      const res = await fetch(`${SCRIPT_URL}?${qs.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Errore generazione parametri');

      // 2) crea e sottometti il form verso la servlet Nexi
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.requestUrl; // es: https://ecommerce.nexi.it/ecomm/ecomm/DispatcherServlet

      const pairs = [
        ['alias', data.alias],
        ['importo', data.importo],
        ['divisa', data.divisa],
        ['codTrans', data.codTrans],
        ['url', data.url || returnUrl],
        ['url_back', data.url_back || cancelUrl],
        ['mac', data.mac],
      ];
      if (description) pairs.push(['descrizione', description]);

      for (const [name, value] of pairs) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = String(value ?? '');
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Impossibile avviare il pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDonate}
      disabled={loading}
      className="mt-6 rounded-xl px-5 py-3 font-semibold text-white shadow hover:opacity-95 transition"
      style={{ backgroundColor: THEME.primary }}
    >
      {loading ? 'Reindirizzamento…' : label}
    </button>
  );
}

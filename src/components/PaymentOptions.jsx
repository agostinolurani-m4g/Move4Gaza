import React from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';

const PaymentOptions = ({ className = '' }) => {
  const pay = EVENT_CONFIG?.payments || {};
  const hasLink = (pay.paypalLink || '').trim().length > 0;

  const handleCopy = (text) => {
    if (navigator.clipboard && text) {
      navigator.clipboard.writeText(text).then(
        () => alert('IBAN copiato negli appunti.'),
        () => alert('Non è stato possibile copiare l\'IBAN.')
      );
    }
  };

  return (
    <div className={className}>
      <div className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/10">
        <h3 className="text-xl font-bold">Come donare</h3>
        <p className="mt-4 text-l text-black">
          Nota: Vi chiediamo di inserire nella causale del bonifico "Move4Gaza" e il vostro nome, cognome, sport, quota ed eventuale squadra.
        </p>
        {/* PayPal Pool */}
        <div className="mt-4 rounded-xl ring-1 ring-black/10 p-4">
          <h4 className="font-semibold">PayPal Pool</h4>
          <p className="mt-1 text-sm text-black/70">
            Clicca per aprire la pagina del Pool e donare l&apos;importo che preferisci.
          </p>
          {hasLink ? (
            <a
              href={pay.paypalLink}
              target="_blank"
              rel="noopener"
              className="mt-3 inline-block rounded-xl px-4 py-2 font-semibold text-white"
              style={{ backgroundColor: THEME.primary }}
              aria-label="Contribuisci con PayPal Pool"
            >
              Contribuisci con PayPal
            </a>
          ) : (
            <p className="mt-3 text-sm text-amber-700 bg-amber-50 p-2 rounded-lg">
              Imposta <code>EVENT_CONFIG.payments.paypalLink</code> in <code>src/config.js</code>.
            </p>
          )}
        </div>

        {/* Bonifico */}
        {/* Bonifico */}
        <div className="mt-4 rounded-xl ring-1 ring-black/10 p-4">
          <h4 className="font-semibold">Bonifico (IBAN)</h4>
          <div className="mt-1 text-sm text-black/80">
            <p><strong>Intestatario:</strong> {EVENT_CONFIG.payments.ibanOwner || <em>—</em>}</p>
            <p><strong>IBAN:</strong> {EVENT_CONFIG.payments.iban || <em>—</em>}</p>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => handleCopy(EVENT_CONFIG.payments.iban)}
              className="rounded-lg px-3 py-2 text-white"
              style={{ backgroundColor: THEME.primary }}
            >
              Copia IBAN
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentOptions;

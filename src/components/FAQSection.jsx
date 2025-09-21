import React from 'react';
import { EVENT_CONFIG } from '../config.js';

// Frequently asked questions component. Accepts navigate to enable internal links.
const FAQSection = ({ navigate }) => {
  const B = EVENT_CONFIG.beneficiary;
  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Domande frequenti</h2>

        <div className="grid gap-4">
          <div className="rounded-2xl bg-green-700 border border-slate-200 p-5">
            <h3 className="font-semibold text-black">A chi vanno i soldi?</h3>
            <p className="text-sm text-black mt-1">
              Le donazioni sono destinate a{' '}
              <a className="underline" href={B.url} target="_blank" rel="noreferrer">
                {B.name}
              </a>
              . Pubblicheremo un report finale. Dettagli nella pagina{' '}
              <a
                href="#/beneficiary"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('beneficiary');
                }}
                className="underline"
              >
                Beneficiario
              </a>
              .
            </p>
          </div>

          <div className="rounded-2xl border bg-green-700 border-slate-200 p-5">
            <h3 className="font-semibold text-black">Come funzionano i vari eventi?</h3>
            <ul className="text-sm text-black mt-1 list-disc pl-5 space-y-1">
              <li>
                <strong>Bici</strong>: 112 km (Gaza in scala) e 20 km (cittadino). Ritmo sociale, non competitivo.
              </li>
              <li>
                <strong>Calcio</strong>: 5 vs 5 per l’inclusione. 4 partite da 15’ garantite.
              </li>
              <li>
                <strong>Corsa</strong>: manifestazione silenziosa e pacifica, partenza dal Duomo.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-green-700 border-slate-200 p-5">
            <h3 className="font-semibold text-black">La donazione è obbligatoria? Cosa include?</h3>
            <p className="text-sm text-black mt-1">
              Sì: la donazione (<strong>min. 20 €</strong>) è{' '}
              <strong>propedeutica all’iscrizione</strong>.{' '}
              <strong>Non include</strong> beni/servizi (es. <strong>pranzo non incluso</strong>).
            </p>
          </div>
          <div className="rounded-2xl border bg-green-700 border-slate-200 p-5">
            <h3 className="font-semibold text-black">Posso partecipare anche senza prendere parte agli eventi sportivi?</h3>
            <p className="text-sm text-black mt-1">
              Certo! L'evento è aperto a tuttə, si può venire sia la mattina e assistere agli eventi sportivi, sia il pomeriggio
               per seguire gli incontri.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

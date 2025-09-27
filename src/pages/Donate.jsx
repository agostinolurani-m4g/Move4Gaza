import React from 'react';
import { EVENT_CONFIG } from '../config.js';
import PaymentOptions from '../components/PaymentOptions.jsx';
import BeneficiaryBadge from '../components/BeneficiaryBadge.jsx';

// Donation page where users can record a pledge and choose a payment method.
// Presents information about minimum recommended amounts, transparency and
// acknowledges the beneficiary. Uses PaymentOptions to handle pledge creation.
const Donate = ({
  addPledge = () => {},
  markPledgePaid = () => {},
  navigate = () => {},
}) => {
  // Donazione minima consigliata: prendi dal config se presente, altrimenti 20
  const minDonation =
    Number(EVENT_CONFIG?.minDonation ?? EVENT_CONFIG?.suggestedDonation ?? 15);

  const minDonationLabel = isNaN(minDonation)
    ? '15 €'
    : minDonation.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left column: text and beneficiary info */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Sostieni l'evento</h2>
          <p className="mt-2 text-slate-700">
            La donazione minima consigliata è <strong>{minDonationLabel}</strong>. Puoi anche{' '}
            <strong>iscriverti senza donare subito</strong>.
          </p>
          <ul className="mt-3 text-sm list-disc pl-5 space-y-1">
            <li>PayPal / Bonifico (IBAN) — Stripe in arrivo.</li>
            <li>
              Ricevuta della donazione = prova di iscrizione (se scegli un'attività).
            </li>
            <li>Trasparenza: pubblicheremo report finale.</li>
          </ul>
          {/* small beneficiary badge shows where donations go */}
          <BeneficiaryBadge className="mt-4" />
        </div>

        {/* Right column: donation form and a repeated badge */}
        <div>
          <PaymentOptions
            addPledge={addPledge}
            navigate={navigate}
            markPledgePaid={markPledgePaid}
          />
        </div>
      </div>
    </section>
  );
};

export default Donate;

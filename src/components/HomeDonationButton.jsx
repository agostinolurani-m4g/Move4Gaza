import React, { useState } from 'react';

// This component renders a single button that initiates a donation
// using Nexi's XPay "pagamento semplice". When clicked, it calls your
// Apps Script to generate the payment parameters and then submits
// them to Nexi via a hidden form, redirecting the user to the
// hosted payment page. Adjust SCRIPT_URL, SECRET and the default
// donation amount to suit your needs. You can also pass in
// optional returnUrl and cancelUrl if you want to control where
// Nexi redirects after payment.

// Replace this with the URL of your deployed Google Apps Script Web App
const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzX1GSwvKjF_GcaFheEn4YpOvqpIzp0GFg4TKsywjpixF4EJdyk4b45MdaTNzi5gHaw/exec';

// Must match the SECRET constant defined in your Apps Script
const SECRET = 'Amaro25';

// Default donation amount (in euro) when the button is clicked
const DEFAULT_DONATION_EURO = 15;

const HomeDonationButton = ({ returnUrl = '', cancelUrl = '' }) => {
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    // Prevent multiple submissions
    if (loading) return;
    setLoading(true);
    try {
      // Convert euro to cents for the API
      const importoCents = Math.round(DEFAULT_DONATION_EURO * 100);
      // Build the query string for the Apps Script call
      const qs = new URLSearchParams({
        secret: SECRET,
        action: 'signNexi',
        importo: String(importoCents),
        returnUrl,
        cancelUrl,
        description: 'Donazione',
      });
      const res = await fetch(`${SCRIPT_URL}?${qs.toString()}`);
      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.error || 'Errore nella generazione dei parametri');
      }
      // Create a form and submit to Nexi using the returned parameters
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.requestUrl;
      ['alias','importo','divisa','codTrans','url','url_back','mac','descrizione','urlpost'].forEach((field) => {
        if (data[field]) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = field;
          input.value = data[field];
          form.appendChild(input);
        }
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
    <button
      type="button"
      onClick={handleDonate}
      disabled={loading}
      className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-white shadow hover:opacity-95 transition"
      style={{ backgroundColor: '#ff0062' }}
    >
      {loading ? 'Attendere…' : `Dona €${DEFAULT_DONATION_EURO}`}
    </button>
  );
};

export default HomeDonationButton;
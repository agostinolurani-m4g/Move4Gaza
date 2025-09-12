import React, { useEffect, useRef } from 'react';
import { usePayPalSdk } from '../hooks/usePayPalSdk.js';
import { PAYPAL, EVENT_CONFIG } from '../config.js';

// Render the PayPal button for a given pledge. When a payment is captured it
// calls the supplied onPaid callback with the paid amount and the order ID.
const PayPalPayBox = ({ pledge, onPaid }) => {
  const ready = usePayPalSdk();
  const boxRef = useRef(null);

  useEffect(() => {
    if (!ready || !window.paypal || !boxRef.current) return;
    // clear any previously rendered buttons
    boxRef.current.innerHTML = '';
    window.paypal.Buttons({
      style: { layout: 'vertical', shape: 'rect' },
      createOrder: (_, actions) => {
        return actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: { currency_code: PAYPAL.currency, value: String(pledge.amount || 20) },
            description: pledge.purpose === 'donation'
              ? `Donation — ${EVENT_CONFIG.title}`
              : `Registration — ${pledge.purpose}`,
            custom_id: pledge.id,
            invoice_id: pledge.id,
          }],
        });
      },
      onApprove: async (_, actions) => {
        // when the payment is approved, capture it and pass details up
        const details = await actions.order.capture();
        const cap = details?.purchase_units?.[0]?.payments?.captures?.[0];
        const amt = cap?.amount?.value ?? pledge.amount;
        const orderID = details?.id;
        onPaid?.(Number(amt || 0), orderID);
      },
    }).render(boxRef.current);
  }, [ready, pledge?.id, pledge?.amount]);

  return (
    <div className="mt-3">
      <div ref={boxRef} />
      <p className="text-xs text-slate-600 mt-2">
        Dopo il pagamento il totale si aggiorna automaticamente.
      </p>
    </div>
  );
};

export default PayPalPayBox;

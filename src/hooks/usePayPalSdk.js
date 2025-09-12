import { useState, useEffect } from 'react';
import { PAYPAL } from '../config.js';

// Dynamically load the PayPal SDK when needed. The hook returns a boolean
// indicating readiness. It ensures the script is only injected once.
export function usePayPalSdk() {
  const [ready, setReady] = useState(!!window.paypal);
  useEffect(() => {
    if (window.paypal) return;
    const s = document.createElement("script");
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL.clientId}&currency=${PAYPAL.currency}&components=buttons`;
    s.onload = () => setReady(true);
    document.body.appendChild(s);
  }, []);
  return ready || !!window.paypal;
}
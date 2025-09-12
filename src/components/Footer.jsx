import React from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';

const Footer = () => {
  return (
    <footer className="py-10" style={{ backgroundColor: '#e6e6e6', color: '#333' }}>
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold">{EVENT_CONFIG.title}</p>
          <p className="text-sm text-black/70">© {new Date().getFullYear()} Tutti i diritti riservati.</p>
        </div>
        <div className="text-sm">
          {EVENT_CONFIG.contactEmail && (
            <a href={`mailto:${EVENT_CONFIG.contactEmail}`} className="underline decoration-black/40 hover:decoration-black">
              {EVENT_CONFIG.contactEmail}
            </a>
          )}
          {EVENT_CONFIG.whatsapp && (
            <span className="ml-3">
              WhatsApp:{' '}
              <a href={`https://wa.me/${EVENT_CONFIG.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="underline decoration-black/40 hover:decoration-black">
                {EVENT_CONFIG.whatsapp}
              </a>
            </span>
          )}
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <p className="text-xs text-black/70">
          Privacy: i dati dei moduli sono usati solo per la gestione dell'evento. Per i pagamenti si applicano le policy dei provider scelti.
        </p>
      </div>
      <div className="mt-8 h-1 w-full grid grid-cols-12 opacity-90">
        <div className="col-span-3" style={{ backgroundColor: '#000' }} />
        <div className="col-span-3" style={{ backgroundColor: '#fff' }} />
        <div className="col-span-3" style={{ backgroundColor: THEME.primary }} />
        <div className="col-span-3" style={{ backgroundColor: THEME.accentRed }} />
      </div>
    </footer>
  );
};

export default Footer;

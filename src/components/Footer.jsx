import React from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';

const Footer = () => {
  return (
    <footer className="py-10" style={{ backgroundColor: '#e6e6e6', color: '#333' }}>
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold">{EVENT_CONFIG.title}</p>
          <p className="text-sm text-black/70">© {new Date().getFullYear()} Tutti i diritti riservati.</p>
          {/* Logo Arci Olmi */}
          <div className="mt-2">
            <img
              src={import.meta.env.BASE_URL + 'arci_olmi.jpeg'}
              alt="Arci Olmi Logo"
              className="w-20 h-20 rounded-xl ring-1 ring-black/10 object-contain bg-white"
              loading="lazy"
              width={80}
              height={80}
            />
          </div>
        </div>
        <div className="text-sm flex flex-col gap-2">
          {EVENT_CONFIG.contactEmail && (
            <a href={`mailto:${EVENT_CONFIG.contactEmail}`} className="underline decoration-black/40 hover:decoration-black">
              {EVENT_CONFIG.contactEmail}
            </a>
          )}
          {EVENT_CONFIG.whatsapp && (
            <span>
              WhatsApp:{' '}
              <a href={`https://wa.me/${EVENT_CONFIG.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="underline decoration-black/40 hover:decoration-black">
                {EVENT_CONFIG.whatsapp}
              </a>
            </span>
          )}
          {/* Instagram Icon */}
          <span>
            <a href="https://instagram.com/moveforgaza" target="_blank" rel="noreferrer" aria-label="Instagram" className="inline-flex items-center gap-1 underline decoration-black/40 hover:decoration-black">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="6" stroke="#333" strokeWidth="2" fill="#fff"/>
                <circle cx="12" cy="12" r="5" stroke="#333" strokeWidth="2"/>
                <circle cx="17" cy="7" r="1.5" fill="#333"/>
              </svg>
              Instagram
            </a>
          </span>
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
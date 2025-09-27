import React from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';

const Footer = () => {
  return (
    <footer className="py-10" style={{ backgroundColor: '#e6e6e6', color: '#333' }}>
      {/* Riga unica a 3 colonne (sx: titolo, centro: logo, dx: contatti) */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-6">
        {/* SX: titolo */}
        <div>
          <p className="font-semibold">{EVENT_CONFIG.title}</p>
          <p className="text-sm text-black/70">© {new Date().getFullYear()} Tutti i diritti riservati.</p>
        </div>

        {/* CENTRO: logo Arci Olmi centrato */}
        <div className="flex justify-center">
          <img
            src={import.meta.env.BASE_URL + 'arci_olmi.jpeg'}
            alt="Arci Olmi Logo"
            className="w-20 h-20 rounded-xl ring-1 ring-black/10 object-contain bg-white"
            loading="lazy"
            width={80}
            height={80}
          />
        </div>

        {/* DX: contatti */}
        <div className="text-sm flex flex-col gap-2 sm:items-end">
          <p className="font-semibold">Contatti</p>
          <a href="mailto:amaro.bici@gmail.com" className="underline decoration-black/40 hover:decoration-black">
            amaro.bici@gmail.com
          </a>
          <span>via degli ulivi 2, Milano</span>
          <a href="tel:+393337696553" className="underline decoration-black/40 hover:decoration-black">
            +39 333 769 6553
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/moveforgaza"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="inline-flex items-center gap-1 underline decoration-black/40 hover:decoration-black"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="6" stroke="#333" strokeWidth="2" fill="#fff" />
              <circle cx="12" cy="12" r="5" stroke="#333" strokeWidth="2" />
              <circle cx="17" cy="7" r="1.5" fill="#333" />
            </svg>
            Instagram
          </a>
        </div>
      </div>

      {/* Privacy */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <p className="text-xs text-black/70">
          Privacy: i dati dei moduli sono usati solo per la gestione dell&apos;evento. Per i pagamenti si applicano le policy dei provider scelti.
        </p>
      </div>

      {/* Barra colori */}
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

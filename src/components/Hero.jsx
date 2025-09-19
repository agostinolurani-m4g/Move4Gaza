import React from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';

// Home "hero": immagine centrale M4G-mix e CTA rossi
const Hero = ({ navigate }) => {
  const mix = EVENT_CONFIG.logoUrl_mix || (import.meta.env.BASE_URL + 'M4G-mix.svg');

  return (
    <header className="relative isolate">
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-14 text-center">
        {/* LOGO CENTRALE M4G-mix */}
        <img
          src={mix}
          alt={`${EVENT_CONFIG.title} mix`}
          className="mx-auto w-full max-w-4xl h-auto"
        />

        {/* Luogo + data */}
        <div className="mt-10">
          <p className="text-lg sm:text-xl font-semibold tracking-wide text-black">
            {EVENT_CONFIG.location}
          </p>
          <p className="text-base sm:text-lg font-bold tracking-wide text-black/90">
            {EVENT_CONFIG.date}
          </p>
        </div>

        {/* CTA rossi a pillola */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-20">
          <a
            href="#/bike"
            onClick={(e) => { e.preventDefault(); navigate('bike'); }}
            className="inline-flex items-center justify-center rounded-full px-8 py-2 text-base sm:text-lg font-semibold text-white shadow"
            style={{ backgroundColor: THEME.primary }}
          >
            Iscriviti bici
          </a>

          <a
            href="#/soccer"
            onClick={(e) => { e.preventDefault(); navigate('soccer'); }}
            className="inline-flex items-center justify-center rounded-full px-8 py-2 text-base sm:text-lg font-semibold text-white shadow"
            style={{ backgroundColor: THEME.primary }}
          >
            Iscriviti calcio
          </a>

          <a
            href="#/run"
            onClick={(e) => { e.preventDefault(); navigate('run'); }}
            className="inline-flex items-center justify-center rounded-full px-8 py-2 text-base sm:text-lg font-semibold text-white shadow"
            style={{ backgroundColor: THEME.primary }}
          >
            Iscriviti corsa
          </a>
        </div>
      </div>
    </header>
  );
};

export default Hero;

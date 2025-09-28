import React from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';

// Home "hero": immagine centrale M4G-mix e CTA rossi
const Hero = ({ navigate }) => {
  const mix = EVENT_CONFIG.logoUrl_mix || (import.meta.env.BASE_URL + '/M4G-mix.svg');

  // Sottotitolo resiliente
  const subtitle =
    EVENT_CONFIG.subtitle ||
    "Non si può stare fermi! sabato 18 ottobre ti aspettiamo per una giornata di mobilitazione sportiva e collettiva per raccogliere fondi a favore dell'associazione Gaza Sunbirds" ||
    EVENT_CONFIG.tagline ||
    EVENT_CONFIG.slogan;
  // Logo da mostrare sotto il location: scegli in modo resiliente tra più chiavi possibili
  const locationLogo =
    EVENT_CONFIG.arciOlmi ||
    EVENT_CONFIG.logoUrl_brand ||
    EVENT_CONFIG.logoUrl_secondary ||
    EVENT_CONFIG.logoUrl; // fallback finale

  return (
    <header className="relative isolate">
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-14 text-center">
        {/* LOGO CENTRALE M4G-mix */}
        <img
          src={mix}
          alt={`${EVENT_CONFIG.title} mix`}
          className="mx-auto w-full max-w-4xl h-auto"
          loading="lazy"
        />

        {/* Sottotitolo */}
        {subtitle && (
          <p className="mt-6 text-xl sm:text-2xl font-medium tracking-tight text-black/80">
            {subtitle}
          </p>
        )}

        {/* Luogo + data */}
        <div className="mt-10">
          <p className="text-lg sm:text-xl font-semibold tracking-wide text-black">
            {EVENT_CONFIG.location}
          </p>

          {/* LOGO sotto il location (rimosso) */}
          {/* {locationLogo && (
            <img
              src={locationLogo}
              alt={`${EVENT_CONFIG.title} logo`}
              className="mx-auto mt-2 w-20 h-20 rounded-xl ring-1 ring-black/10 object-contain bg-white"
              loading="lazy"
              width={80}
              height={80}
            />
          )} */}

          <p className="text-base sm:text-lg font-bold tracking-wide text-black/90 mt-2">
            {EVENT_CONFIG.date}
          </p>
        </div>

        {/* CTA rossi a pillola */}
        {/* aggiornato layout: 1 col su mobile, 2 su small, 4 su medium+ */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-20">
          <a
            href="#/bike"
            onClick={(e) => { e.preventDefault(); navigate('bike'); }}
            className="inline-flex items-center justify-center rounded-full px-8 py-2 text-base sm:text-lg font-semibold text-black shadow"
            style={{ backgroundColor: THEME.primary }}
          >
            Iscriviti bici
          </a>

          <a
            href="#/soccer"
            onClick={(e) => { e.preventDefault(); navigate('soccer'); }}
            className="inline-flex items-center justify-center rounded-full px-8 py-2 text-base sm:text-lg font-semibold text-black shadow"
            style={{ backgroundColor: THEME.primary }}
          >
            Iscriviti calcio
          </a>

          <a
            href="#/run"
            onClick={(e) => { e.preventDefault(); navigate('run'); }}
            className="inline-flex items-center justify-center rounded-full px-8 py-2 text-base sm:text-lg font-semibold text-black shadow"
            style={{ backgroundColor: THEME.primary }}
          >
            Iscriviti corsa
          </a>

          {/* Nuovo bottone: Sostieni senza faticare */}
          <a
            href="#/entrance"
            onClick={(e) => { e.preventDefault(); navigate('entrance'); }}
            className="inline-flex items-center justify-center rounded-full px-8 py-2 text-base sm:text-lg font-semibold text-black shadow"
            style={{ backgroundColor: THEME.primary }}
            aria-label="Vai alla pagina di ingresso/donazione"
          >
            Sostieni senza faticare
          </a>
        </div>
      </div>
    </header>
  );
};

export default Hero;

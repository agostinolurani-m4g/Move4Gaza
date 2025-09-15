import React from 'react';
import { THEME, EVENT_CONFIG } from '../config.js';

// GradientHeader "come la home":
// - immagine centrale M4G-mix grande
// - titolo/sottotitolo sotto (testo nero)
// - chip/badge verdi (se passati)
const GradientHeader = ({ title, subtitle, chips = [] }) => {
  const mix =
    EVENT_CONFIG.logoUrl_mix ||
    (import.meta.env.BASE_URL + 'M4G-mix.svg');

  return (
    <section className="relative isolate bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14 text-center">
        {/* LOGO CENTRALE M4G-mix */}
        <img
          src={mix}
          alt={`${EVENT_CONFIG.title} mix`}
          className="mx-auto w-full max-w-4xl h-auto"
        />

        {(title || subtitle) && (
          <div className="mt-6">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2 text-base sm:text-lg text-slate-800">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {!!chips.length && (
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
            {chips.map((c, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: THEME.primary }}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GradientHeader;

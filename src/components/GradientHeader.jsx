import React from 'react';
import { THEME, EVENT_CONFIG } from '../config.js';

// GradientHeader con sfondo verde e wordmark rosso M4G sopra al titolo
const GradientHeader = ({ title, subtitle, chips = [] }) => {
  return (
    <section
      className="relative isolate overflow-hidden"
      style={{ backgroundColor: THEME.primary }}
    >
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 text-white">
        {/* Logo rosso M4G sopra al titolo */}
        {EVENT_CONFIG.logoUrl_rosso ? (
          <img
            src={EVENT_CONFIG.logoUrl_rosso}
            alt={EVENT_CONFIG.title}
            className="h-10 sm:h-12 w-auto mb-3 drop-shadow"
          />
        ) : null}

        <h1 className="text-3xl sm:text-4xl font-extrabold">{title}</h1>
        {subtitle && <p className="mt-2 text-white/90">{subtitle}</p>}

        {!!chips.length && (
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {chips.map((c, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-white text-slate-900"
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

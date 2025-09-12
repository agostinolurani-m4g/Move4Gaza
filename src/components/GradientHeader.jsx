import React from 'react';
import { THEME, EVENT_CONFIG } from '../config.js';

const GradientHeader = ({ title, subtitle, chips = [] }) => {
  const poster = EVENT_CONFIG.logoUrl || (import.meta.env.BASE_URL + 'locandina.jpg');
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{
        backgroundImage: `url(${poster})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      <div className="absolute inset-0 -z-10 bg-black/35" />
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#fff' }}>{title}</h1>
        {subtitle && <p className="mt-2 text-white/90">{subtitle}</p>}
        {!!chips.length && (
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {chips.map((c, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-white/85 ring-1 ring-black/10 text-slate-900">
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

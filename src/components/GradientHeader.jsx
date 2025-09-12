import React from 'react';
import { THEME } from '../config.js';

// Shared header section with a colourful gradient background. Accepts a title,
// an optional subtitle and optional chips describing additional info.
const GradientHeader = ({ title, subtitle, chips = [] }) => {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(135deg, ${THEME.gradientFrom}, ${THEME.gradientVia}, ${THEME.gradientTo})`,
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: `radial-gradient(closest-side, rgba(255,255,255,.25), rgba(255,255,255,0))`,
        }}
      />
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: THEME.ink }}>
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-slate-900/90">{subtitle}</p>}
        {!!chips.length && (
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {chips.map((c, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-white/80 ring-1 ring-black/10"
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
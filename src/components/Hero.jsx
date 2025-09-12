import React from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';

// Large hero section for the home page with event title, tagline and CTAs.
const Hero = ({ navigate }) => {
  return (
    <header className="relative isolate overflow-hidden">
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
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-white/80 px-3 py-1 text-sm shadow-sm ring-1 ring-black/5">
            <span>Evento solidale</span>
          </div>
          <h1
            className="text-4xl sm:text-6xl font-extrabold tracking-tight"
            style={{ color: THEME.ink }}
          >
            {EVENT_CONFIG.title}
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl text-slate-900/95">
            {EVENT_CONFIG.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center text-sm">
            <div className="px-3 py-2 rounded-xl bg-white/90 shadow ring-1 ring-black/10">
              <strong>Quando:</strong> {EVENT_CONFIG.date}
            </div>
            <div className="px-3 py-2 rounded-xl bg-white/90 shadow ring-1 ring-black/10">
              <strong>Dove:</strong> {EVENT_CONFIG.location}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#/donate"
              onClick={(e) => {
                e.preventDefault();
                navigate('donate');
              }}
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold text-white shadow focus:outline-none focus:ring-2"
              style={{ backgroundColor: THEME.primary }}
            >
              Dona ora
            </a>
            <a
              href="#/beneficiary"
              onClick={(e) => {
                e.preventDefault();
                navigate('beneficiary');
              }}
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold bg-white text-slate-900 shadow ring-1 ring-black/5 hover:bg-slate-50"
            >
              Beneficiario
            </a>
            <a
              href="#/bike"
              onClick={(e) => {
                e.preventDefault();
                navigate('bike');
              }}
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold bg-white text-slate-900 shadow ring-1 ring-black/5 hover:bg-slate-50"
            >
              Iscriviti: Bici
            </a>
            <a
              href="#/soccer"
              onClick={(e) => {
                e.preventDefault();
                navigate('soccer');
              }}
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold bg-white text-slate-900 shadow ring-1 ring-black/5 hover:bg-slate-50"
            >
              Iscriviti: Calcio
            </a>
            <a
              href="#/run"
              onClick={(e) => {
                e.preventDefault();
                navigate('run');
              }}
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold bg-white text-slate-900 shadow ring-1 ring-black/5 hover:bg-slate-50"
            >
              Iscriviti: Corsa
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
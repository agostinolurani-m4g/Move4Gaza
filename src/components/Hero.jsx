import React from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';

const Hero = ({ navigate }) => {
  const poster = EVENT_CONFIG.logoUrl_mix || (import.meta.env.BASE_URL + 'M4G-rosso.jpg');
  return (
    <header className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 -z-10 bg-black/35" />
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-white">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-white/80 px-3 py-1 text-sm shadow-sm ring-1 ring-black/5 text-slate-900">
            <span>Evento solidale</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            {EVENT_CONFIG.title}
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl text-white">
            {EVENT_CONFIG.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center text-sm">
            <div className="px-3 py-2 rounded-xl bg-white/90 text-slate-900 shadow ring-1 ring-black/10">
              <strong>Quando:</strong> {EVENT_CONFIG.date}
            </div>
            <div className="px-3 py-2 rounded-xl bg-white/90 text-slate-900 shadow ring-1 ring-black/10">
              <strong>Dove:</strong> {EVENT_CONFIG.location}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="#/donate" onClick={(e)=>{e.preventDefault();navigate('donate');}}
               className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold text-white shadow focus:outline-none focus:ring-2"
               style={{ backgroundColor: THEME.primary }}>
              Dona ora
            </a>
            <a href="#/beneficiary" onClick={(e)=>{e.preventDefault();navigate('beneficiary');}}
               className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold bg-white text-slate-900 shadow ring-1 ring-black/5 hover:bg-slate-50">
              Beneficiario
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;

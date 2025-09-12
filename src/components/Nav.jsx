import React from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';

// Top navigation bar. Displays the event title or logo and a series of links.
const Nav = ({ navigate }) => {
  const title = EVENT_CONFIG.logoUrl ? (
    <img src={EVENT_CONFIG.logoUrl} alt={EVENT_CONFIG.title} className="h-8 w-auto" />
  ) : (
    <span className="font-extrabold tracking-tight" style={{ color: THEME.primary }}>
      {EVENT_CONFIG.title}
    </span>
  );
  return (
    <nav className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/55 bg-white/70 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            navigate('');
          }}
        >
          {title}
        </a>
        <div className="flex items-center gap-3 text-sm font-medium">
          <a
            href="#/home"
            onClick={(e) => {
              e.preventDefault();
              navigate('home');
            }}
            className="hover:underline"
          >
            Home
          </a>
          <a
            href="#/beneficiary"
            onClick={(e) => {
              e.preventDefault();
              navigate('beneficiary');
            }}
            className="hover:underline"
          >
            Beneficiario
          </a>
          <a
            href="#/bike"
            onClick={(e) => {
              e.preventDefault();
              navigate('bike');
            }}
            className="hover:underline"
          >
            Bici
          </a>
          <a
            href="#/soccer"
            onClick={(e) => {
              e.preventDefault();
              navigate('soccer');
            }}
            className="hover:underline"
          >
            Calcio
          </a>
          <a
            href="#/run"
            onClick={(e) => {
              e.preventDefault();
              navigate('run');
            }}
            className="hover:underline"
          >
            Corsa
          </a>
          <a
            href="#/donate"
            onClick={(e) => {
              e.preventDefault();
              navigate('donate');
            }}
            className="inline-flex items-center rounded-lg px-3 py-1.5 text-white"
            style={{ backgroundColor: THEME.primary }}
          >
            Dona
          </a>
        </div>
      </div>
      {/* Tricolore */}
      <div className="h-1 w-full grid grid-cols-12">
        <div className="col-span-3" style={{ backgroundColor: '#000' }} />
        <div className="col-span-3" style={{ backgroundColor: '#fff' }} />
        <div className="col-span-3" style={{ backgroundColor: THEME.primary }} />
        <div className="col-span-3" style={{ backgroundColor: THEME.accentRed }} />
      </div>
    </nav>
  );
};

export default Nav;
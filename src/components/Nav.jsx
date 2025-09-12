import React from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';

const Nav = ({ navigate }) => {
  const title = EVENT_CONFIG.logoUrl ? (
    <img src={EVENT_CONFIG.logoUrl} alt={EVENT_CONFIG.title} className="h-8 w-auto rounded-md" />
  ) : (
    <span className="font-extrabold tracking-tight" style={{ color: THEME.gradientFrom }}>
      {EVENT_CONFIG.title}
    </span>
  );

  return (
    <nav className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/55 bg-white/70 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a
          href="#/"
          onClick={(e) => { e.preventDefault(); navigate(''); }}
        >
          {title}
        </a>
        <div className="flex items-center gap-3 text-sm font-medium">
          {/* voce unica per iscrizione */}
          <a
            href="#/registration"
            onClick={(e) => { e.preventDefault(); navigate('registration'); }}
            className="hover:underline"
          >
            Iscrizione
          </a>
          {/* Donazioni rimane */}
          <a
            href="#/donate"
            onClick={(e) => { e.preventDefault(); navigate('donate'); }}
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

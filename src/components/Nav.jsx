import React from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';

const Nav = ({ navigate }) => {
  const title = EVENT_CONFIG.logoUrl_rosso ? (
    <img
      src={EVENT_CONFIG.logoUrl_rosso}
      alt={EVENT_CONFIG.title}
      className="h-8 w-auto"
    />
  ) : (
    <span className="font-extrabold tracking-tight" style={{ color: THEME.accentRed }}>
      {EVENT_CONFIG.title}
    </span>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/90 isolate backdrop-blur border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a
          href="#/"
          onClick={(e) => { e.preventDefault(); navigate(''); }}
          className="shrink-0"
        >
          {title}
        </a>

        <div className="flex items-center gap-3 text-sm font-medium">
            <a
              href="#/menu"
              onClick={(e) => { e.preventDefault(); navigate('menu'); }}
              className="hover:underline"
            >
              Menu
            </a>

          <a
            href="#/registration"
            onClick={(e) => { e.preventDefault(); navigate('registration'); }}
            className="hover:underline"
          >
            Iscrizione
          </a>

          <a
            href="#/donate"
            onClick={(e) => { e.preventDefault(); navigate('donate'); }}
            className="inline-flex items-center rounded-full px-4 py-1.5 text-white"
            style={{ backgroundColor: THEME.primary }}
          >
            Dona ora
          </a>
        </div>
      </div>
      
      {/* Tricolore */}
      <div className="h-2 w-full grid grid-cols-12">
        <div className="col-span-3" style={{ backgroundColor: '#000' }} />
        <div className="col-span-3" style={{ backgroundColor: '#fff' }} />
        <div className="col-span-3" style={{ backgroundColor: THEME.primary }} />
        <div className="col-span-3" style={{ backgroundColor: THEME.accentRed }} />
      </div>
    </nav>
  );
};

export default Nav;
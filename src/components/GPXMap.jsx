import React, { useState, useEffect } from 'react';
import { loadGPX } from '../utils/gpx.js';
import { THEME } from '../config.js';

// Display a simple polyline map for a GPX route. Shows distance and elevation gain.
const GPXMap = ({ src, label, downloadName = 'route.gpx' }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    let mounted = true;
    if (src) {
      loadGPX(src)
        .then((d) => {
          if (mounted) setData(d);
        })
        .catch(() => {
          if (mounted) setData(null);
        });
    }
    return () => {
      mounted = false;
    };
  }, [src]);

  if (!src) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm bg-white">
        GPX non impostato.
      </div>
    );
  }
  if (!data) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm bg-white">
        Caricamento GPX…
      </div>
    );
  }
  // compute bounding box and scale to fit a fixed SVG
  const lats = data.points.map((p) => p.lat);
  const lons = data.points.map((p) => p.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const w = 640;
  const h = 360;
  const pad = 20;
  const sx = (w - 2 * pad) / (maxLon - minLon || 1);
  const sy = (h - 2 * pad) / (maxLat - minLat || 1);
  const s = Math.min(sx, sy);
  const path = data.points
    .map((p) => {
      const x = pad + (p.lon - minLon) * s;
      const y = h - (pad + (p.lat - minLat) * s);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/10">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
        <rect x="0" y="0" width={w} height={h} fill="#fff" />
        <polyline
          points={path}
          fill="none"
          stroke={THEME.primary}
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-lg bg-emerald-50 px-2 py-1 ring-1 ring-emerald-200">
          Distanza stimata: <strong>{data.distanceKm.toFixed(1)} km</strong>
        </span>
        <span className="rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-200">
          Dislivello+: <strong>{data.gainM} m</strong> (dati GPX)
        </span>
        <a
          href={src}
          download={downloadName}
          className="ml-auto rounded-lg px-3 py-1.5 ring-1 ring-black/10 bg-white hover:bg-slate-50"
        >
          Scarica GPX
        </a>
      </div>
      {label && <p className="mt-2 text-xs text-slate-600">{label}</p>}
    </div>
  );
};

export default GPXMap;

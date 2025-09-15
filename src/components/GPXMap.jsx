import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { loadGPX } from '../utils/gpx.js';
import { THEME } from '../config.js';
import 'leaflet/dist/leaflet.css';

const GPXMap = ({ src, label, downloadName = 'route.gpx' }) => {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  const mapRef = useRef(null);        // istanza Leaflet
  const trackGroupRef = useRef(null); // LayerGroup con le polylines
  const containerRef = useRef(null);  // div DOM che ospita la mappa

  // carica GPX
  useEffect(() => {
    let mounted = true;
    setErr(null);
    setData(null);
    if (!src) return;
    loadGPX(src)
      .then((d) => {
        if (!mounted) return;
        if (!d?.points?.length) {
          setErr('Nessun punto valido nel GPX.');
          setData({ points: [], distanceKm: 0, gainM: 0 });
          return;
        }
        setData(d);
      })
      .catch((e) => {
        console.error('loadGPX failed:', e);
        if (mounted) {
          setErr('Errore nel caricamento del GPX.');
          setData({ points: [], distanceKm: 0, gainM: 0 });
        }
      });
    return () => { mounted = false; };
  }, [src]);

  // inizializza la mappa una sola volta
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    trackGroupRef.current = L.layerGroup().addTo(map);

    // fallback iniziale per non vedere “terra piatta”
    map.setView([0, 0], 2);

    return () => {
      // cleanup completo
      try {
        map.remove();
      } catch {}
      mapRef.current = null;
      trackGroupRef.current = null;
    };
  }, []);

  // prepara i punti sicuri
  const latlngs = useMemo(() => {
    const pts = (data?.points ?? [])
      .map((p) => [Number(p.lat), Number(p.lon)])
      .filter(
        ([lat, lng]) =>
          Number.isFinite(lat) &&
          Number.isFinite(lng) &&
          lat >= -90 &&
          lat <= 90 &&
          lng >= -180 &&
          lng <= 180
      );
    if (!pts.length) return [];
    return pts;
  }, [data?.points]);

  // disegna/aggiorna la traccia e adatta la vista
  useEffect(() => {
    const map = mapRef.current;
    const group = trackGroupRef.current;
    if (!map || !group) return;

    // pulisci vecchia traccia
    group.clearLayers();

    if (!latlngs.length) return;

    try {
      if (latlngs.length === 1) {
        map.setView(latlngs[0], 14);
      } else {
        // glow bianco
        L.polyline(latlngs, {
          color: '#ffffff',
          weight: 8,
          opacity: 0.9,
          lineJoin: 'round',
          lineCap: 'round',
        }).addTo(group);
        // linea tema
        L.polyline(latlngs, {
          color: THEME.primary,
          weight: 4,
          lineJoin: 'round',
          lineCap: 'round',
        }).addTo(group);

        const bounds = L.latLngBounds(latlngs);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [24, 24], maxZoom: 17 });
        } else {
          map.setView(latlngs[0], 14);
        }
      }
    } catch (e) {
      console.error('Drawing error:', e);
      map.setView(latlngs[0] ?? [0, 0], 13);
    }
  }, [latlngs]);

  // UI di stato
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

  return (
    <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/10">
      {/* Wrapper con aspect ratio e container assoluto per Leaflet */}
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
        <div ref={containerRef} className="absolute inset-0" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-lg bg-emerald-50 px-2 py-1 ring-1 ring-emerald-200">
          Distanza stimata:{' '}
          <strong>
            {typeof data.distanceKm === 'number' ? data.distanceKm.toFixed(1) : '—'} km
          </strong>
        </span>
        <span className="rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-200">
          Dislivello+: <strong>{data.gainM ?? '—'} m</strong> (dati GPX)
        </span>
        <a
          href={src}
          download={downloadName}
          className="ml-auto rounded-lg px-3 py-1.5 ring-1 ring-black/10 bg-white hover:bg-slate-50"
        >
          Scarica GPX
        </a>
      </div>

      {err && <p className="mt-2 text-xs text-rose-600">{err}</p>}
      {label && <p className="mt-2 text-xs text-slate-600">{label}</p>}
    </div>
  );
};

export default GPXMap;

// Helper functions to communicate with the Google Sheets backend via JSONP.
// The original implementation uses dynamic script tags to bypass CORS and
// store pledges, registrations and statistics in a spreadsheet.

import { SHEETS_CONFIG } from './config.js';

// POST → via GET “beacon” per evitare CORS e 302
export async function postSheet(type, payload) {
  try {
    if (!SHEETS_CONFIG.url) return;
    const u = new URL(SHEETS_CONFIG.url);
    u.searchParams.set("secret", SHEETS_CONFIG.secret);
    u.searchParams.set("type", type);
    u.searchParams.set("payload", JSON.stringify(payload));
    u.searchParams.set("t", Date.now());
    // create a beacon by instantiating an image; response is not consumed
    const img = new Image();
    img.src = u.toString();
  } catch {
    /* noop */
  }
}

export function fetchRegistrationsJSONP(kind = 'bike', limit = 50) {
  return new Promise((resolve) => {
    if (!SHEETS_CONFIG.url) return resolve([]);
    const cb = 'cb_regs_' + Math.random().toString(36).slice(2);
    window[cb] = (data) => {
      resolve(data?.items || []);
      try { delete window[cb]; } catch {}
    };
    const s = document.createElement('script');
    const u = new URL(SHEETS_CONFIG.url);
    u.searchParams.set('secret', SHEETS_CONFIG.secret);
    u.searchParams.set('type', 'registrations');
    u.searchParams.set('kind', kind);
    u.searchParams.set('limit', String(limit));
    u.searchParams.set('callback', cb);
    u.searchParams.set('t', Date.now());
    s.src = u.toString();
    document.body.appendChild(s);
    setTimeout(() => resolve([]), 8000);
  });
}

// Fetch the most recent paid pledges using JSONP. The sheet script will
// return an object with an items array that contains donations.
export function fetchRecentDonationsJSONP(limit = 6) {
  return new Promise((resolve) => {
    if (!SHEETS_CONFIG.url) return resolve([]);
    const cb = 'cb_recent_' + Math.random().toString(36).slice(2);
    // assign callback on window so JSONP can resolve
    window[cb] = (data) => {
      resolve(data?.items || []);
      try { delete window[cb]; } catch {}
    };
    const s = document.createElement('script');
    const u = new URL(SHEETS_CONFIG.url);
    u.searchParams.set('secret', SHEETS_CONFIG.secret);
    u.searchParams.set('type', 'recent');
    u.searchParams.set('limit', String(limit));
    u.searchParams.set('callback', cb);
    u.searchParams.set('t', Date.now());
    s.src = u.toString();
    document.body.appendChild(s);
    // fall back after timeout
    setTimeout(() => resolve([]), 8000);
  });
}

// Fetch the top teams by donation amount for a given kind (soccer | run | bike).
export function fetchTopTeamsJSONP(kind = 'soccer', limit = 5) {
  return new Promise((resolve) => {
    if (!SHEETS_CONFIG.url) return resolve([]);
    const cb = 'cb_top_' + Math.random().toString(36).slice(2);
    window[cb] = (data) => {
      resolve(data?.items || []);
      try { delete window[cb]; } catch {}
    };
    const s = document.createElement('script');
    const u = new URL(SHEETS_CONFIG.url);
    u.searchParams.set('secret', SHEETS_CONFIG.secret);
    u.searchParams.set('type', 'top_teams');
    u.searchParams.set('kind', kind);
    u.searchParams.set('limit', String(limit));
    u.searchParams.set('callback', cb);
    u.searchParams.set('t', Date.now());
    s.src = u.toString();
    document.body.appendChild(s);
    setTimeout(() => resolve([]), 8000);
  });
}

export function fetchSheetStatsJSONP() {
  return new Promise((resolve, reject) => {
    if (!SHEETS_CONFIG.url) return resolve(null);
    const cb = 'cb_stats_' + Math.random().toString(36).slice(2);
    window[cb] = (data) => {
      const normalized = normalizeStatsPayload(data);
      resolve(normalized);
      try { delete window[cb]; } catch {}
    };
    const s = document.createElement('script');
    const u = new URL(SHEETS_CONFIG.url);
    u.searchParams.set('secret', SHEETS_CONFIG.secret);
    u.searchParams.set('type', 'stats');
    u.searchParams.set('callback', cb);
    u.searchParams.set('t', Date.now());
    s.src = u.toString();
    s.onerror = () => reject(new Error('JSONP stats load failed'));
    document.body.appendChild(s);
    setTimeout(() => resolve(null), 8000);
  });
}

// --- helpers ---------------------------------------------------------------

function normalizeStatsPayload(data) {
  const d = data || {};
  const totals = d.totals || {};
  // preferisci runnersRun; se non presente prova alias runRunners; fallback 0
  const runnersRun =
    typeof totals.runnersRun === 'number' ? totals.runnersRun :
    typeof totals.runRunners === 'number' ? totals.runRunners : 0;

  return {
    ...d,
    totals: {
      ...totals,
      // chiave “ufficiale”
      runnersRun,
      // alias comodo in lettura (stesso valore)
      runRunners: runnersRun,
      // teamsRun resta invariato per retrocompatibilità lato UI
    }
  };
}

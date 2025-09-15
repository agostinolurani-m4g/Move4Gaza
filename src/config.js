// Configuration constants for the Move for Gaza application.
// This file centralizes values such as payment gateways, event details,
// Google Sheets integration and styling primitives so they can be imported
// across the codebase.

// PayPal configuration: replace clientId with your own (live or sandbox).
export const PAYPAL = {
  clientId: "AQJGJ8rTlz29WFa-X433va3K41KM85VYRGr6NhOjkexoJNMfqcQROL5ycfTuZ87-v7zMmGlqOBLvre9f",
  currency: "EUR",
};

// Main event configuration describing the high‑level details of the fundraiser
// and the available disciplines. The import.meta.env.BASE_URL prefix is
// preserved to ensure relative assets are resolved correctly by the bundler.
export const EVENT_CONFIG = {
  title: "Move for Gaza",
  tagline: "Pedala, gioca, corri — insieme per Gaza",
  date: "25 ottobre 2025",
  location: "Campo sportivo Olmi, Milano",
  currency: "EUR",
  bike: {
    distances: [
      { key: "112", label: "112 km — Gaza in scala reale" },
      { key: "20",  label: "20 km — percorso cittadino" },
    ],
  },
  // Limiti iscrizioni
  limits: {
    soccerTeamsMax: 24,
    runTeamsMax: 100,
  },
  // Percorsi & file pubblici (metti i 3 .gpx in public/routes/)
  routes: {
    bike: {
      "112": {
        gpx: import.meta.env.BASE_URL + "routes/rideforgaza112.gpx",
        stravaRouteId: "",
        stravaSegmentUrl: "",
      },
      "20":  {
        gpx: import.meta.env.BASE_URL + "routes/rideforgaza112.gpx",
        stravaRouteId: "",
        stravaSegmentUrl: "",
      },
    },
    run: {
      gpx: import.meta.env.BASE_URL + "routes/rideforgaza112.gpx",
      stravaRouteId: "",
      stravaSegmentUrl: "",
    },
  },
  payments: { paypalLink: "", iban: "", ibanOwner: "", ibanBank: "", stripeComingSoon: true },
  forms: { bike: "", soccer: "", run: "" },
  logoUrl: import.meta.env.BASE_URL + "/locandina.jpeg",
  logoUrl_rosso: import.meta.env.BASE_URL + "/M4G-rosso.svg",
  logoUrl_verde: import.meta.env.BASE_URL + "/M4G-verde.svg",
  logoUrl_mix: import.meta.env.BASE_URL + "/M4G-mix.svg",
  contactEmail: "",
  whatsapp: "",
  cause: {
    heading: "Perché lo facciamo",
    text: "Evento solidale non competitivo: pedaliamo, giochiamo e corriamo per raccogliere fondi a sostegno degli aiuti umanitari a Gaza. Trasparenza totale su fondi e destinazione.",
  },
  beneficiary: {
    name: "Gaza Sunbirds",
    url: "https://gazasunbirds.org/",
    logoUrl: import.meta.env.BASE_URL + "/sunbirds-logo.png",
    cf: "",
    address: "Gaza / London (team & fiscal hosts)",
    blurb: "The Gaza Sunbirds are Palestine’s para-cycling team, gaining global recognition over the last 22 months for their courageous aid missions and global sporting achievements.",
    links: {
      missionUrl: "https://gazasunbirds.org/about-us/mission/",
      aboutUrl: "https://gazasunbirds.org/about-us/",
      aidUrl: "https://gazasunbirds.org/",
      a4pUrl: "https://gazasunbirds.org/campaigns/a4p/",
      greatRideUrl: "https://gazasunbirds.org/campaigns/great-ride/",
      pizzaPartyUrl: "https://gazasunbirds.org/aid/pizza-party/",
      shopUrl: "https://gazasunbirds.org/shop/",
      contactUrl: "https://gazasunbirds.org/campaigns/contact-us/",
    },
  },
};

// Google Sheets integration configuration for persisting pledges and registrations.
export const SHEETS_CONFIG = {
  url: "https://script.google.com/macros/s/AKfycbw_tcxSBg99HWfLSLp4JkE8BlQWd-XgLEMCwWwnRVyUclLI9aw7vqhyAaufND1qqJkD/exec",
  secret: "Amaro25",
};

// Theme tokens used throughout the app. Colours mirror the existing palette
// defined in the original monolithic file for continuity.
export const THEME = {
  gradientFrom: "#1fb67a",
  gradientVia:   "#12a66a",
  gradientTo:    "#0a7f4b",
  primary:       "#0b8f4d",
  primaryHover:  "#087542",
  accentRed: "#CE1126",
  ink: "rgba(0, 0, 0, 1)",
};

// Compute a subtle background pattern inspired by Palestinian motifs. This is
// encoded as a data URL so it can be applied directly in CSS.
export const PALESTINE_PATTERN = (() => {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
      <defs>
        <pattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse' patternTransform='rotate(45 30 30)'>
          <path d='M0 0H60V60H0Z' fill='white'/>
          <path d='M30 0V60M0 30H60' stroke='#000' stroke-width='0.6' opacity='0.05'/>
        </pattern>
        <g id='star'>
          <polygon points='60,6 74,46 116,46 82,70 94,112 60,86 26,112 38,70 4,46 46,46'
                   fill='none' stroke='${THEME.primary}' stroke-width='1' opacity='0.08'/>
        </g>
      </defs>
      <rect width='120' height='120' fill='url(#grid)'/>
      <use href='#star' x='0'   y='0'/>
      <use href='#star' x='60'  y='0'/>
      <use href='#star' x='0'   y='60'/>
      <use href='#star' x='60'  y='60'/>
      <path d='M-20 120 L60 40 L140 120' fill='none' stroke='#CE1126' stroke-width='2' opacity='0.05'/>
      <path d='M-20 0   L60 80 L140 0'   fill='none' stroke='${THEME.primary}' stroke-width='2' opacity='0.05'/>
    </svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
})();

// Local DB keys and initial state for useDB hook.
export const DB_KEY = "rfg_db_v1";
export const defaultDB = { pledges: [], registrations: { bike: [], soccer: [], run: [] } };
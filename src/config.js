// Configuration constants for the Move for Gaza application.
// This file centralizes values such as payment gateways, event details,
// Google Sheets integration and styling primitives so they can be imported
// across the codebase.

// PayPal configuration: replace clientId with your own (live or sandbox).
export const PAYPAL = {
  clientId: "AQI4LKSbF2Gn6BdWoU3UxeZdvxVfXbwNWmttvKAMr9tsCnDd4xQSL0Kkr0Ck2b086jtFzc392JXBsI4x",
  currency: "EUR",
};

// Main event configuration describing the high‑level details of the fundraiser
// and the available disciplines. The import.meta.env.BASE_URL prefix is
// preserved to ensure relative assets are resolved correctly by the bundler.
export const EVENT_CONFIG = {
  title: "Move for Gaza",
  tagline: "Pedala, gioca, corri — insieme per Gaza",
  date: "18 ottobre 2025",
  // Updated location reflecting the actual venue and address
  location: "Arci Olmi, via degli Ulivi 2, Milano",
  currency: "EUR",
  bike: {
    distances: [
      { key: "112", label: "112 km — Perimetro di Gaza in scala reale" },
      { key: "20",  label: "25 km — percorso cittadino" },
    ],
  },
  arciOlmi: "arci_olmi.jpeg",
  // Limiti iscrizioni
  limits: {
    soccerTeamsMax: 12,
    runTeamsMax: 100,
  },
  descrizione_evento_concreto: "L'evento si divide in due momenti principali, la mattina viene dedicata a manifestazioni sportive non competitive: " +
  "torneo di calcio a 5 (squadre miste), corsa non competitiva (7 km) con possibilità di fare staffetta (7 + 7) aperta a tuttə e giro ciclistico" +
  "a suddi Milano (115 km) presso il campo sportivo dell'Arci Olmi. \n Dopo un pranzo sociale (verso le 14:00) aperto anche a chi non partecipa agli" +
  " eventi sportivi, il pomeriggio è dedicato a momenti di approfondimento e confronto con ospiti e testimonianze dirette dalla Palestina.",

  descrizione_evento_perche: "La Move4Gaza è un evento sportivo non competitivo per raccogliere fondi a sostegno degli aiuti umanitari, " + 
  "nasce dall'esigenza di fare qualcosa di concreto per la popolazione di Gaza, in questo momento drammatico, con l'obiettivo e la sperzanza" + 
  "non solo di contribuire in maniera concreta, ma di dare la possibilità a tuttə le persone che in questo momento come noi vogliono cambiare le cose" + 
  " di poterlo fare, ma soprattutto di poter costruire in futuro qualcosa di molto più grande ed importante. \n" +
  "La sensazione di impotenza che proviamo non deve fermarci, possiamo fare molte cose, speriamo che oggi nasca una nuova consapevolezza di ciò che possiamo fare.",
  
  descrizione_calcio: "Il torneo di calcio non competitivo a 5 si svolge presso il campo sportivo dell'Arci Olmi a Milano. " +
  "Le squadre sono miste e aperte a tuttə, ogni squadra gioca 3 partite da 20 minuti, tra una partita ci saranno momenti per mangiare o bere" +
  " qualcosa. La donazione minima consigliata è di 100 € a squadra (20 € a persona), chi vuole può donare di più. \n" +
  "Il torneo inizia alle 9:30 e finisce verso le 13:00, dopo il torneo c'è la possibilità di partecipare al pranzo sociale (non incluso nella donazione)." +
  "Il quadro delle squadre verrà comunicato qualche giorno prima dell'evento, se avete necessità particolari (orari, composizione squadra ecc) scriveteci pure.",

  descrizione_bici: "Il percorso lungo circa 115 km ricalca la lunghezza del perimetro della striscia di Gaza con partenza ed arrivo " +
  "all'Arci Olmi di Milano dove si svolgerà l'evento. Il percorso si snoda su strade secondarie e piste ciclabili, con alcuni tratti " +
  "sterrati. Il dislivello è di circa 300 m. Non è una gara, ma un evento sociale e solidale, si raccomanda di pedalare in sicurezza. " +
  "Dopo Pavia segnaliamo scarsita di punti di ristoro da tenere in considerazione.", 

  descrizione_corsa: "La corsa non competitiva di circa 7 km si svolge su un percorso cittadino che parte e arriva all'Arci Olmi di Milano. " +
  "Il percorso è adatto a tuttə, con la possibilità di fare una staffetta in due persone. La donazione minima consigliata è di 20 € a persona, " +
  "chi vuole può donare di più. \n La corsa inizia tra le 10:00 e le 11:00 (partenza alla francese) e finisce verso le 14:00, seguita dal pranzo sociale " +
  "(non incluso nella donazione). Durante la corsa non sono previsti punti di ristoro e assistenza medica, il tracciato gps è scaricabile e il tracciato sarà segnato.",
  // Percorsi & file pubblici (metti i 3 .gpx in public/routes/)
  routes: {
    bike: {
      "112": {
        gpx: import.meta.env.BASE_URL + "routes/rideforgaza112.gpx",
        stravaRouteId: "",
        stravaSegmentUrl: "",
      },
      "20":  {
        gpx: import.meta.env.BASE_URL + "routes/amgaz_bici_short.gpx",
        stravaRouteId: "",
        stravaSegmentUrl: "",
      },
    },
    run: {
      gpx: import.meta.env.BASE_URL + "routes/amgaz_corsa.gpx",
      stravaRouteId: "",
      stravaSegmentUrl: "",
    },
  },
  payments: { paypalLink: "", iban: "", ibanOwner: "", ibanBank: "", stripeComingSoon: true },
  forms: { bike: "", soccer: "", run: "" },
  // Use the updated locandina PNG as default poster
  logoUrl: import.meta.env.BASE_URL + "/locandina.png",
  logoUrl_rosso: import.meta.env.BASE_URL + "/M4G-rosso.svg",
  logoUrl_verde: import.meta.env.BASE_URL + "/M4G-verde.svg",
  // Default poster fallback uses the same locandina PNG
  logoUrl_mix: import.meta.env.BASE_URL + "/M4G-mix.svg",
  contactEmail: "",
  whatsapp: "",
  cause: {
    heading: "Perché lo facciamo",
    text: "Pedaliamo, giochiamo e corriamo per raccogliere fondi destinati ad aiuti umanitari a Gaza tramite l'associazione Gaza Sunbirds.\n" + 
    "Il ricavato verrà utilizzato per finanziare missioni di aiuti umanitari, acquisto di medicinali e attrezzature mediche, supporto alle famiglie colpite dai bombardamenti e altre iniziative di mutual aid sul territorio.",
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
  // Updated palette reflecting the Palestinian flag: red, white, green and black
  gradientFrom: "#e62f37",
  gradientVia:   "#FFFFFF",
  gradientTo:    "#007A3D",
  primary:       "#009739",
  primaryHover:  "#006A35",
  accentRed:     "#e62f37",
  ink:           "#000000",
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
      <path d='M-20 120 L60 40 L140 120' fill='none' stroke='${THEME.accentRed}' stroke-width='2' opacity='0.05'/>
      <path d='M-20 0   L60 80 L140 0'   fill='none' stroke='${THEME.primary}' stroke-width='2' opacity='0.05'/>
    </svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
})();

// Local DB keys and initial state for useDB hook.
export const DB_KEY = "rfg_db_v1";
export const defaultDB = { pledges: [], registrations: { bike: [], soccer: [], run: [] } };
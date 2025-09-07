import React, { useEffect, useMemo, useState } from "react";

const PAYPAL = {
  clientId: "AQJGJ8rTlz29WFa-X433va3K41KM85VYRGr6NhOjkexoJNMfqcQROL5ycfTuZ87-v7zMmGlqOBLvre9f", // PayPal Client ID
  currency: "EUR",
};

const EVENT_CONFIG = {
  title: "Move for Gaza",
  tagline: "Pedala, gioca, corri — insieme per Gaza",
  date: "25 ottobre 2025",
  location: "Campo sportivo Olmi, Milano",
  currency: "EUR",
  payments: { paypalLink: "", iban: "", ibanOwner: "", ibanBank: "", stripeComingSoon: true },
  forms: { bike: "", soccer: "", run: "" },
  logoUrl: "",
  contactEmail: "",
  whatsapp: "",
  cause: {
    heading: "Perché lo facciamo",
    text: "Evento solidale non competitivo: pedaliamo, giochiamo e corriamo per raccogliere fondi a sostegno degli aiuti umanitari a Gaza. Trasparenza totale su fondi e destinazione.",
  },
  beneficiary: {
    name: "Gaza Sunbirds",
    url: "https://gazasunbirds.org/",
    logoUrl: "https://gazasunbirds.org/wp-content/uploads/2024/04/cropped-Gaza-Sunbirds-Logo-Blue-1-192x192.png",
    cf: "", // se non disponibile, lascia vuoto
    address: "Gaza / London (team & fiscal hosts)",
    blurb: "Team di paraciclismo nato a Gaza, oggi focalizzato su mutual aid e programmi sportivi per amputati; attiv* dal 2020.",
    links: {
      missionUrl: "https://gazasunbirds.org/about-us/mission/",
      aboutUrl: "https://gazasunbirds.org/about-us/",
      aidUrl: "https://gazasunbirds.org/",
      a4pUrl: "https://gazasunbirds.org/campaigns/a4p/",
      greatRideUrl: "https://gazasunbirds.org/campaigns/great-ride/",
      pizzaPartyUrl: "https://gazasunbirds.org/aid/pizza-party/",
      shopUrl: "https://gazasunbirds.org/shop/",
      contactUrl: "https://gazasunbirds.org/campaigns/contact-us/"
    }
  },
};

const SHEETS_CONFIG = {
  url: "https://script.google.com/macros/s/AKfycbw_tcxSBg99HWfLSLp4JkE8BlQWd-XgLEMCwWwnRVyUclLI9aw7vqhyAaufND1qqJkD/exec",
  secret: "Amaro25"
};

async function postSheet(type, payload) {
  try {
    if (!SHEETS_CONFIG.url) return;
    const u = new URL(SHEETS_CONFIG.url);     // deve essere l’URL /exec
    u.searchParams.set("secret", SHEETS_CONFIG.secret);
    u.searchParams.set("type", type);
    u.searchParams.set("payload", JSON.stringify(payload));
    u.searchParams.set("t", Date.now());      // anti-cache
    // beacon senza CORS: la vedi in Network come tipo "Img"
    const img = new Image();
    img.src = u.toString();
  } catch {}
}

const THEME = {
  gradientFrom: "#34d399",
  gradientVia: "#10b981",
  gradientTo: "#059669",
  primary: "#007A3D",
  primaryHover: "#005c2d",
  accentRed: "#CE1126",
  ink: "#ece829ff",
};

const DB_KEY = "rfg_db_v1";
const defaultDB = { pledges: [], registrations: { bike: [], soccer: [], run: [] } };

function usePayPalSdk() {
  const [ready, setReady] = React.useState(!!window.paypal);
  React.useEffect(() => {
    if (window.paypal) return;
    const s = document.createElement("script");
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL.clientId}&currency=${PAYPAL.currency}&components=buttons`;
    s.onload = () => (setReady(true));
    document.body.appendChild(s);
  }, []);
  return ready || !!window.paypal;
}

function useDB() {
  const [db, setDB] = useState(defaultDB);
  useEffect(() => { try { const raw = localStorage.getItem(DB_KEY); if (raw) setDB(JSON.parse(raw)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch {} }, [db]);

  const addPledge = (p) => {
    const id = `plg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`;
    const rec = { id, status: "pledged", createdAt: new Date().toISOString(), ...p };
    setDB((d) => ({ ...d, pledges: [rec, ...d.pledges] })); return rec;
  };

  const markPledgePaid = (id, reference = "", confirmedAmount) => {
    setDB((d) => ({
      ...d,
      pledges: d.pledges.map((pl) =>
        pl.id === id
          ? {
              ...pl,
              status: "paid",
              paidAt: new Date().toISOString(),
              reference,
              amount: confirmedAmount ?? pl.amount,
            }
          : pl
      ),
    }));
  };

  const addRegistration = (type, rec) => {
    const id = `reg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`;
    const record = { id, createdAt: new Date().toISOString(), ...rec };
    setDB((d) => ({ ...d, registrations: { ...d.registrations, [type]: [record, ...d.registrations[type]] } }));
    return record;
  };

  const derived = useMemo(() => {
    const raised = db.pledges.filter(p => p.status === "paid").reduce((s,p)=> s + (Number(p.amount)||0), 0);
    const teamsSoccer = new Set(db.registrations.soccer.map(t => (t.teamName||"").trim().toLowerCase())).size;
    const teamsRun = new Set(db.registrations.run.map(t => (t.teamName||"").trim().toLowerCase())).size;
    const riders = db.registrations.bike.length;
    return { raised, teamsSoccer, teamsRun, riders };
  }, [db]);

  return { db, addPledge, markPledgePaid, addRegistration, derived };
}

function formatCurrency(amount, currency = "EUR") {
  try { return new Intl.NumberFormat("it-IT", { style: "currency", currency }).format(Number(amount||0)); } catch { return `${amount} ${currency}`; }
}

function useRoute() {
  const parse = () => (typeof window === "undefined" ? "home" : (window.location.hash.replace('#/','').replace('#','') || "home"));
  const [route, setRoute] = useState(parse());
  useEffect(() => { const onHash = () => setRoute(parse()); window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash); }, []);
  return [route, (to) => { if (typeof window !== 'undefined') window.location.hash = to ? `#/${to}` : '#/'; }];
}

function Nav({ navigate }) {
  const title = EVENT_CONFIG.logoUrl ? (
    <img src={EVENT_CONFIG.logoUrl} alt={EVENT_CONFIG.title} className="h-8 w-auto" />
  ) : (
    <span className="font-extrabold tracking-tight" style={{ color: THEME.primary }}>{EVENT_CONFIG.title}</span>
  );
  return (
    <nav className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/55 bg-white/70 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#/" onClick={(e)=>{e.preventDefault(); navigate('');}}>{title}</a>
        <div className="flex items-center gap-3 text-sm font-medium">
          <a href="#/beneficiary" onClick={(e)=>{e.preventDefault(); navigate('beneficiary');}} className="hover:underline">Associazione</a>
          <a href="#/bike" onClick={(e)=>{e.preventDefault(); navigate('bike');}} className="hover:underline">Bici</a>
          <a href="#/soccer" onClick={(e)=>{e.preventDefault(); navigate('soccer');}} className="hover:underline">Calcio</a>
          <a href="#/run" onClick={(e)=>{e.preventDefault(); navigate('run');}} className="hover:underline">Corsa</a>
          <a href="#/db" onClick={(e)=>{e.preventDefault(); navigate('db');}} className="hover:underline">DB</a>
          <a href="#/donate" onClick={(e)=>{e.preventDefault(); navigate('donate');}} className="inline-flex items-center rounded-lg px-3 py-1.5 text-white" style={{ backgroundColor: THEME.primary }}>Dona</a>
        </div>
      </div>
      <div className="h-1 w-full grid grid-cols-12">
        <div className="col-span-3" style={{ backgroundColor: '#000' }} />
        <div className="col-span-3" style={{ backgroundColor: '#fff' }} />
        <div className="col-span-3" style={{ backgroundColor: THEME.primary }} />
        <div className="col-span-3" style={{ backgroundColor: THEME.accentRed }} />
      </div>
    </nav>
  );
}

function PageBeneficiary() {
  const B = EVENT_CONFIG.beneficiary || {};
  const L = B.links || {};
  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        {/* HERO con logo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
          {B.logoUrl && (
            <img src={B.logoUrl} alt={`${B.name} logo`}
                 className="w-20 h-20 rounded-xl ring-1 ring-black/10 object-contain bg-white" />
          )}
          <div>
            <h1 className="text-3xl font-extrabold">{B.name}</h1>
            <p className="text-slate-700 mt-1">{B.blurb}</p>
            <div className="mt-2 text-sm">
              {B.url && <a href={B.url} target="_blank" rel="noreferrer" className="underline mr-3">Sito ufficiale</a>}
              {L.contactUrl && <a href={L.contactUrl} target="_blank" rel="noreferrer" className="underline">Contatti</a>}
            </div>
          </div>
        </div>

        {/* INFO BOX */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold">Chi sono</h3>
            <p className="text-sm text-slate-700 mt-1">
              Team di paraciclismo fondato a Gaza; dal 2020 costruiscono percorsi per amputatə e atleti con disabilità,
              e oggi coordinano mutual aid sul territorio. <a className="underline" target="_blank" rel="noreferrer" href={L.aboutUrl || B.url}>Scopri di più</a>.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold">Missione</h3>
            <p className="text-sm text-slate-700 mt-1">
              Missione riallineata alla protezione dei civili tramite aiuti comunitari e programmi sportivi accessibili.
              <a className="underline ml-1" target="_blank" rel="noreferrer" href={L.missionUrl}>Mission</a>.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold">Dove vanno i fondi</h3>
            <p className="text-sm text-slate-700 mt-1">
              Acquisto locale di beni essenziali, distribuzioni, progetti di inclusione e sport. Report, campagne e shop ufficiale sul loro sito.
            </p>
          </div>
        </div>

        {/* CARD LINK – iniziative */}
        <div className="grid md:grid-cols-3 gap-4">
          <BeneficiaryCard title="Aid & Programmi" href={L.aidUrl}
            desc="Distribuzioni locali, reti di volontari, aggiornamenti dal campo." />
          <BeneficiaryCard title="Athletes for Palestine" href={L.a4pUrl}
            desc="Campagna che coinvolge la comunità sportiva globale." />
          <BeneficiaryCard title="Great Ride of Return" href={L.greatRideUrl}
            desc="Pedalate solidali e raccolte fondi nel mondo." />
          <BeneficiaryCard title="Pizza Party" href={L.pizzaPartyUrl}
            desc="Pasti caldi come momenti di sollievo per le famiglie." />
          <BeneficiaryCard title="Shop" href={L.shopUrl}
            desc="Merch ufficiale per sostenere i Sunbirds." />
          <BeneficiaryCard title="Contatti" href={L.contactUrl}
            desc="Scrivi al team per partnership e iniziative." />
        </div>

        {/* DATI LEGALI/NOTE */}
        <div className="mt-10 rounded-2xl bg-slate-50 p-5 ring-1 ring-black/5">
          <p className="text-sm text-slate-700">
            {B.cf && (<><strong>CF/P.IVA:</strong> {B.cf} · </>)}
            {B.address && (<><strong>Sede/contatti:</strong> {B.address} · </>)}
            Fonte: sito ufficiale e pagine mission/programmi dei Gaza Sunbirds.
          </p>
        </div>
      </div>
    </section>
  );
}

function BeneficiaryCard({ title, desc, href }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
       className="block rounded-2xl p-5 bg-white shadow-sm ring-1 ring-black/10 hover:shadow-md transition">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-slate-700 mt-1">{desc}</p>
      <span className="inline-block mt-3 text-sm underline">Apri</span>
    </a>
  );
}

function Hero({ navigate }) {
  return (
    <header className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: `linear-gradient(135deg, ${THEME.gradientFrom}, ${THEME.gradientVia}, ${THEME.gradientTo})` }} />
      <div className="absolute inset-0 -z-10 opacity-60" style={{ backgroundImage: `radial-gradient(closest-side, rgba(255,255,255,.25), rgba(255,255,255,0))` }} />
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-white/80 px-3 py-1 text-sm shadow-sm ring-1 ring-black/5"><span>Evento solidale</span></div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight" style={{ color: THEME.ink }}>{EVENT_CONFIG.title}</h1>
          <p className="text-lg sm:text-xl max-w-3xl text-slate-900/95">{EVENT_CONFIG.tagline}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center text-sm">
            <div className="px-3 py-2 rounded-xl bg-white/90 shadow ring-1 ring-black/10"><strong>Quando:</strong> {EVENT_CONFIG.date}</div>
            <div className="px-3 py-2 rounded-xl bg-white/90 shadow ring-1 ring-black/10"><strong>Dove:</strong> {EVENT_CONFIG.location}</div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="#/donate" onClick={(e)=>{e.preventDefault(); navigate('donate');}} className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold text-white shadow focus:outline-none focus:ring-2" style={{ backgroundColor: THEME.primary }}>Dona ora</a>
            <a href="#/beneficiary" onClick={(e)=>{e.preventDefault(); navigate('beneficiary');}} className="hover:underline">Associazione</a>
            <a href="#/bike" onClick={(e)=>{e.preventDefault(); navigate('bike');}} className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold bg-white text-slate-900 shadow ring-1 ring-black/5 hover:bg-slate-50">Iscriviti: Bici</a>
            <a href="#/soccer" onClick={(e)=>{e.preventDefault(); navigate('soccer');}} className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold bg-white text-slate-900 shadow ring-1 ring-black/5 hover:bg-slate-50">Iscriviti: Calcio</a>
            <a href="#/run" onClick={(e)=>{e.preventDefault(); navigate('run');}} className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold bg-white text-slate-900 shadow ring-1 ring-black/5 hover:bg-slate-50">Iscriviti: Corsa</a>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><p className="font-semibold">{EVENT_CONFIG.title}</p><p className="text-sm text-slate-600">© {new Date().getFullYear()} Tutti i diritti riservati.</p></div>
        <div className="text-sm text-slate-700">
          {EVENT_CONFIG.contactEmail && (<a href={`mailto:${EVENT_CONFIG.contactEmail}`} className="underline">{EVENT_CONFIG.contactEmail}</a>)}
          {EVENT_CONFIG.whatsapp && (<span className="ml-3">WhatsApp: <a href={`https://wa.me/${EVENT_CONFIG.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="underline">{EVENT_CONFIG.whatsapp}</a></span>)}
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-6"><p className="text-xs text-slate-500">Privacy: i dati dei moduli sono usati solo per la gestione dell'evento. Per i pagamenti si applicano le policy dei provider scelti.</p></div>
    </footer>
  );
}

function BeneficiaryBadge({ className = "" }) {
  const B = EVENT_CONFIG.beneficiary || {};
  if (!B?.name) return null;
  return (
    <div className={`mt-4 flex items-center gap-3 text-sm ${className}`}>
      {B.logoUrl && (
        <img
          src={B.logoUrl}
          alt={`${B.name} logo`}
          className="w-10 h-10 rounded-md ring-1 ring-black/10 bg-white"
        />
      )}
      <p className="text-slate-700">
        Donazioni destinate a{" "}
        <a
          className="underline"
          href={B.url}
          target="_blank"
          rel="noreferrer"
        >
          {B.name}
        </a>
        {B.cf ? <> — {B.cf}</> : null}
      </p>
    </div>
  );
}

function PreCheckout({ addPledge, navigate, markPledgePaid }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const [purpose, setPurpose] = useState("donation");
  const [amount, setAmount] = useState(20);
  const [method, setMethod] = useState("paypal");
  const [justCreated, setJustCreated] = useState(null);
  const submit = (e) => { e.preventDefault(); const pledge = addPledge({ name, email, teamName, purpose, amount: Number(amount||0), method }); setJustCreated(pledge); postSheet('pledge', pledge); };
  return (
    <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
      <h3 className="text-lg font-semibold">Registra l'impegno e scegli il metodo</h3>
      <form onSubmit={submit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium">Nome e cognome</label><input value={name} onChange={(e)=>setName(e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div>
        <div><label className="block text-sm font-medium">Email</label><input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div>
        <div><label className="block text-sm font-medium">Squadra (opz.)</label><input value={teamName} onChange={(e)=>setTeamName(e.target.value)} placeholder="nome squadra (se vuoi)" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div>
        <div><label className="block text-sm font-medium">Scopo</label><select value={purpose} onChange={(e)=>setPurpose(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"><option value="donation">Solo donazione</option><option value="bike">Iscrizione Bici</option><option value="soccer">Iscrizione Calcio (squadra)</option><option value="run">Iscrizione Corsa (squadra)</option></select></div>
        <div><label className="block text-sm font-medium">Importo</label><input type="number" min={1} step={1} value={amount} onChange={(e)=>setAmount(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div>
        <div><label className="block text-sm font-medium">Metodo</label><select value={method} onChange={(e)=>setMethod(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"><option value="paypal">PayPal</option><option value="iban">Bonifico (IBAN)</option><option value="stripe" disabled={EVENT_CONFIG.payments.stripeComingSoon}>Stripe (in arrivo)</option></select></div>
        <div className="sm:col-span-2 flex gap-3"><button className="rounded-xl px-4 py-2 font-semibold text-white" style={{ backgroundColor: THEME.primary }}>Salva e mostra pagamento</button><button type="button" onClick={()=>navigate(purpose === 'donation' ? 'donate' : (purpose))} className="rounded-xl px-4 py-2 font-semibold bg-white ring-1 ring-black/10 hover:bg-slate-50">Vai alla pagina attività</button></div>
      </form>
      {justCreated && (<div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
        <p><strong>Pledge registrato.</strong> ID: <code>{justCreated.id}</code></p>
        {method === 'paypal' && justCreated && (
          <PayPalPayBox
            pledge={justCreated}
            onPaid={(amt, orderID) => {
              // 1) aggiorna subito il DB locale con importo reale
              markPledgePaid(justCreated.id, orderID, Number(amt || 0));
              // 2) chiedi verifica al server (Apps Script), che scriverà sullo Sheet
              postSheet('paypal_verify', { pledgeId: justCreated.id, orderID });
            }}
          />
        )}
        {method === 'iban' && (<div className="mt-3"><p className="mb-1">Esegui un bonifico a:</p><ul className="list-disc pl-5"><li><strong>Intestatario:</strong> {EVENT_CONFIG.payments.ibanOwner}</li><li><strong>IBAN:</strong> {EVENT_CONFIG.payments.iban}</li><li><strong>Banca:</strong> {EVENT_CONFIG.payments.ibanBank}</li><li><strong>Causale:</strong> {`Donazione ${EVENT_CONFIG.title} — ${justCreated.id}`}</li></ul><div className="mt-3 flex flex-wrap gap-2"><button onClick={()=>navigator.clipboard?.writeText(EVENT_CONFIG.payments.iban)} className="rounded-lg px-3 py-2 ring-1 ring-black/10 bg-white">Copia IBAN</button><button onClick={()=>navigate(`confirm?${justCreated.id}`)} className="rounded-lg px-3 py-2 text-white" style={{ backgroundColor: THEME.primary }}>Ho effettuato il bonifico</button></div></div>)}
      </div>)}
    </div>
  );
}

// === JSONP loader stats dallo Sheet ===
function fetchSheetStatsJSONP() {
  return new Promise((resolve, reject) => {
    if (!SHEETS_CONFIG.url) return resolve(null);
    const cb = 'cb_stats_' + Math.random().toString(36).slice(2);
    window[cb] = (data) => { resolve(data); try { delete window[cb]; } catch {} };
    const s = document.createElement('script');
    const u = new URL(SHEETS_CONFIG.url);
    u.searchParams.set('secret', SHEETS_CONFIG.secret);
    u.searchParams.set('type', 'stats');
    u.searchParams.set('callback', cb);
    s.src = u.toString();
    s.onerror = reject;
    document.body.appendChild(s);
    // timeout di sicurezza
    setTimeout(() => resolve(null), 8000);
  });
}

function ConfirmPayment({ markPledgePaid, route }) {
  const id = typeof window !== 'undefined' ? (window.location.hash.split('?')[1] || '').replace('#','') : '';
  const [reference, setReference] = useState(""); const [done, setDone] = useState(false);
  const confirm = () => { if (!id) return alert("Nessun ID pledge trovato"); markPledgePaid(id, reference); postSheet('pledge_paid', { id, reference, paidAt: new Date().toISOString(), status: 'paid' }); setDone(true); };
  return (
    <section className="py-12 bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-2xl font-bold">Conferma pagamento</h2>
        <p className="mt-2 text-sm text-slate-700">ID pledge: <code>{id || '—'}</code></p>
        {!done ? (<div className="mt-4 rounded-xl border border-slate-200 p-4"><label className="block text-sm font-medium">Riferimento/ID transazione (opz.)</label><input value={reference} onChange={(e)=>setReference(e.target.value)} placeholder="es. numero ricevuta / causale" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /><button onClick={confirm} className="mt-3 rounded-xl px-4 py-2 font-semibold text-white" style={{ backgroundColor: THEME.primary }}>Conferma come pagato</button></div>) : (<div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">Grazie! Abbiamo registrato il pagamento.</div>)}
      </div>
    </section>
  );
}

function DonatePage({ addPledge, navigate, markPledgePaid }) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Colonna sinistra: testo + beneficiario */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Sostieni l'evento</h2>
          <p className="mt-2 text-slate-700">
            La donazione minima consigliata è <strong>20 €</strong>. Puoi anche
            <strong> iscriverti senza donare subito</strong>.
          </p>
          <ul className="mt-3 text-sm list-disc pl-5 space-y-1">
            <li>PayPal / Bonifico (IBAN) — Stripe in arrivo.</li>
            <li>Ricevuta della donazione = prova di iscrizione (se scegli un'attività).</li>
            <li>Trasparenza: pubblicheremo report finale.</li>
          </ul>
          <BeneficiaryBadge className="mt-4" />
        </div>

        {/* Colonna destra: box di pagamento + badge vicino ai bottoni */}
        <div>
          <PreCheckout addPledge={addPledge} navigate={navigate} markPledgePaid={markPledgePaid} />
          <BeneficiaryBadge className="mt-4" />
        </div>
      </div>
    </section>
  );
}

function PayPalPayBox({ pledge, onPaid }) {
  const ready = usePayPalSdk();
  const boxRef = React.useRef(null);

  React.useEffect(() => {
    if (!ready || !window.paypal || !boxRef.current) return;
    boxRef.current.innerHTML = ""; // reset sul rerender

    window.paypal.Buttons({
      style: { layout: "vertical", shape: "rect" },
      createOrder: (_, actions) => actions.order.create({
        purchase_units: [{ amount: { value: String(pledge.amount || 20) } }]
      }),
      onApprove: async (_, actions) => {
        const details = await actions.order.capture();
        const cap = details?.purchase_units?.[0]?.payments?.captures?.[0];
        const amt = cap?.amount?.value ?? pledge.amount;
        const orderID = details?.id;
        onPaid?.(amt, orderID);
      },
    }).render(boxRef.current);
  }, [ready, pledge?.id, pledge?.amount]);

  return (
    <div className="mt-3">
      <div ref={boxRef} />
      <p className="text-xs text-slate-600 mt-2">
        Dopo il pagamento il totale si aggiorna automaticamente.
      </p>
    </div>
  );
}

function MapPlaceholder({ label }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600 bg-white">
      Mappa {label} in arrivo.
    </div>
  );
}

function PageHome({ navigate, derived, remoteStats }) {
  return (<>
    <Hero navigate={navigate} />
    <section className="-mt-10 relative z-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{
          label: "Soldi raccolti",
          value: formatCurrency((remoteStats?.totals?.raised ?? derived.raised), EVENT_CONFIG.currency)
        },{
          label: "Squadre calcio",
          value: (remoteStats?.totals?.teamsSoccer ?? derived.teamsSoccer)
        },{
          label: "Squadre corsa",
          value: (remoteStats?.totals?.teamsRun ?? derived.teamsRun)
        },{
          label: "Iscritti bici",
          value: (remoteStats?.totals?.riders ?? derived.riders)
        }].map((s,i)=> (
          <div key={i} className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/10">
            <p className="text-sm text-slate-600">{s.label}</p>
            <p className="mt-1 text-2xl font-extrabold" style={{ color: THEME.primary }}>{String(s.value)}</p>
          </div>
        ))}
      </div>
    </section>
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div><h2 className="text-2xl sm:text-3xl font-bold mb-4">{EVENT_CONFIG.cause.heading}</h2><p className="text-base sm:text-lg leading-relaxed">{EVENT_CONFIG.cause.text}</p></div>
        <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10"><h3 className="text-lg font-semibold">Come partecipare</h3><ol className="mt-2 text-sm list-decimal pl-5 space-y-1"><li>Iscriviti a <a href="#/bike" onClick={(e)=>{e.preventDefault(); navigate('bike');}} className="underline">Bici</a>, <a href="#/soccer" onClick={(e)=>{e.preventDefault(); navigate('soccer');}} className="underline">Calcio</a> o <a href="#/run" onClick={(e)=>{e.preventDefault(); navigate('run');}} className="underline">Corsa</a>.</li><li>Se vuoi, registra una donazione da <strong>20 €</strong> o più in <a href="#/donate" onClick={(e)=>{e.preventDefault(); navigate('donate');}} className="underline">Donazioni</a>.</li><li>Arrivo al <strong>centro sportivo</strong>: cibo, interventi, focus; <strong>parcheggio bici sicuro</strong> e <strong>spogliatoi</strong>.</li></ol></div>
      </div>
    </section>
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Attività</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="#/bike" onClick={(e)=>{e.preventDefault(); navigate('bike');}} className="rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"><h3 className="text-xl font-semibold">Giro in bici</h3><p className="mt-2 text-sm text-slate-700">Tracciato che ricalca forma e larghezza della Striscia di Gaza. Ritmo sociale, non competitivo.</p><div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: THEME.primary }}>Dettagli & iscrizione →</div></a>
          <a href="#/soccer" onClick={(e)=>{e.preventDefault(); navigate('soccer');}} className="rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"><h3 className="text-xl font-semibold">Torneo di calcio</h3><p className="mt-2 text-sm text-slate-700">5 vs 5 per l'inclusione. 4 partite da 15'. Aperto a tuttə.</p><div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: THEME.primary }}>Dettagli & iscrizione →</div></a>
          <a href="#/run" onClick={(e)=>{e.preventDefault(); navigate('run');}} className="rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"><h3 className="text-xl font-semibold">Corsa a squadre</h3><p className="mt-2 text-sm text-slate-700">Manifestazione silenziosa e pacifica, partenza dal Duomo.</p><div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: THEME.primary }}>Dettagli & iscrizione →</div></a>
        </div>
          {EVENT_CONFIG.beneficiary && (
            <div className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
              <h3 className="text-lg font-semibold">Beneficiario</h3>
              <p className="mt-1 text-sm text-slate-700">{EVENT_CONFIG.beneficiary.blurb}</p>
              <p className="mt-2 text-sm">
                <a className="underline" href={EVENT_CONFIG.beneficiary.url} target="_blank" rel="noreferrer">
                  {EVENT_CONFIG.beneficiary.name}
                </a> {EVENT_CONFIG.beneficiary.cf ? <>— {EVENT_CONFIG.beneficiary.cf}</> : null}
              </p>
            </div>
          )}
      </div>
    </section>
  </>);
}

function PageBike({ addRegistration, navigate }) {
  const [level, setLevel] = useState("Principiante");
  const submit = (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const plain = Object.fromEntries(fd.entries()); const saved = addRegistration('bike', plain); postSheet('reg_bike', saved); e.currentTarget.reset(); alert('Iscrizione bici registrata. Puoi donare quando vuoi dalla pagina Donazioni.'); navigate(''); };
  return (<>
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: `linear-gradient(135deg, ${THEME.gradientFrom}, ${THEME.gradientVia}, ${THEME.gradientTo})` }} />
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: THEME.ink }}>Giro in bici</h1>
        <p className="mt-2 text-slate-900/90">Percorso sociale, non competitivo. Il tracciato ricalca in <strong>scala reale</strong> la <strong>forma e larghezza della Striscia di Gaza</strong>.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm"><span className="px-3 py-1 rounded-full bg-white/80 ring-1 ring-black/10">Data: {EVENT_CONFIG.date}</span><span className="px-3 py-1 rounded-full bg-white/80 ring-1 ring-black/10">Luogo: {EVENT_CONFIG.location}</span><span className="px-3 py-1 rounded-full bg-white/80 ring-1 ring-black/10">Manifestazione silenziosa e pacifica</span></div>
      </div>
    </section>
    <section className="py-6">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2"><h2 className="text-xl font-semibold mb-2">Mappa</h2><MapPlaceholder label="bici" /></div>
        <aside className="lg:col-span-1 rounded-2xl bg-white p-6 shadow ring-1 ring-black/10"><h3 className="font-semibold">Iscrizione</h3><ul className="mt-2 text-sm list-disc pl-5 space-y-1"><li>Iscrizione <strong>indipendente dalla donazione</strong> (puoi donare dopo).</li><li>Donazione consigliata: <strong>≥ 20 €</strong>.</li></ul><div className="mt-3 flex gap-2"><a href="#/donate" onClick={(e)=>{e.preventDefault(); navigate('donate');}} className="rounded-xl px-4 py-2 font-semibold text-white" style={{ backgroundColor: THEME.primary }}>Vai a donazioni</a></div>
          <p className="mt-3 text-xs text-slate-600">
            Donazioni destinate a <a className="underline" href={EVENT_CONFIG.beneficiary.url} target="_blank" rel="noreferrer">{EVENT_CONFIG.beneficiary.name}</a>.
          </p>
        </aside>
      </div>
    </section>
    <section className="py-2">
      <div className="max-w-3xl mx-auto px-4">
        <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
          <h2 className="text-lg font-semibold">Modulo — Bici (individuale)</h2>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-sm font-medium">Nome</label><input name="name" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div><div><label className="block text-sm font-medium">Cognome</label><input name="surname" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-sm font-medium">Email</label><input type="email" name="email" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div><div><label className="block text-sm font-medium">Telefono</label><input type="tel" name="phone" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text sm font-medium">Livello</label><select name="level" value={level} onChange={(e)=>setLevel(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"><option>Principiante</option><option>Intermedio</option><option>Esperto</option></select></div><div><label className="block text-sm font-medium">Squadra (opz.)</label><input name="teamName" placeholder="nome squadra (se vuoi)" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-sm font-medium">Instagram squadra (opz.)</label><input name="instagram" placeholder="https://instagram.com/tuasquadra" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div><div><label className="block text-sm font-medium">Rif. donazione (opz.)</label><input name="donationRef" placeholder="email/ID ricevuta" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div></div>
            <div className="flex gap-3"><button className="rounded-xl px-4 py-2 font-semibold text-white" style={{ backgroundColor: THEME.primary }}>Invia iscrizione</button></div>
          </form>
        </div>
        <div className="mt-6"><a href="#/" onClick={(e)=>{e.preventDefault(); navigate('');}} className="text-sm font-semibold" style={{ color: THEME.primary }}>← Torna alla home</a></div>
      </div>
    </section>
  </>);
}

function PageSoccer({ addRegistration, navigate }) {
  const [members, setMembers] = useState(6);
  const submit = (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const count = Number(fd.get('count')||members||5); const players = Array.from({ length: count }, (_,i) => fd.get(`player_${i+1}`)).filter(Boolean); const rec = Object.fromEntries(fd.entries()); delete rec.count; const saved = addRegistration('soccer', { ...rec, players, count }); postSheet('reg_soccer', saved); alert('Squadra calcio registrata. Potete donare quando volete.'); navigate(''); };
  return (<>
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: `linear-gradient(135deg, ${THEME.gradientFrom}, ${THEME.gradientVia}, ${THEME.gradientTo})` }} />
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: THEME.ink }}>Torneo di calcio — 5 vs 5</h1>
        <p className="mt-2 text-slate-900/90">Torneo per l'<strong>inclusione</strong>, aperto a tuttə. <strong>Non competitivo</strong>.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm"><span className="px-3 py-1 rounded-full bg-white/80 ring-1 ring-black/10">Data: {EVENT_CONFIG.date}</span><span className="px-3 py-1 rounded-full bg-white/80 ring-1 ring-black/10">Luogo: {EVENT_CONFIG.location}</span><span className="px-3 py-1 rounded-full bg-white/80 ring-1 ring-black/10">Donazione consigliata: 20 € a testa</span></div>
      </div>
    </section>
    <section className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
          <h2 className="text-lg font-semibold">Iscrizione — Calcio (squadra)</h2>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div><label className="block text-sm font-medium">Nome squadra</label><input name="teamName" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-sm font-medium">Instagram (opz.)</label><input name="instagram" placeholder="https://instagram.com/tuasquadra" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div><div><label className="block text-sm font-medium">Email/ID donazione (opz.)</label><input name="donationRef" placeholder="email o ID ricevuta" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-sm font-medium">Referente (capitano)</label><input name="captain" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div><div><label className="block text-sm font-medium">Email referente</label><input type="email" name="email" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-sm font-medium">Telefono</label><input type="tel" name="phone" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div><div><label className="block text-sm font-medium">N. giocatori</label><input type="number" name="count" min={5} max={12} value={members} onChange={(e) => setMembers(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div></div>
            <div className="space-y-2">{[...Array(Math.min(12, Math.max(5, members)))].map((_, i) => (<div key={i}><label className="block text-xs font-medium">Giocatore {i + 1}</label><input name={`player_${i + 1}`} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div>))}</div>
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="fairplay" required /><span>Accetto regolamento fair play.</span></label>
            <div className="flex gap-3"><button className="rounded-xl px-4 py-2 font-semibold text-white" style={{ backgroundColor: THEME.primary }}>Invia iscrizione squadra</button><a href="#/donate" onClick={(e)=>{e.preventDefault(); navigate('donate');}} className="rounded-xl px-4 py-2 font-semibold bg-white ring-1 ring-black/10 hover:bg-slate-50">Fai una donazione</a></div>
          </form>
        </div>
        <div className="mt-6"><a href="#/" onClick={(e)=>{e.preventDefault(); navigate('');}} className="text-sm font-semibold" style={{ color: THEME.primary }}>← Torna alla home</a></div>
      </div>
    </section>
  </>);
}

function PageRun({ addRegistration, navigate }) {
  const [members, setMembers] = useState(4);
  const submit = (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const count = Number(fd.get('count')||members||3); const runners = Array.from({ length: count }, (_,i) => fd.get(`runner_${i+1}`)).filter(Boolean); const rec = Object.fromEntries(fd.entries()); delete rec.count; const saved = addRegistration('run', { ...rec, runners, count }); postSheet('reg_run', saved); alert('Squadra corsa registrata. Potete donare quando volete.'); navigate(''); };
  return (<>
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: `linear-gradient(135deg, ${THEME.gradientFrom}, ${THEME.gradientVia}, ${THEME.gradientTo})` }} />
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: THEME.ink }}>Corsa a squadre — Manifestazione</h1>
        <p className="mt-2 text-slate-900/90">Manifestazione <strong>silenziosa e pacifica</strong>, non competitiva, con <strong>partenza dal Duomo</strong>.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm"><span className="px-3 py-1 rounded-full bg-white/80 ring-1 ring-black/10">Data: {EVENT_CONFIG.date}</span><span className="px-3 py-1 rounded-full bg-white/80 ring-1 ring-black/10">Partenza: Duomo di Milano</span><span className="px-3 py-1 rounded-full bg-white/80 ring-1 ring-black/10">Arrivo: Centro sportivo</span><span className="px-3 py-1 rounded-full bg-white/80 ring-1 ring-black/10">Donazione consigliata: 20 €</span></div>
      </div>
    </section>
    <section className="py-6">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2"><h2 className="text-xl font-semibold mb-2">Mappa</h2><MapPlaceholder label="corsa" /></div>
        <aside className="lg:col-span-1 rounded-2xl bg-white p-6 shadow ring-1 ring-black/10"><h3 className="font-semibold">Iscrizione</h3><ul className="mt-2 text-sm list-disc pl-5 space-y-1"><li>Iscrizione <strong>indipendente dalla donazione</strong>.</li><li>Donazione consigliata: <strong>≥ 20 €</strong> a persona.</li></ul><div className="mt-3 flex gap-2"><a href="#/donate" onClick={(e)=>{e.preventDefault(); navigate('donate');}} className="rounded-xl px-4 py-2 font-semibold text-white" style={{ backgroundColor: THEME.primary }}>Vai a donazioni</a></div></aside>
      </div>
    </section>
    <section className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">
          <h2 className="text-lg font-semibold">Iscrizione — Corsa (squadra)</h2>
          <form onSubmit={submit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1"><label className="block text-sm font-medium">Nome squadra</label><input name="teamName" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div>
            <div className="md:col-span-1"><label className="block text-sm font-medium">Instagram squadra (opz.)</label><input name="instagram" placeholder="https://instagram.com/tuasquadra" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div>
            <div><label className="block text-sm font-medium">Referente</label><input name="captain" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div>
            <div><label className="block text-sm font-medium">Email referente</label><input type="email" name="email" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div>
            <div><label className="block text-sm font-medium">Telefono</label><input type="tel" name="phone" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div>
            <div><label className="block text-sm font-medium">N. componenti</label><input type="number" name="count" min={3} max={10} value={members} onChange={(e) => setMembers(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">{[...Array(Math.min(10, Math.max(3, members)))].map((_, i) => (<div key={i}><label className="block text-xs font-medium">Runner {i + 1}</label><input name={`runner_${i + 1}`} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div>))}</div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-sm font-medium">Rif. donazione (opz.)</label><input name="donationRef" placeholder="email o ID ricevuta" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></div><div className="self-end text-sm"><label className="inline-flex items-center gap-2"><input type="checkbox" name="waiver" required /><span>Dichiaro idoneità fisica dei partecipanti.</span></label></div></div>
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3"><button className="flex-1 rounded-xl px-4 py-2 font-semibold text-white" style={{ backgroundColor: THEME.primary }}>Invia iscrizione squadra</button><a href="#/donate" onClick={(e)=>{e.preventDefault(); navigate('donate');}} className="flex-1 text-center rounded-xl bg-white px-4 py-2 font-semibold ring-1 ring-black/10 hover:bg-slate-50">Fai una donazione</a></div>
          </form>
        </div>
        <div className="mt-6"><a href="#/" onClick={(e)=>{e.preventDefault(); navigate('');}} className="text-sm font-semibold" style={{ color: THEME.primary }}>← Torna alla home</a></div>
      </div>
    </section>
  </>);
}

function DBPage({ db, markPledgePaid }) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Pledges</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="text-left border-b"><th className="py-2 pr-3">ID</th><th className="py-2 pr-3">Nome</th><th className="py-2 pr-3">Email</th><th className="py-2 pr-3">Scopo</th><th className="py-2 pr-3">Metodo</th><th className="py-2 pr-3">€</th><th className="py-2 pr-3">Stato</th><th className="py-2 pr-3">Azioni</th></tr></thead>
              <tbody>
                {db.pledges.map((p)=> (
                  <tr key={p.id} className="border-b">
                    <td className="py-2 pr-3 whitespace-nowrap"><code>{p.id}</code></td>
                    <td className="py-2 pr-3">{p.name}</td>
                    <td className="py-2 pr-3">{p.email}</td>
                    <td className="py-2 pr-3">{p.purpose}</td>
                    <td className="py-2 pr-3">{p.method}</td>
                    <td className="py-2 pr-3">{formatCurrency(p.amount, EVENT_CONFIG.currency)}</td>
                    <td className="py-2 pr-3">{p.status}</td>
                    <td className="py-2 pr-3">{p.status !== 'paid' && (<button onClick={()=>markPledgePaid(p.id)} className="rounded-lg px-3 py-1 text-xs text-white" style={{ backgroundColor: THEME.primary }}>Segna pagato</button>)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Squadre & iscritti</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><h3 className="font-semibold">Calcio</h3><ul className="mt-2 text-sm list-disc pl-5">{db.registrations.soccer.map(t => (<li key={t.id}><span className="font-medium">{t.teamName}</span>{t.instagram ? <> — <a className="underline" href={t.instagram} target="_blank" rel="noreferrer">Instagram</a></> : null} ({t.count||0} giocatori)</li>))}</ul></div>
            <div><h3 className="font-semibold">Corsa</h3><ul className="mt-2 text-sm list-disc pl-5">{db.registrations.run.map(t => (<li key={t.id}><span className="font-medium">{t.teamName}</span>{t.instagram ? <> — <a className="underline" href={t.instagram} target="_blank" rel="noreferrer">Instagram</a></> : null} ({t.count||0} componenti)</li>))}</ul></div>
            <div><h3 className="font-semibold">Bici</h3><ul className="mt-2 text-sm list-disc pl-5">{db.registrations.bike.map(t => (<li key={t.id}><span className="font-medium">{t.name} {t.surname}</span>{t.teamName ? <> — squadra: <span className="font-medium">{t.teamName}</span></> : null}</li>))}</ul></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const { db, addPledge, markPledgePaid, addRegistration, derived } = useDB();
  const [route, navigate] = useRoute();
  const [remoteStats, setRemoteStats] = React.useState(null);
  React.useEffect(() => {
    fetchSheetStatsJSONP().then(setRemoteStats).catch(()=>setRemoteStats(null));
  }, []);

  return (
    <div className="min-h-screen text-slate-900" style={{ background: `linear-gradient(180deg, ${THEME.gradientFrom}, ${THEME.gradientVia}, ${THEME.gradientTo})` }}>
      <Nav navigate={navigate} />
      {route.startsWith('donate') ? (<DonatePage addPledge={addPledge} navigate={navigate} markPledgePaid={markPledgePaid} />)
      : route.startsWith('confirm') ? (<ConfirmPayment markPledgePaid={markPledgePaid} route={route} />)
      : route === 'beneficiary' ? (<PageBeneficiary />)
      : route === 'bike' ? (<PageBike addRegistration={addRegistration} navigate={navigate} />)
      : route === 'soccer' ? (<PageSoccer addRegistration={addRegistration} navigate={navigate} />)
      : route === 'run' ? (<PageRun addRegistration={addRegistration} navigate={navigate} />)
      : route === 'db' ? (<DBPage db={db} markPledgePaid={markPledgePaid} />)
      : (<PageHome navigate={navigate} derived={derived} remoteStats={remoteStats} />)}
      <Footer />
    </div>
  );
}
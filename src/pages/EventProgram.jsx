import React from 'react';
import { EVENT_CONFIG, THEME } from '../config.js';

/**
 * EventProgram.jsx
 * Pagina "Programma" con timeline completa e sotto-sezioni.
 * - Preambolo con schema iper-semplificato dell'agenda
 * - Spiegazione dei 3 eventi principali (calcio, corsa, ciclismo)
 * - Sezione pranzo con slot per i 3 partecipanti alla distribuzione del cibo
 * - Sezione interventi (la più importante) con scaletta dettagliata (relatore, durata, tema, orari)
 * - Mini-agenda dettagliata per ognuno dei 3 momenti
 *
 * Colori e stile ereditano da THEME per restare coerenti con il sito.
 */

// Util helpers (non bloccanti se i campi non esistono in config)
const get = (obj, path, fallback) => {
  try {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj) ?? fallback;
  } catch {
    return fallback;
  }
};

const fmtTime = (t) => t; // i tempi arrivano già formattati tipo "09:30"

// ==== DATI DI DEFAULT (modificabili da config) ====
const DEFAULT_AGENDA = {
  morning: [
    { id: 'soccer', label: 'Calcio', start: '09:30', end: '11:30', location: 'Campi 5vs5' },
    { id: 'run', label: 'Corsa', start: '10:00', end: '11:30', location: 'Percorso 7/14 km' },
    { id: 'bike', label: 'Ciclismo', start: '10:00', end: '13:00', location: 'Lungo & Corto' },
  ],
  lunch: { start: '13:00', end: '15:00', location: 'Area ristoro' },
  talks: { start: '17:00', end: '18:00', location: 'Sala/Palco principale' },
};

const DEFAULT_TALKS = [
  // Esempio struttura: orario, relatore, durata, tema
  { time: '17:00', speaker: 'TBD #1', duration: '10′', topic: 'Introduzione & saluti' },
  { time: '17:10', speaker: 'TBD #2', duration: '15′', topic: 'Progetto e impatto' },
  { time: '17:25', speaker: 'TBD #3', duration: '15′', topic: 'Testimonianza/Case' },
  { time: '17:40', speaker: 'TBD #4', duration: '15′', topic: 'Q&A / conclusioni' },
];

const DEFAULT_LUNCH = {
  description:
    'Pausa pranzo conviviale con piatti semplici e accessibili. Pasti vegetariani disponibili. Porta la tua borraccia!',
  distributors: [
    { name: '—', role: 'Distribuzione' },
    { name: '—', role: 'Cassa/Token' },
    { name: '—', role: 'Cucina' },
  ],
};

// Descrizioni attività (prende calcio dal config; corsa e bici si possono modificare successivamente)
const DEFAULT_ACTIVITIES = {
  soccer: {
    title: 'Torneo di calcio',
    description:
      get(EVENT_CONFIG, 'activities.soccer.description', get(EVENT_CONFIG, 'soccer.description', '5 vs 5 per l\'inclusione. Partite da 15\' per tutti e tutte.')),
    howItWorks: [
      'Squadre miste, 5 vs 5',
      '4 partite da 15′ (girone + finaline)',
      'Iscrizione aperta, spirito non competitivo',
    ],
  },
  run: {
    title: 'Corsa singola e a squadre',
    description:
      get(EVENT_CONFIG, 'activities.run.description', 'Percorso non competitivo di 7 o 14 km. Puoi correre singolarmente o in staffetta.'),
    howItWorks: [
      'Distanze 7 km (1 giro) o 14 km (2 giri)',
      'Singolo o staffetta (2×7 km)',
      'Partenza e arrivo presso il centro sportivo',
    ],
  },
  bike: {
    title: 'Giro in bici — lungo & corto',
    description:
      get(
        EVENT_CONFIG,
        'activities.bike.description',
        'Uscita sociale su due varianti: percorso "corto" accessibile e percorso "lungo" per chi vuole aggiungere chilometri.'
      ),
    howItWorks: [
      'Ritmo sociale, nessuno viene lasciato indietro',
      'Due opzioni: corto (≈25–30 km) e lungo (≈60–70 km)',
      'Casco consigliato; bici in buono stato e luci',
    ],
  },
};

// Componenti UI
const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="max-w-6xl mx-auto px-4 py-10">
    <header className="mb-6">
      <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: THEME.ink }}>
        {subtitle}
      </p>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-black">{title}</h2>
    </header>
    {children}
  </section>
);

const Chip = ({ children }) => (
  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-black/5 text-black mr-2 mb-2">
    {children}
  </span>
);

const Card = ({ children }) => (
  <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/10">{children}</div>
);

const TimelineItem = ({ time, title, location, children }) => (
  <div className="relative pl-6 pb-6">
    <div className="absolute left-0 top-1 w-2 h-2 rounded-full" style={{ backgroundColor: THEME.accentRed }} />
    <div className="ml-2">
      <div className="text-sm text-slate-600">{time} {location ? `• ${location}` : ''}</div>
      <div className="text-lg font-semibold text-black">{title}</div>
      {children ? <div className="mt-2 text-sm text-slate-700">{children}</div> : null}
    </div>
  </div>
);

// Mini agenda chips (preambolo)
const PreambleAgenda = ({ agenda }) => (
  <Section id="preambolo" title="Agenda (overview)" subtitle="Preambolo">
    <div className="rounded-3xl p-[1px]" style={{ background: `linear-gradient(90deg, ${THEME.primary}, ${THEME.accentRed})` }}>
      <div className="rounded-3xl bg-white p-6">
        <div className="flex flex-wrap items-center gap-2">
          {agenda.morning.map((m) => (
            <Chip key={m.id}>
              {m.label}: {fmtTime(m.start)}–{fmtTime(m.end)}
            </Chip>
          ))}
          <Chip>
            Pranzo: {fmtTime(agenda.lunch.start)}–{fmtTime(agenda.lunch.end)}
          </Chip>
          <Chip>
            Interventi: {fmtTime(agenda.talks.start)}–{fmtTime(agenda.talks.end)}
          </Chip>
        </div>
      </div>
    </div>
  </Section>
);

// Sezione spiegazione eventi principali
const MainEvents = ({ activities }) => (
  <Section id="eventi" title="I tre momenti sportivi" subtitle="Come funziona">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {['soccer', 'run', 'bike'].map((k) => {
        const a = activities[k];
        return (
          <Card key={k}>
            <h3 className="text-xl font-semibold text-black">{a.title}</h3>
            <p className="mt-2 text-sm text-slate-700">{a.description}</p>
            <ul className="mt-3 text-sm list-disc pl-5 space-y-1 text-slate-700">
              {a.howItWorks.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  </Section>
);

// Sezione: SUMMIT dell'agenda (timeline principale)
const AgendaSummit = ({ agenda }) => (
  <Section id="agenda" title="Timeline dell\'evento" subtitle="Orari & luoghi">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Mattino */}
      <Card>
        <h3 className="text-lg font-semibold">Mattino — attività</h3>
        <div className="mt-4 border-l-2 border-black/10 pl-4">
          {agenda.morning.map((m) => (
            <TimelineItem
              key={m.id}
              time={`${fmtTime(m.start)}–${fmtTime(m.end)}`}
              title={m.label}
              location={m.location}
            />
          ))}
        </div>
      </Card>

      {/* Pranzo */}
      <Card>
        <h3 className="text-lg font-semibold">Pranzo</h3>
        <div className="mt-4 border-l-2 border-black/10 pl-4">
          <TimelineItem
            time={`${fmtTime(agenda.lunch.start)}–${fmtTime(agenda.lunch.end)}`}
            title="Pausa pranzo"
            location={agenda.lunch.location}
          >
            {get(EVENT_CONFIG, 'lunch.description', DEFAULT_LUNCH.description)}
          </TimelineItem>
        </div>
      </Card>

      {/* Interventi */}
      <Card>
        <h3 className="text-lg font-semibold">Interventi</h3>
        <div className="mt-4 border-l-2 border-black/10 pl-4">
          <TimelineItem
            time={`${fmtTime(agenda.talks.start)}–${fmtTime(agenda.talks.end)}`}
            title="Scaletta interventi"
            location={agenda.talks.location}
          >
            Programma dettagliato più sotto.
          </TimelineItem>
        </div>
      </Card>
    </div>
  </Section>
);

// Mini-agende dettagliate per ciascun momento
const MiniAgende = ({ agenda }) => (
  <Section id="miniagende" title="Mini-agende" subtitle="Dettagli per momento">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <h3 className="text-lg font-semibold">Calcio</h3>
        <p className="text-sm text-slate-700">Orari: {fmtTime(agenda.morning.find(x=>x.id==='soccer')?.start)}–{fmtTime(agenda.morning.find(x=>x.id==='soccer')?.end)}</p>
        <ul className="mt-2 text-sm list-disc pl-5 space-y-1 text-slate-700">
          <li>Ritrovo squadre • 15′ prima del fischio iniziale</li>
          <li>Gironi/partite • campi 5vs5</li>
          <li>Premiazione informale a fine mattinata</li>
        </ul>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold">Corsa</h3>
        <p className="text-sm text-slate-700">Orari: {fmtTime(agenda.morning.find(x=>x.id==='run')?.start)}–{fmtTime(agenda.morning.find(x=>x.id==='run')?.end)}</p>
        <ul className="mt-2 text-sm list-disc pl-5 space-y-1 text-slate-700">
          <li>Briefing percorso • 10′ prima della partenza</li>
          <li>1 giro = 7 km • 2 giri = 14 km</li>
          <li>Ristoro leggero al rientro</li>
        </ul>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold">Ciclismo</h3>
        <p className="text-sm text-slate-700">Orari: {fmtTime(agenda.morning.find(x=>x.id==='bike')?.start)}–{fmtTime(agenda.morning.find(x=>x.id==='bike')?.end)}</p>
        <ul className="mt-2 text-sm list-disc pl-5 space-y-1 text-slate-700">
          <li>Scelta sul posto: corto o lungo</li>
          <li>Andatura sociale • staffette apri/chiudi</li>
          <li>Rientro in tempo per il pranzo</li>
        </ul>
      </Card>
    </div>
  </Section>
);

// Sezione pranzo con slot 3 partecipanti
const LunchSection = ({ lunchCfg }) => {
  const description = get(EVENT_CONFIG, 'lunch.description', lunchCfg.description);
  const distributors = get(EVENT_CONFIG, 'lunch.distributors', lunchCfg.distributors);
  return (
    <Section id="pranzo" title="Pranzo" subtitle="Conviviale">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold">Orario & luogo</h3>
          <p className="mt-2 text-sm text-slate-700">
            {fmtTime(get(EVENT_CONFIG, 'agenda.lunch.start', DEFAULT_AGENDA.lunch.start))}–
            {fmtTime(get(EVENT_CONFIG, 'agenda.lunch.end', DEFAULT_AGENDA.lunch.end))} • {get(EVENT_CONFIG, 'agenda.lunch.location', DEFAULT_AGENDA.lunch.location)}
          </p>
          <p className="mt-3 text-sm text-slate-700">{description}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Distribuzione cibo (3 persone)</h3>
          <ul className="mt-2 text-sm space-y-2">
            {distributors.map((d, i) => (
              <li key={i} className="flex items-center justify-between">
                <span className="font-medium">{d.name}</span>
                <span className="text-slate-600">{d.role}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">Modifica questi nomi in <code>EVENT_CONFIG.lunch.distributors</code>.</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Note organizzative</h3>
          <ul className="mt-2 text-sm list-disc pl-5 space-y-1 text-slate-700">
            <li>Piatti compostabili, porta borraccia</li>
            <li>Opzioni veg disponibili</li>
            <li>Gestione code e token pasto</li>
          </ul>
        </Card>
      </div>
    </Section>
  );
};

// Sezione interventi (scaletta dettagliata)
const InterventiSection = ({ talks, agenda }) => (
  <Section id="interventi" title="Interventi" subtitle="Scaletta dettagliata">
    <div className="rounded-3xl p-[1px] mb-6" style={{ background: `linear-gradient(90deg, ${THEME.primary}, ${THEME.accentRed})` }}>
      <div className="rounded-3xl bg-white p-6">
        <p className="text-sm text-slate-700">
          Orario: {fmtTime(agenda.talks.start)}–{fmtTime(agenda.talks.end)} • {agenda.talks.location}
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold">Programma</h3>
        <div className="mt-4 border-l-2 border-black/10 pl-4">
          {talks.map((t, i) => (
            <TimelineItem key={i} time={t.time} title={`${t.speaker} — ${t.duration}`}>
              {t.topic}
            </TimelineItem>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold">Informazioni per relatori</h3>
        <ul className="mt-2 text-sm list-disc pl-5 space-y-1 text-slate-700">
          <li>Microfono e proiezione disponibili (arrivare 15′ prima)</li>
          <li>Tempo assegnato indicato in scaletta</li>
          <li>Q&A finale se il tempo lo consente</li>
        </ul>
      </Card>
    </div>
  </Section>
);

// ==== PAGINA PRINCIPALE ====
const EventProgram = () => {
  const agenda = {
    morning: get(EVENT_CONFIG, 'agenda.morning', DEFAULT_AGENDA.morning),
    lunch: get(EVENT_CONFIG, 'agenda.lunch', DEFAULT_AGENDA.lunch),
    talks: get(EVENT_CONFIG, 'agenda.talks', DEFAULT_AGENDA.talks),
  };

  const activities = {
    soccer: get(EVENT_CONFIG, 'activities.soccer', DEFAULT_ACTIVITIES.soccer),
    run: get(EVENT_CONFIG, 'activities.run', DEFAULT_ACTIVITIES.run),
    bike: get(EVENT_CONFIG, 'activities.bike', DEFAULT_ACTIVITIES.bike),
  };

  const talks = get(EVENT_CONFIG, 'talks', DEFAULT_TALKS);

  return (
    <>
      {/* HERO MINI */}
      <section className="py-12 text-white" style={{ backgroundColor: THEME.primary }}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-black">Programma della giornata</h1>
          <p className="mt-2 text-black/80 max-w-2xl">
            Sport, convivio e interventi: scopri orari, modalità e la scaletta completa dell\'evento.
          </p>
        </div>
      </section>

      <PreambleAgenda agenda={agenda} />
      <MainEvents activities={activities} />
      <AgendaSummit agenda={agenda} />
      <MiniAgende agenda={agenda} />
      <LunchSection lunchCfg={DEFAULT_LUNCH} />
      <InterventiSection talks={talks} agenda={agenda} />

      {/* CTA finale */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-3xl p-[1px]" style={{ background: `linear-gradient(90deg, ${THEME.primary}, ${THEME.accentRed})` }}>
            <div className="rounded-3xl bg-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-black">Pronto/a a partecipare?</h3>
                <p className="text-sm text-slate-700">Iscriviti a calcio, corsa o bici, oppure vieni per pranzo e interventi.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <a href="#/soccer" className="rounded-full px-4 py-2 text-white font-semibold" style={{ backgroundColor: THEME.primary }}>Iscriviti — Calcio</a>
                <a href="#/run" className="rounded-full px-4 py-2 text-white font-semibold" style={{ backgroundColor: THEME.primary }}>Iscriviti — Corsa</a>
                <a href="#/bike" className="rounded-full px-4 py-2 text-white font-semibold" style={{ backgroundColor: THEME.primary }}>Iscriviti — Bici</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EventProgram;

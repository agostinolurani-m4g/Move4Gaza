import React from 'react';
import { EVENT_CONFIG } from '../config.js';
import GradientHeader from '../components/GradientHeader.jsx';
import BeneficiaryCard from '../components/BeneficiaryCard.jsx';
// ...existing code...
const Beneficiary = () => {
  const B = EVENT_CONFIG.beneficiary || {};
  const L = B.links || {};

  // Array di immagini (sostituisci i percorsi con quelli reali)
  const boxImages = [
    import.meta.env.BASE_URL + 'bene_chi.JPG',
    import.meta.env.BASE_URL + 'bene_mission.jpg',
    import.meta.env.BASE_URL + 'bene_dist.png',
    import.meta.env.BASE_URL + 'bene_aid.jpg',
  ];

  return (
    <>
      <GradientHeader
        title={`Beneficiario — ${B.name}`}
        subtitle="Dove vanno i fondi e come lavorano"
        chips={[`Sito: ${new URL(B.url).hostname}`]}
      />
      <section className="py-10 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          {/* HERO with logo */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            {B.logoUrl && (
              <img
                src={B.logoUrl}
                alt={`${B.name} logo`}
                className="w-20 h-20 rounded-xl ring-1 ring-black/10 object-contain bg-white"
              />
            )}
            <div>
              <h2 className="text-2xl font-extrabold">{B.name}</h2>
              <p className="text-slate-700 mt-1">{B.blurb}</p>
              <div className="mt-2 text-sm">
                {B.url && (
                  <a
                    href={B.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline mr-3"
                  >
                    Sito ufficiale
                  </a>
                )}
                {L.contactUrl && (
                  <a
                    href={L.contactUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Contatti
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Info boxes */}
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            <div className="rounded-2xl border border-slate-200 p-5 flex flex-col items-center">
              <img src={boxImages[0]} alt="Chi sono" className="w-24 h-24 object-cover rounded-xl mb-3" />
              <h3 className="font-semibold">Chi sono</h3>
              <p className="text-sm text-slate-700 mt-1">
                Team di paraciclismo fondato a Gaza; dal 2020 percorsi per amputatə e
                atleti con disabilità, e oggi mutual aid sul territorio.{' '}
                <a
                  className="underline"
                  target="_blank"
                  rel="noreferrer"
                  href={L.aboutUrl || B.url}
                >
                  Scopri di più
                </a>
                .
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5 flex flex-col items-center">
              <img src={boxImages[1]} alt="Missione" className="w-24 h-24 object-cover rounded-xl mb-3" />
              <h3 className="font-semibold">Missione</h3>
              <p className="text-sm text-slate-700 mt-1">
                Aiuti comunitari, protezione dei civili e sport accessibile.
                <a
                  className="underline ml-1"
                  target="_blank"
                  rel="noreferrer"
                  href={L.missionUrl}
                >
                  Mission
                </a>
                .
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5 flex flex-col items-center">
              <img src={boxImages[2]} alt="Dove vanno i fondi" className="w-24 h-24 object-cover rounded-xl mb-3" />
              <h3 className="font-semibold">Dove vanno i fondi</h3>
              <p className="text-sm text-slate-700 mt-1">
                Beni essenziali, distribuzioni locali, inclusione e sport. Report, campagne e shop sul loro sito.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <img src={boxImages[3]} alt="Aid & Programmi" className="w-24 h-24 object-cover rounded-xl mb-3" />
              <BeneficiaryCard
                title="Aid & Programmi"
                href={L.aidUrl}
                desc="Distribuzioni locali, reti di volontari, aggiornamenti."
              />
            </div>
          </div>

          {/* Legal notes */}
          <div className="mt-10 rounded-2xl bg-slate-50 p-5 ring-1 ring-black/5">
            <p className="text-sm text-slate-700">
              {B.cf && (
                <>
                  <strong>CF/P.IVA:</strong> {B.cf} ·{' '}
                </>
              )}
              {B.address && (
                <>
                  <strong>Sede/contatti:</strong> {B.address} ·{' '}
                </>
              )}
              Fonte: sito ufficiale dei Gaza Sunbirds.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Beneficiary;

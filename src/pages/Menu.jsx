import React from 'react';
import GradientHeader from '../components/GradientHeader.jsx';
import ModifiedPaymentOptionsNexy from '../components/ModifiedPaymentOptionsNexy.jsx';
import { THEME } from '../config.js';

// Componente Menu modificato per usare il nuovo PaymentOptions con campi nome/cognome
const ModifiedMenu = ({ navigate }) => {
  return (
    <>
      <GradientHeader
        title="Menu pranzo"
        subtitle="Il menu per il pranzo sociale"
        chips={[]}
      />
      <section className="py-6">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <div className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/10">
            <h2 className="text-lg font-semibold">Scopri il nostro menu</h2>
            <p className="mt-2 text-sm text-black/80">
              Qui troverai l'immagine del menu del pranzo. Potrai consultare le
              pietanze proposte e successivamente procedere con la donazione
              tramite NexyPay.
            </p>
            <div className="mt-4 aspect-[2/3] w-full rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
              <img
                src="/M4G_cibo.png"
                alt="Menu del pranzo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 aspect-[2/3] w-full rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
              <img
                src="/M4G_bere.png"
                alt="Bevande del pranzo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <ModifiedPaymentOptionsNexy />
          </div>
          <div>
            <button
              type="button"
              onClick={() => navigate('')}
              className="text-sm font-semibold"
              style={{ color: THEME.primary }}
            >
              ←Torna alla home
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ModifiedMenu;
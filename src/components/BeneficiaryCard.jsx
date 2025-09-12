import React from 'react';

// Small card linking out to an external resource related to the beneficiary.
const BeneficiaryCard = ({ title, desc, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block rounded-2xl p-5 bg-white shadow-sm ring-1 ring-black/10 hover:shadow-md transition"
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-slate-700 mt-1">{desc}</p>
      <span className="inline-block mt-3 text-sm underline">Apri</span>
    </a>
  );
};

export default BeneficiaryCard;
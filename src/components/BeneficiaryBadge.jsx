import React from 'react';
import { EVENT_CONFIG } from '../config.js';

// Display a small attribution line indicating where donations are sent to.
const BeneficiaryBadge = ({ className = "" }) => {
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
        Donazioni destinate a{' '}
        <a className="underline" href={B.url} target="_blank" rel="noreferrer">
          {B.name}
        </a>
        {B.cf ? <> — {B.cf}</> : null}
      </p>
    </div>
  );
};

export default BeneficiaryBadge;
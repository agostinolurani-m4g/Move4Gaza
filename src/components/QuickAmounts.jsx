import React from 'react';

// Render a set of preconfigured donation amounts. Highlights the currently
// selected value and notifies the parent via onPick when clicked.
const QuickAmounts = ({ value, onPick }) => {
  const items = [
    { amount: 20,  label: "20 €" },
    { amount: 50,  label: "50 €" },
    { amount: 100, label: "100 €" },
    { amount: 500, label: "500 €" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(({ amount, label }) => (
        <button
          type="button"
          key={amount}
          onClick={() => onPick(amount)}
          className={`rounded-2xl px-4 py-3 text-left ring-1 ring-black/10 shadow-sm bg-white hover:shadow ${
            Number(value) === amount ? "outline outline-2 outline-emerald-400" : ""
          }`}
        >
          <div className="text-lg font-semibold">{label}</div>
        </button>
      ))}
    </div>
  );
};

export default QuickAmounts;
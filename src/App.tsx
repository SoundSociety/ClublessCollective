import React from 'react';
import InputsPanel from './components/InputsPanel';
import ResultsPanel from './components/ResultsPanel';
import { useProfitEngine } from './logic/useProfitEngine';
import type { Inputs } from './types';

const DEFAULTS: Inputs = {
  // Use capacity + % to derive attendees
  maxOccupancy: 250,
  attendancePercent: 100,

  percentDrinkers: 75,
  percentEating: 50,

  ticketPrice: 10.0,
  eventbriteFeePerTicket: 2.51,
  absorbFees: true,

  avgDrinkPrice: 8.0,
  avgFoodPrice: 10.0,

  toastPercent: 3.69,
  toastFixed: 0.15,

  drinkCogsPct: 30,
  foodCogsPct: 35,

  bartenderPay: 35,
  bartenderBill: 45,
  securityPay: 25,
  securityBill: 35,
  numBartenders: 2,
  numSecurity: 2,
  eventHours: 5,

  artistSplit: 0.8,
  clublessSplit: 0.2,

  venueCost: 0,
  otherCosts: [],
};

export default function App() {
  const [inputs, setInputsState] = React.useState<Inputs>(() => {
    try {
      const raw = localStorage.getItem('clubless_inputs');
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULTS;
  });

  const setInputs = (patch: Partial<Inputs>) => {
    setInputsState((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem('clubless_inputs', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const results = useProfitEngine(inputs);

  const reset = () => {
    setInputsState(DEFAULTS);
    try {
      localStorage.removeItem('clubless_inputs');
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // pt-24 for sticky header clearance
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 pt-24 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputsPanel inputs={inputs} setInputs={setInputs} />
        <ResultsPanel r={results} inputs={inputs} onReset={reset} />
      </div>
      <footer className="text-center text-white/50 text-xs py-8">
        Built by Clubless Collective • Seattle • No auth • Single-page MVP
      </footer>
    </div>
  );
}

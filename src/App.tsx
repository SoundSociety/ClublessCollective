import React from 'react';
import InputsPanel from './components/InputsPanel';
import ResultsPanel from './components/ResultsPanel';
import StickyHeader from './components/StickyHeader';
import { useProfitEngine } from './logic/useProfitEngine';
import type { Inputs } from './types';
import confetti from 'canvas-confetti';

const DEFAULTS: Inputs = {
  maxOccupancy: 0,
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
  // Draft (what user is editing)
  const [draft, setDraft] = React.useState<Inputs>(() => {
    try { const raw = localStorage.getItem('clubless_inputs_draft'); if (raw) return JSON.parse(raw); } catch {}
    return DEFAULTS;
  });

  // Committed (what results are based on)
  const [model, setModel] = React.useState<Inputs>(() => {
    try { const raw = localStorage.getItem('clubless_inputs_model'); if (raw) return JSON.parse(raw); } catch {}
    return DEFAULTS;
  });

  React.useEffect(() => {
    try { localStorage.setItem('clubless_inputs_draft', JSON.stringify(draft)); } catch {}
  }, [draft]);

  const results = useProfitEngine(model);
  const [toast, setToast] = React.useState<string | null>(null);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(model);

  // Optional chime when celebrating
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(880, ctx.currentTime);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.45);
    } catch {}
  };

  const onSubmit = () => {
    const prevArtist = results.artistEarnings;
    setModel(draft);
    try { localStorage.setItem('clubless_inputs_model', JSON.stringify(draft)); } catch {}

    // Use a microtask tick to allow results to recompute
    setTimeout(() => {
      const newResults = useProfitEngine(draft); // pure calc
      const delta = newResults.artistEarnings - prevArtist;
      if (delta >= 50) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.3 } });
        playChime();
        setToast(`🎉 Congrats! You could earn ${newResults.artistEarnings.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`);
        setTimeout(() => setToast(null), 3000);
      }
    }, 0);
  };

  const reset = () => {
    setDraft(DEFAULTS);
    setModel(DEFAULTS);
    try {
      localStorage.removeItem('clubless_inputs_draft');
      localStorage.removeItem('clubless_inputs_model');
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
React.useLayoutEffect(() => {
  const el = document.getElementById('sticky-header');
  if (!el) return;
  const setH = () => {
    const h = Math.ceil(el.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--sticky-header-h', `${h}px`);
  };
  setH();
  const ro = new ResizeObserver(setH);
  ro.observe(el);
  window.addEventListener('resize', setH);
  window.addEventListener('orientationchange', setH);
  return () => {
    ro.disconnect();
    window.removeEventListener('resize', setH);
    window.removeEventListener('orientationchange', setH);
  };
}, []);


  return (
    <>
      <StickyHeader r={results} inputs={model} onSubmit={onSubmit} isDirty={isDirty} />
      {/* pt-36 leaves room for sticky header */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 pt-[calc(var(--sticky-header-h,140px)+env(safe-area-inset-top))] space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputsPanel inputs={draft} setInputs={(p) => setDraft(prev => ({ ...prev, ...p }))} />
          <ResultsPanel r={results} inputs={model} onReset={reset} />
        </div>
        <footer className="text-center text-white/50 text-xs py-8">
          Built by Clubless Collective • Seattle • No auth • Single-page MVP
        </footer>
      </div>

      {/* Global toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 card px-4 py-2">
          {toast}
        </div>
      )}
    </>
  );
}

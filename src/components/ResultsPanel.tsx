
import React, { useEffect, useRef, useState } from 'react';
import type { Inputs, Results } from '../types';
import { fmt } from '../utils/currency';
import TicketsDrinksFoodChart from './Chart';
import KpiCard from './KpiCard';
import PnlTable from './PnlTable';
import confetti from 'canvas-confetti';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

export default function ResultsPanel({ r, inputs, onReset }: { r: Results; inputs: Inputs; onReset: ()=>void }){
  const [toast, setToast] = useState<string | null>(null);
  const [lastArtist, setLastArtist] = useState<number>(r.artistEarnings);
  const debouncedArtist = useDebouncedValue(r.artistEarnings, 400);

  useEffect(() => {
    const delta = debouncedArtist - lastArtist;
    if (delta >= 50){
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.3 } });
      setToast(`🎉 Congrats! You could earn ${fmt(debouncedArtist)}`);
      setTimeout(()=> setToast(null), 3000);
    }
    if (debouncedArtist !== lastArtist) setLastArtist(debouncedArtist);
  }, [debouncedArtist]);

  const copySummary = async () => {
    const lines = [
      'Clubless Profit Calculator (MVP) — Summary',
      `Attendees: ${inputs.attendees}, %Drinkers: ${inputs.percentDrinkers}%, %Eating: ${inputs.percentEating}%`,
      `Ticket: $${inputs.ticketPrice.toFixed(2)} (Eventbrite Fee: $${inputs.eventbriteFeePerTicket.toFixed(2)} per ticket)`,
      `Avg Drink: $${inputs.avgDrinkPrice.toFixed(2)} | Avg Food: $${inputs.avgFoodPrice.toFixed(2)} | Toast: ${inputs.toastPercent}% + $${inputs.toastFixed.toFixed(2)}`,
      `COGS — Drinks: ${inputs.drinkCogsPct}% | Food: ${inputs.foodCogsPct}%`,
      `Staff — Bartenders: ${inputs.numBartenders} (${inputs.bartenderPay}/hr pay, ${inputs.bartenderBill}/hr bill), Security: ${inputs.numSecurity} (${inputs.securityPay}/hr pay, ${inputs.securityBill}/hr bill), Hours: ${inputs.eventHours}`,
      `Splits — Artist: ${(inputs.artistSplit*100).toFixed(0)}% | Clubless: ${(inputs.clublessSplit*100).toFixed(0)}%`,
      `Venue Cost: ${fmt(inputs.venueCost)} | Other Costs: ${fmt(inputs.otherCosts.reduce((s,c)=> s + (isFinite(Number(c.amount)) ? Number(c.amount) : 0), 0))}`,
      '',
      `Ticket Revenue: ${fmt(r.ticketRevenue)}`,
      `Net Drink Revenue: ${fmt(r.netDrinkRevenue)} (after Toast fees)`,
      `Net Food Revenue: ${fmt(r.netFoodRevenue)} (after Toast fees)`,
      `Total Revenue: ${fmt(r.totalRevenue)}`,
      `Total COGS: ${fmt(r.totalCOGS)}`,
      `Net Revenue: ${fmt(r.netRevenue)}`,
      `Artist Earnings: ${fmt(r.artistEarnings)}`,
      `Clubless Base: ${fmt(r.clublessBase)} | Bartender Margin: ${fmt(r.bartenderMargin)} | Security Margin: ${fmt(r.securityMargin)} | Clubless Total: ${fmt(r.clublessTotal)}`
    ].join('\n');
    try {
      await navigator.clipboard.writeText(lines);
      setToast('Copied summary to clipboard.');
      setTimeout(()=> setToast(null), 2000);
    } catch {
      setToast('Copy failed. Select and copy manually.');
      setTimeout(()=> setToast(null), 2500);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Clubless Profit Calculator (MVP)</h1>
            <p className="text-white/70">Test your event idea and see potential earnings in seconds.</p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-sm text-white/70">Potential Earnings (Artist)</div>
          <div className="text-4xl md:text-5xl font-bold mt-1">{fmt(r.artistEarnings)}</div>
        </div>

        {r.warnings.length > 0 && (
          <ul className="mt-3 text-yellow-300 text-sm list-disc pl-6">
            {r.warnings.map((w, i)=> <li key={i}>{w}</li>)}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KpiCard label="Clubless Total" value={r.clublessTotal} />
        <KpiCard label="Net Revenue" value={r.netRevenue} />
        <KpiCard label="Total Revenue" value={r.totalRevenue} />
        <KpiCard label="Total COGS" value={r.totalCOGS} />
        <KpiCard label="Ticket Revenue" value={r.ticketRevenue} />
        <KpiCard label="Net Drink Revenue" value={r.netDrinkRevenue} />
        <KpiCard label="Net Food Revenue" value={r.netFoodRevenue} />
      </div>

      <TicketsDrinksFoodChart data={{ tickets: r.ticketRevenue, drinks: r.netDrinkRevenue, food: r.netFoodRevenue }} />

      <PnlTable r={r} />

      {/* Sticky footer actions */}
      <div className="fixed bottom-0 left-0 right-0 p-3 md:p-4 bg-black/60 backdrop-blur border-t border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="text-sm text-white/70">Artist: {fmt(r.artistEarnings)} • Clubless: {fmt(r.clublessTotal)}</div>
          <div className="flex gap-2">
            <button className="btn" onClick={onReset}>Reset to defaults</button>
            <button className="btn" onClick={copySummary}>Copy summary</button>
            <a className="btn" href="javascript:window.print()">Export PDF</a>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 card px-4 py-2">
          {toast}
        </div>
      )}
    </div>
  )
}

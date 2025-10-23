import React from 'react';
import type { Inputs, Results } from '../types';
import { fmt } from '../utils/currency';
import TicketsDrinksFoodChart from './Chart';
import KpiCard from './KpiCard';
import PnlTable from './PnlTable';
import { exportInvoicePDF } from '../utils/exportPDF';

export default function ResultsPanel({
  r, inputs, onReset
}: {
  r: Results; inputs: Inputs; onReset: () => void;
}) {
  const copySummary = async () => {
    const bartenderPay = inputs.bartenderBill * (1 - inputs.staffingDiscountPct / 100);
    const securityPay  = inputs.securityBill  * (1 - inputs.staffingDiscountPct / 100);

    const lines = [
      'Clubless Profit Calculator (MVP) — Summary',
      `Max Occupancy: ${inputs.maxOccupancy}, Expected Attendance %: ${inputs.attendancePercent}%`,
      `Attendees (derived): ${r.attendees}`,
      `%Drinkers: ${inputs.percentDrinkers}%, %Eating: ${inputs.percentEating}%`,
      `Ticket: $${inputs.ticketPrice.toFixed(2)} (Eventbrite Fee: $${inputs.eventbriteFeePerTicket.toFixed(2)} per ticket)`,
      `Avg Drink: $${inputs.avgDrinkPrice.toFixed(2)} | Avg Food: $${inputs.avgFoodPrice.toFixed(2)} | Toast: ${inputs.toastPercent}% + $${inputs.toastFixed.toFixed(2)}`,
      `COGS — Drinks: ${inputs.drinkCogsPct}% | Food: ${inputs.foodCogsPct}%`,
      `Staff — Bartenders: ${inputs.numBartenders} (~$${bartenderPay.toFixed(2)}/hr pay, $${inputs.bartenderBill}/hr bill), ` +
        `Security: ${inputs.numSecurity} (~$${securityPay.toFixed(2)}/hr pay, $${inputs.securityBill}/hr bill), ` +
        `Hours: ${inputs.eventHours}`,
      `Staffing Discount: ${inputs.staffingDiscountPct}%`,
      `Splits — Artist: ${(inputs.artistSplit * 100).toFixed(0)}% | Clubless: ${(inputs.clublessSplit * 100).toFixed(0)}%`,
      `Venue Cost: ${fmt(inputs.venueCost)} | Other Costs: ${fmt(inputs.otherCosts.reduce((s, c) => s + (isFinite(Number(c.amount)) ? Number(c.amount) : 0), 0))}`,
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
    try { await navigator.clipboard.writeText(lines); } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KpiCard label="Clubless Total" value={r.clublessTotal} />
        <KpiCard label="Net Revenue" value={r.netRevenue} />
        <KpiCard label="Total Revenue" value={r.totalRevenue} />
        <KpiCard label="Total COGS" value={r.totalCOGS} />
        <KpiCard label="Ticket Revenue" value={r.ticketRevenue} />
        <KpiCard label="Net Drink Revenue" value={r.netDrinkRevenue} />
        <KpiCard label="Net Food Revenue" value={r.netFoodRevenue} />
      </div>

      <TicketsDrinksFoodChart
        data={{ tickets: r.ticketRevenue, drinks: r.netDrinkRevenue, food: r.netFoodRevenue }}
      />

      <PnlTable r={r} />

      {/* Sticky footer actions */}
      <div className="fixed bottom-0 left-0 right-0 p-3 md:p-4 bg-black/60 backdrop-blur border-t border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="text-sm text-white/70">Artist: {fmt(r.artistEarnings)} • Clubless: {fmt(r.clublessTotal)}</div>
          <div className="flex gap-2">
            <button className="btn" onClick={onReset}>Reset to defaults</button>
            <button className="btn" onClick={copySummary}>Copy summary</button>
            <button className="btn" onClick={() => exportInvoicePDF(inputs, r)}>Export PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}

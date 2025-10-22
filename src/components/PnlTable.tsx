
import React from 'react';
import type { Results } from '../types';
import { fmt } from '../utils/currency';

export default function PnlTable({ r }: { r: Results }){
  const rows: [string, number][] = [
    ['Ticket Revenue (net of Eventbrite fee)', r.ticketRevenue],
    ['Net Drink Revenue', r.netDrinkRevenue],
    ['Net Food Revenue', r.netFoodRevenue],
    ['Total Revenue', r.totalRevenue],
    ['Drink COGS (30%)', r.drinkCOGS],
    ['Food COGS (35%)', r.foodCOGS],
    ['Total COGS', r.totalCOGS],
    ['Net Revenue (before splits & after venue/other in results above)', r.netRevenue],
    ['Artist Earnings', r.artistEarnings],
    ['Clubless Base (split)', r.clublessBase],
    ['Bartender Margin', r.bartenderMargin],
    ['Security Margin', r.securityMargin],
    ['Clubless Total', r.clublessTotal]
  ];
  return (
    <div className="card p-4 md:p-5 overflow-x-auto">
      <div className="section-title mb-3">Mini P&L</div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-b border-white/10 last:border-b-0">
              <td className="py-2 pr-4 text-white/80">{k}</td>
              <td className="py-2 text-right font-medium">{fmt(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

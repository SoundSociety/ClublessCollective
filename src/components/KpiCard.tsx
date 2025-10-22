
import React from 'react';
import { fmt } from '../utils/currency';

type Props = {
  label: string;
  value: number;
  highlight?: boolean;
}

export default function KpiCard({label, value, highlight}: Props){
  return (
    <div className={`kpi ${highlight ? 'ring-1 ring-brand-accent' : ''}`}>
      <div className="text-sm text-white/60">{label}</div>
      <div className="text-2xl md:text-3xl font-semibold mt-1">{fmt(value)}</div>
    </div>
  )
}

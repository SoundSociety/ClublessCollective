import React from 'react';
import type { Inputs, Results } from '../types';
import { fmt } from '../utils/currency';

export default function StickyHeader({
  r, inputs, onSubmit, isDirty
}: {
  r: Results; inputs: Inputs; onSubmit: () => void; isDirty: boolean;
}) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-6xl">
        <div className="card m-4 md:m-6 p-4 md:p-5 border border-brand/30 bg-[rgba(10,10,18,0.85)] backdrop-blur rounded-2xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">Clubless Profit Calculator (MVP)</h1>
              <p className="text-white/70 text-sm">Test your event idea and see potential earnings in seconds.</p>
              <p className="text-white/60 text-xs mt-1">
                Max Occ: <span className="font-medium">{inputs.maxOccupancy}</span> •
                Expected Att.: <span className="font-medium">{inputs.attendancePercent}%</span> •
                Derived Attendees: <span className="font-medium">{r.attendees}</span>
              </p>
            </div>

            <div className="flex items-end gap-3">
              <div className="text-right">
                <div className="text-xs text-white/70">Potential Earnings (Artist)</div>
                <div className="text-3xl md:text-4xl font-bold mt-1">{fmt(r.artistEarnings)}</div>
              </div>

              <button
                className={`btn h-10 px-4 ${isDirty ? 'bg-brand text-black hover:opacity-90' : 'bg-white/10 text-white/60 cursor-not-allowed'}`}
                onClick={onSubmit}
                disabled={!isDirty}
                title={isDirty ? 'Calculate' : 'No changes to calculate'}
              >
                Calculate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

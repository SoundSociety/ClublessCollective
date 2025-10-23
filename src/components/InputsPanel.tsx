import React from 'react';
import type { Inputs } from '../types';

type Props = { inputs: Inputs; setInputs: (p: Partial<Inputs>) => void; };

function NumInput({
  label, value, onChange, min = 0, step = 1, decimal = false
}: {
  label: string; value: number; onChange: (v: number) => void; min?: number; step?: number; decimal?: boolean
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    onChange(isFinite(v) ? v : 0);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    onChange(isFinite(v) ? Math.max(min, v) : 0); // normalize, strips leading zeros
  };
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select(); // easier overwrite on mobile/desktop
  };

  // Use decimal keypad when needed (and don't block "." with pattern)
  const inputProps = decimal
    ? { inputMode: 'decimal' as const, step: step ?? 'any' }
    : { inputMode: 'numeric' as const, step: step ?? 1, pattern: '[0-9]*' };

  return (
    <label className="block mb-3">
      <span className="text-sm text-white/80">{label}</span>
      <input
        className="glass-input mt-1"
        type="number"
        value={isFinite(value) ? value : 0}
        min={min}
        {...inputProps}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
    </label>
  );
}


function PctInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block mb-3">
      <span className="text-sm text-white/80">{label} ({value}%)</span>
      <input
        className="w-full"
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  );
}

export default function InputsPanel({ inputs, setInputs }: Props) {
  const [showAdv, setShowAdv] = React.useState(false);
  const derivedBartenderPay = inputs.bartenderBill * (1 - inputs.staffingDiscountPct / 100);
  const derivedSecurityPay  = inputs.securityBill  * (1 - inputs.staffingDiscountPct / 100);

  return (
    <div className="card p-4 md:p-5">
      <h2 className="text-lg font-semibold mb-3">Inputs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Capacity & expected attendance (attendees = derived) */}
        <NumInput
          label="Max Occupancy"
          value={inputs.maxOccupancy}
          onChange={(v) => setInputs({ maxOccupancy: Math.max(0, v) })}
          step={1}
        />
        <PctInput
          label="Expected Attendance %"
          value={inputs.attendancePercent}
          onChange={(v) => setInputs({ attendancePercent: Math.max(0, Math.min(100, v)) })}
        />

        {/* Behavioral mix */}
        <PctInput
          label="% Drinkers"
          value={inputs.percentDrinkers}
          onChange={(v) => setInputs({ percentDrinkers: Math.max(0, Math.min(100, v)) })}
        />
        <PctInput
          label="% Eating"
          value={inputs.percentEating}
          onChange={(v) => setInputs({ percentEating: Math.max(0, Math.min(100, v)) })}
        />

        {/* Pricing */}
        <NumInput label="Ticket Price ($)" value={inputs.ticketPrice} onChange={(v) => setInputs({ ticketPrice: Math.max(0, v) })} step={0.01} decimal />
        <NumInput label="Eventbrite Fee Per Ticket ($)" value={inputs.eventbriteFeePerTicket} onChange={(v) => setInputs({ eventbriteFeePerTicket: Math.max(0, v) })} step={0.01} decimal />
        <NumInput label="Avg Drink Price ($)" value={inputs.avgDrinkPrice} onChange={(v) => setInputs({ avgDrinkPrice: Math.max(0, v) })} step={0.01} decimal />
        <NumInput label="Avg Food Price ($)" value={inputs.avgFoodPrice} onChange={(v) => setInputs({ avgFoodPrice: Math.max(0, v) })} step={0.01} decimal />

        {/* Staffing core */}
        <NumInput label="Event Hours" value={inputs.eventHours} onChange={(v) => setInputs({ eventHours: Math.max(0, v) })} step={1} decimal />
        <NumInput label="No. of Bartenders/Caterers" value={inputs.numBartenders} onChange={(v) => setInputs({ numBartenders: Math.max(0, v) })} step={1} />
        <NumInput label="No. of Security" value={inputs.numSecurity} onChange={(v) => setInputs({ numSecurity: Math.max(0, v) })} step={1} />

        {/* Artist-facing bill rates + derived pay display */}
        <div className="md:col-span-1">
          <NumInput
            label="Amount Artist is charged for Bartender Bill ($/hr)"
            value={inputs.bartenderBill}
            onChange={(v) => setInputs({ bartenderBill: Math.max(0, v) })}
            step={0.01} decimal 
          />
          <div className="text-xs text-white/60 -mt-2 mb-2">
            Clubless pays ≈ ${derivedBartenderPay.toFixed(2)}/hr
          </div>
        </div>

        <div className="md:col-span-1">
          <NumInput
            label="Amount Artist is charged for Security Bill ($/hr)"
            value={inputs.securityBill}
            onChange={(v) => setInputs({ securityBill: Math.max(0, v) })}
            step={0.01} decimal 
          />
          <div className="text-xs text-white/60 -mt-2 mb-2">
            Clubless pays ≈ ${derivedSecurityPay.toFixed(2)}/hr
          </div>
        </div>

        {/* Costs */}
        <NumInput label="Venue Cost ($)" value={inputs.venueCost} onChange={(v) => setInputs({ venueCost: Math.max(0, v) })} step={0.01} decimal />
      </div>

      {/* Other costs */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/80">Other Direct Costs</span>
          <button
            className="btn"
            onClick={() => setInputs({ otherCosts: [...inputs.otherCosts, { label: 'Cost', amount: 0 }] })}
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {inputs.otherCosts.map((c, idx) => (
            <div key={idx} className="grid grid-cols-9 gap-2">
              <input
                className="glass-input col-span-5"
                value={c.label}
                onChange={(e) => {
                  const arr = inputs.otherCosts.slice();
                  arr[idx] = { ...c, label: e.target.value };
                  setInputs({ otherCosts: arr });
                }}
              />
              <input
                className="glass-input col-span-3"
                type="number"
                step={0.01}
                value={c.amount}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  const arr = inputs.otherCosts.slice();
                  arr[idx] = { ...c, amount: isFinite(v) ? v : 0 };
                  setInputs({ otherCosts: arr });
                }}
                onBlur={(e) => {
                  const v = Number(e.target.value);
                  const arr = inputs.otherCosts.slice();
                  arr[idx] = { ...c, amount: isFinite(v) ? Math.max(0, v) : 0 };
                  setInputs({ otherCosts: arr });
                }}
              />
              <button
                className="btn col-span-1"
                onClick={() => {
                  const arr = inputs.otherCosts.slice();
                  arr.splice(idx, 1);
                  setInputs({ otherCosts: arr });
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <button className="mt-4 text-sm text-brand underline" onClick={() => setShowAdv(v => !v)}>
        {showAdv ? 'Hide' : 'Show'} Advanced / Constants
      </button>

      {showAdv && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <NumInput label="Toast % Fee" value={inputs.toastPercent} onChange={(v) => setInputs({ toastPercent: Math.max(0, v) })} step={0.01} decimal />
          <NumInput label="Toast Fixed Fee ($)" value={inputs.toastFixed} onChange={(v) => setInputs({ toastFixed: Math.max(0, v) })} step={0.01} decimal />
          <NumInput label="Drink COGS % " value={inputs.drinkCogsPct} onChange={(v) => setInputs({ drinkCogsPct: Math.max(0, v) })} step={0.01} decimal />
          <NumInput label="Food COGS % " value={inputs.foodCogsPct} onChange={(v) => setInputs({ foodCogsPct: Math.max(0, v) })} step={0.01} decimal />

          {/* Discount that derives the pay from bill */}
          <NumInput
            label="Staffing Discount % (Clubless pays bill × (1 − %))"
            value={inputs.staffingDiscountPct}
            onChange={(v) => setInputs({ staffingDiscountPct: Math.max(0, Math.min(100, v)) })}
            step={0.01} 
          />

          {/* Splits */}
          <NumInput
  label="Artist Split Percentage (Ex. 0.80)"
  value={inputs.artistSplit}
  step={0.01}
  decimal
  onChange={(v) => {
    const a = isFinite(v) ? v : 0;
    const artist = Math.max(0, Math.min(1, a));
    const clubless = Math.max(0, Math.min(1, 1 - artist));
    setInputs({ artistSplit: artist, clublessSplit: clubless });
  }}
/>

<NumInput
  label="Clubless Split Percentage (Ex. 0.20)"
  value={inputs.clublessSplit}
  step={0.01}
  decimal
  onChange={(v) => {
    const c = isFinite(v) ? v : 0;
    const clubless = Math.max(0, Math.min(1, c));
    const artist = Math.max(0, Math.min(1, 1 - clubless));
    setInputs({ artistSplit: artist, clublessSplit: clubless });
  }}
/>

        </div>
      )}
    </div>
  );
}

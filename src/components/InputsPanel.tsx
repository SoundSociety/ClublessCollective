import React from 'react';
import type { Inputs } from '../types';

type Props = {
  inputs: Inputs;
  setInputs: (p: Partial<Inputs>) => void;
};

function NumInput({
  label, value, onChange, min = 0, step = 1
}: {
  label: string; value: number; onChange: (v: number) => void; min?: number; step?: number
}) {
  return (
    <label className="block mb-3">
      <span className="text-sm text-white/80">{label}</span>
      <input
        className="glass-input mt-1"
        type="number"
        value={isFinite(value) ? value : 0}
        min={min}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
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

  return (
    <div className="card p-4 md:p-5">
      <h2 className="text-lg font-semibold mb-3">Inputs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* NEW: Capacity number */}
        <NumInput
          label="Max Occupancy"
          value={inputs.maxOccupancy}
          onChange={(v) => setInputs({ maxOccupancy: Math.max(0, v) })}
          step={1}
        />

        {/* NEW: Expected attendance % */}
        <PctInput
          label="Expected Attendance %"
          value={inputs.attendancePercent}
          onChange={(v) => setInputs({ attendancePercent: Math.max(0, Math.min(100, v)) })}
        />

        {/* Existing behavioral mix */}
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

        <NumInput
          label="Ticket Price ($)"
          value={inputs.ticketPrice}
          onChange={(v) => setInputs({ ticketPrice: Math.max(0, v) })}
          step={0.01}
        />
        <NumInput
          label="Eventbrite Fee Per Ticket ($)"
          value={inputs.eventbriteFeePerTicket}
          onChange={(v) => setInputs({ eventbriteFeePerTicket: Math.max(0, v) })}
          step={0.01}
        />

        <NumInput
          label="Avg Drink Price ($)"
          value={inputs.avgDrinkPrice}
          onChange={(v) => setInputs({ avgDrinkPrice: Math.max(0, v) })}
          step={0.01}
        />
        <NumInput
          label="Avg Food Price ($)"
          value={inputs.avgFoodPrice}
          onChange={(v) => setInputs({ avgFoodPrice: Math.max(0, v) })}
          step={0.01}
        />

        <NumInput
          label="Event Hours"
          value={inputs.eventHours}
          onChange={(v) => setInputs({ eventHours: Math.max(0, v) })}
          step={1}
        />
        <NumInput
          label="# Bartenders"
          value={inputs.numBartenders}
          onChange={(v) => setInputs({ numBartenders: Math.max(0, v) })}
          step={1}
        />
        <NumInput
          label="# Security"
          value={inputs.numSecurity}
          onChange={(v) => setInputs({ numSecurity: Math.max(0, v) })}
          step={1}
        />

        <NumInput
          label="Venue Cost ($)"
          value={inputs.venueCost}
          onChange={(v) => setInputs({ venueCost: Math.max(0, v) })}
          step={0.01}
        />
      </div>

      {/* Other costs */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/80">Other Direct Costs</span>
          <button
            className="btn"
            onClick={() =>
              setInputs({ otherCosts: [...inputs.otherCosts, { label: 'Cost', amount: 0 }] })
            }
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
                  const arr = inputs.otherCosts.slice();
                  arr[idx] = { ...c, amount: parseFloat(e.target.value) };
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

      <button
        className="mt-4 text-sm text-brand-accent underline"
        onClick={() => setShowAdv((v) => !v)}
      >
        {showAdv ? 'Hide' : 'Show'} Advanced / Constants
      </button>

      {showAdv && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <NumInput
            label="Toast % Fee"
            value={inputs.toastPercent}
            onChange={(v) => setInputs({ toastPercent: Math.max(0, v) })}
            step={0.01}
          />
          <NumInput
            label="Toast Fixed Fee ($)"
            value={inputs.toastFixed}
            onChange={(v) => setInputs({ toastFixed: Math.max(0, v) })}
            step={0.01}
          />
          <NumInput
            label="Drink COGS % "
            value={inputs.drinkCogsPct}
            onChange={(v) => setInputs({ drinkCogsPct: Math.max(0, v) })}
            step={0.01}
          />
          <NumInput
            label="Food COGS % "
            value={inputs.foodCogsPct}
            onChange={(v) => setInputs({ foodCogsPct: Math.max(0, v) })}
            step={0.01}
          />

          <NumInput
            label="Bartender Pay ($/hr)"
            value={inputs.bartenderPay}
            onChange={(v) => setInputs({ bartenderPay: Math.max(0, v) })}
            step={0.01}
          />
          <NumInput
            label="Bartender Bill ($/hr)"
            value={inputs.bartenderBill}
            onChange={(v) => setInputs({ bartenderBill: Math.max(0, v) })}
            step={0.01}
          />
          <NumInput
            label="Security Pay ($/hr)"
            value={inputs.securityPay}
            onChange={(v) => setInputs({ securityPay: Math.max(0, v) })}
            step={0.01}
          />
          <NumInput
            label="Security Bill ($/hr)"
            value={inputs.securityBill}
            onChange={(v) => setInputs({ securityBill: Math.max(0, v) })}
            step={0.01}
          />

          <NumInput
            label="Artist Split (0-1)"
            value={inputs.artistSplit}
            onChange={(v) => setInputs({ artistSplit: Math.max(0, Math.min(1, v)) })}
            step={0.01}
          />
          <NumInput
            label="Clubless Split (0-1)"
            value={inputs.clublessSplit}
            onChange={(v) => setInputs({ clublessSplit: Math.max(0, Math.min(1, v)) })}
            step={0.01}
          />
        </div>
      )}
    </div>
  );
}

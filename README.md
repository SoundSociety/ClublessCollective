
# Clubless Profit Calculator (MVP)

**Single-page, no-auth** web app to estimate artist + Clubless earnings for Seattle events. Clean “Robinhood-ish” UI, micro-animations, instant updates.

> Title: **Clubless Profit Calculator (MVP)**  
> Subtitle: **Test your event idea and see potential earnings in seconds.**

## Tech
- React + TypeScript + Vite
- TailwindCSS
- react-chartjs-2 (Chart.js v4)
- Local component state only
- canvas-confetti for the celebration

## Formulas (exact)
- **Derived counts**:  
  `drinkers = round(attendees × %drinkers)`  
  `foodBuyers = round(attendees × %eating)`
- **Ticket Revenue**: `attendees × (ticketPrice − eventbriteFeePerTicket)`
- **Drinks (Toast)**:  
  `grossDrink = drinkers × avgDrinkPrice`  
  `toastDrinkFee = (grossDrink × 0.0369) + (drinkers × 0.15)`  
  `NetDrinkRevenue = grossDrink − toastDrinkFee`
- **Food (Toast)**:  
  `grossFood = foodBuyers × avgFoodPrice`  
  `toastFoodFee = (grossFood × 0.0369) + (foodBuyers × 0.15)`  
  `NetFoodRevenue = grossFood − toastFoodFee`
- **COGS**:  
  `DrinkCOGS = NetDrinkRevenue × 0.30`  
  `FoodCOGS = NetFoodRevenue × 0.35`
- **Totals**:  
  `TotalRevenue = TicketRevenue + NetDrinkRevenue + NetFoodRevenue`  
  `TotalCOGS = DrinkCOGS + FoodCOGS`
- **Staffing Margins**:  
  `BartenderMargin = (45 − 35) × eventHours × numBartenders`  
  `SecurityMargin = (35 − 25) × eventHours × numSecurity`
- **Net & Splits**:  
  `NetRevenue = (TotalRevenue − TotalCOGS − venueCost − sum(otherCosts))`  
  `ArtistEarnings = NetRevenue × artistSplit`  
  `ClublessBase = NetRevenue × clublessSplit`  
  `ClublessTotal = ClublessBase + BartenderMargin + SecurityMargin`

## Features
- Left card: inputs with sliders/fields + **Advanced/Constants** collapsible.
- Right card: results with hero **Potential Earnings** and KPIs.
- Bar chart (Tickets vs Drinks vs Food, net).
- Mini P&L table.
- “🎉 Congrats!” toast + confetti when ArtistEarnings increases by **≥ $50** (debounced 400ms).
- Sticky footer: **Reset to defaults**, **Copy summary** (plain-text P&L), **Export PDF** (print).
- Validation: negatives clamped, NaN → 0 with warnings. USD formatting.
- Nice-to-have: persists inputs to `localStorage` so you can refresh and keep a scenario.

## File Tree
```
/clubless-profit-calculator
  ├─ index.html
  ├─ package.json
  ├─ tsconfig.json
  ├─ vite.config.ts
  ├─ tailwind.config.js
  ├─ postcss.config.js
  ├─ vitest.setup.ts
  └─ src/
     ├─ main.tsx
     ├─ index.css
     ├─ App.tsx
     ├─ types.ts
     ├─ utils/currency.ts
     ├─ hooks/useDebouncedValue.ts
     ├─ logic/useProfitEngine.ts
     ├─ logic/useProfitEngine.test.ts
     └─ components/
        ├─ InputsPanel.tsx
        ├─ ResultsPanel.tsx
        ├─ KpiCard.tsx
        └─ Chart.tsx
```

## Run locally
Prereqs: Node 18+

```bash
npm i
npm run dev
# open printed local URL
```

## Build & preview
```bash
npm run build
npm run preview
```

## Deploy on Vercel
1. Push this folder to a GitHub repo.
2. In Vercel:
   - **New Project** → import repo.
   - Framework Preset: **Vite** (detected automatically).
   - Build Command: `npm run build`
   - Output Dir: `dist`
3. Deploy.

## Change default constants
See `src/App.tsx` `DEFAULTS` and the **Advanced / Constants** section in the UI. All editable at runtime.

## Tests
```bash
npm run test
```
Includes a baseline scenario test (250 attendees, 75% drinkers, 50% eating, 5h, 2 bartenders, 2 security).

## Accessibility
- Labels tied to inputs, keyboard-friendly.
- Mobile responsive, one-page.

## Notes
- Fee toggle is modeled as “fee is a per-ticket cost either way,” per spec.
- Billable staff margins shown; not double-subtracted from net revenue.
```


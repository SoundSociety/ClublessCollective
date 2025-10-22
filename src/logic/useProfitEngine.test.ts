
import { describe, it, expect } from 'vitest';
import { calculate } from './useProfitEngine';
import type { Inputs } from '../types';

const base: Inputs = {
  attendees: 250,
  percentDrinkers: 75,
  percentEating: 50,
  ticketPrice: 10.00,
  eventbriteFeePerTicket: 2.51,
  absorbFees: true,
  avgDrinkPrice: 8.00,
  avgFoodPrice: 10.00,
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

describe('calculate', () => {
  it('matches known scenario (250/75/50 defaults)', () => {
    const r = calculate(base);
    // Derived counts
    expect(r.drinkers).toBe(188);
    expect(r.foodBuyers).toBe(125);
    // Ticket revenue
    expect(r.ticketRevenue).toBeCloseTo(250 * (10 - 2.51), 2);
    // Toast fees and net revenue checks (approx because of floating point)
    const grossDrink = 188 * 8;
    const toastDrinkFee = (grossDrink * 0.0369) + (188 * 0.15);
    expect(r.grossDrink).toBeCloseTo(grossDrink, 4);
    expect(r.toastDrinkFee).toBeCloseTo(toastDrinkFee, 4);
    expect(r.netDrinkRevenue).toBeCloseTo(grossDrink - toastDrinkFee, 4);

    const grossFood = 125 * 10;
    const toastFoodFee = (grossFood * 0.0369) + (125 * 0.15);
    expect(r.grossFood).toBeCloseTo(grossFood, 4);
    expect(r.toastFoodFee).toBeCloseTo(toastFoodFee, 4);
    expect(r.netFoodRevenue).toBeCloseTo(grossFood - toastFoodFee, 4);

    const totalRevenue = r.ticketRevenue + r.netDrinkRevenue + r.netFoodRevenue;
    expect(r.totalRevenue).toBeCloseTo(totalRevenue, 4);

    const drinkCOGS = r.netDrinkRevenue * 0.30;
    const foodCOGS = r.netFoodRevenue * 0.35;
    expect(r.drinkCOGS).toBeCloseTo(drinkCOGS, 4);
    expect(r.foodCOGS).toBeCloseTo(foodCOGS, 4);
    expect(r.totalCOGS).toBeCloseTo(drinkCOGS + foodCOGS, 4);

    const netRevenue = totalRevenue - (drinkCOGS + foodCOGS);
    expect(r.netRevenue).toBeCloseTo(netRevenue, 4);

    const artist = netRevenue * 0.8;
    const clublessBase = netRevenue * 0.2;
    const bartenderMargin = (45 - 35) * 5 * 2;
    const securityMargin = (35 - 25) * 5 * 2;
    expect(r.artistEarnings).toBeCloseTo(artist, 4);
    expect(r.clublessBase).toBeCloseTo(clublessBase, 4);
    expect(r.bartenderMargin).toBeCloseTo(bartenderMargin, 4);
    expect(r.securityMargin).toBeCloseTo(securityMargin, 4);
    expect(r.clublessTotal).toBeCloseTo(clublessBase + bartenderMargin + securityMargin, 4);
  });
});

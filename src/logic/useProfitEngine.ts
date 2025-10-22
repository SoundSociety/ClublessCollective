
import { useMemo } from 'react';
import type { Inputs, Results } from '../types';

export function calculate(inputs: Inputs): Results {
  const warnings: string[] = [];

  function nz(n: any, name: string) {
    const v = Number(n);
    if (!isFinite(v)) {
      warnings.push(`${name} is invalid; treating as 0.`);
      return 0;
    }
    return v;
  }

  const attendees = Math.max(0, nz(inputs.attendees, 'attendees'));
  const percentDrinkers = Math.max(0, Math.min(100, nz(inputs.percentDrinkers, '% drinkers')));
  const percentEating  = Math.max(0, Math.min(100, nz(inputs.percentEating, '% eating')));

  const drinkers = Math.round(attendees * (percentDrinkers/100));
  const foodBuyers = Math.round(attendees * (percentEating/100));

  const ticketPrice = Math.max(0, nz(inputs.ticketPrice, 'ticketPrice'));
  const eventbriteFeePerTicket = Math.max(0, nz(inputs.eventbriteFeePerTicket, 'eventbriteFeePerTicket'));

  // Ticket revenue net of per-ticket fee (absorb vs pass-through modeled same per spec: treat fee as cost per ticket either way)
  const ticketRevenue = attendees * (ticketPrice - eventbriteFeePerTicket);

  const avgDrinkPrice = Math.max(0, nz(inputs.avgDrinkPrice, 'avgDrinkPrice'));
  const avgFoodPrice  = Math.max(0, nz(inputs.avgFoodPrice, 'avgFoodPrice'));
  const toastPct = Math.max(0, nz(inputs.toastPercent, 'toastPercent')) / 100;
  const toastFixed = Math.max(0, nz(inputs.toastFixed, 'toastFixed'));

  const grossDrink = drinkers * avgDrinkPrice;
  const toastDrinkFee = (grossDrink * toastPct) + (drinkers * toastFixed);
  const netDrinkRevenue = grossDrink - toastDrinkFee;

  const grossFood = foodBuyers * avgFoodPrice;
  const toastFoodFee = (grossFood * toastPct) + (foodBuyers * toastFixed);
  const netFoodRevenue = grossFood - toastFoodFee;

  const drinkCogsPct = Math.max(0, nz(inputs.drinkCogsPct, 'drinkCogsPct')) / 100;
  const foodCogsPct  = Math.max(0, nz(inputs.foodCogsPct, 'foodCogsPct')) / 100;

  const drinkCOGS = netDrinkRevenue * drinkCogsPct;
  const foodCOGS  = netFoodRevenue  * foodCogsPct;

  const totalRevenue = ticketRevenue + netDrinkRevenue + netFoodRevenue;
  const totalCOGS = drinkCOGS + foodCOGS;

  const bartenderMargin = (nz(inputs.bartenderBill, 'bartenderBill') - nz(inputs.bartenderPay, 'bartenderPay')) 
    * nz(inputs.eventHours, 'eventHours') * nz(inputs.numBartenders, 'numBartenders');

  const securityMargin = (nz(inputs.securityBill, 'securityBill') - nz(inputs.securityPay, 'securityPay')) 
    * nz(inputs.eventHours, 'eventHours') * nz(inputs.numSecurity, 'numSecurity');

  const venueCost = Math.max(0, nz(inputs.venueCost, 'venueCost'));
  const otherCosts = Array.isArray(inputs.otherCosts) ? inputs.otherCosts : [];
  const otherSum = otherCosts.reduce((sum, c) => sum + (isFinite(Number(c.amount)) ? Number(c.amount) : 0), 0);

  const netRevenue = totalRevenue - totalCOGS - venueCost - otherSum;

  const artistSplit = Math.max(0, Math.min(1, nz(inputs.artistSplit, 'artistSplit')));
  const clublessSplit = Math.max(0, Math.min(1, nz(inputs.clublessSplit, 'clublessSplit')));

  const artistEarnings = netRevenue * artistSplit;
  const clublessBase = netRevenue * clublessSplit;
  const clublessTotal = clublessBase + bartenderMargin + securityMargin;

  return {
    drinkers, foodBuyers,
    ticketRevenue,
    grossDrink, toastDrinkFee, netDrinkRevenue,
    grossFood, toastFoodFee, netFoodRevenue,
    drinkCOGS, foodCOGS,
    totalRevenue, totalCOGS,
    bartenderMargin, securityMargin,
    netRevenue, artistEarnings, clublessBase, clublessTotal,
    warnings
  }
}

export function useProfitEngine(inputs: Inputs) {
  return useMemo(() => calculate(inputs), [inputs]);
}

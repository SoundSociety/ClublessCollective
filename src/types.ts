export type Inputs = {
  // NEW: capacity + expected attendance %
  maxOccupancy: number;        // e.g., 300
  attendancePercent: number;   // 0..100 (% who actually attend)

  percentDrinkers: number; // 0..100
  percentEating: number;   // 0..100

  ticketPrice: number;
  eventbriteFeePerTicket: number;
  absorbFees: boolean;

  avgDrinkPrice: number;
  avgFoodPrice: number;

  toastPercent: number; // 3.69% default
  toastFixed: number;   // $0.15 default

  drinkCogsPct: number; // 30%
  foodCogsPct: number;  // 35%

  bartenderPay: number;
  bartenderBill: number;
  securityPay: number;
  securityBill: number;
  numBartenders: number;
  numSecurity: number;
  eventHours: number;

  artistSplit: number;   // 0..1
  clublessSplit: number; // 0..1

  venueCost: number;
  otherCosts: { label: string; amount: number }[];
}

export type Results = {
  // NEW: attendees is now derived from capacity × %
  attendees: number;

  drinkers: number;
  foodBuyers: number;

  ticketRevenue: number;
  grossDrink: number;
  toastDrinkFee: number;
  netDrinkRevenue: number;

  grossFood: number;
  toastFoodFee: number;
  netFoodRevenue: number;

  drinkCOGS: number;
  foodCOGS: number;

  totalRevenue: number;
  totalCOGS: number;

  bartenderMargin: number;
  securityMargin: number;

  netRevenue: number;
  artistEarnings: number;
  clublessBase: number;
  clublessTotal: number;

  warnings: string[];
}

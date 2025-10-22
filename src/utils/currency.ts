
export const clampNonNegative = (n: number) => isFinite(n) && n > 0 ? n : 0;

export const toPct = (n: number) => Math.min(100, Math.max(0, n));

export const fmt = (n: number) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);

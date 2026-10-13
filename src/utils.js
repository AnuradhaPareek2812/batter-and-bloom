import { FLAVOURS, TOPPINGS, TIER_EXTRA, EGGLESS_PER_KG, DRIP_PRICE } from './data.js';

export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

// Price of a custom cake from the builder.
export function priceOf(spec) {
  const flavour = FLAVOURS.find((f) => f.id === spec.flavour);
  const topping = TOPPINGS.find((t) => t.id === spec.topping);
  const cake = (flavour.perKg + (spec.eggless ? EGGLESS_PER_KG : 0)) * spec.weight;
  const tiers = TIER_EXTRA[spec.tiers];
  const top = topping.price;
  const drip = spec.drip ? DRIP_PRICE : 0;
  return { cake, tiers, top, drip, total: cake + tiers + top + drip };
}

// Small seeded random generator so sprinkles stay in the same place on every render.
export function rng(seed) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + m + '-' + day;
}

export function prettyDate(iso) {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  } catch (e) {
    return iso;
  }
}

export function loadCart() {
  try {
    const value = JSON.parse(localStorage.getItem('bb-cart') || '[]');
    return Array.isArray(value) ? value : [];
  } catch (e) {
    return [];
  }
}

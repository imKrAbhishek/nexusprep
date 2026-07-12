// utils/formatters.js
// ─────────────────────────────────────────────────────────────
// WHY THIS FILE EXISTS:
// Tiny pure functions used all over the UI.
// Centralised here so formatting is consistent across every component.
// ─────────────────────────────────────────────────────────────

/** Format price in Indian Rupees: 4999 → "₹4,999" */
export const formatPrice = (n) =>
  `₹${Number(n).toLocaleString('en-IN')}`;

/** Format large numbers: 4820 → "4.8K", 50000 → "50K" */
export const formatCount = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

/** Discount % between original and sale price */
export const discountPercent = (original, sale) =>
  Math.round(((original - sale) / original) * 100);

/** Greeting based on hour */
export const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

/** Initials from full name: "Aarav Gupta" → "AG" */
export const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

/** Truncate long strings: truncate("hello world", 7) → "hello w…" */
export const truncate = (str, len) =>
  str.length > len ? str.slice(0, len) + '…' : str;

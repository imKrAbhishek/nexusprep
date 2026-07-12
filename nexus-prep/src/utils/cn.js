// utils/cn.js
// ─────────────────────────────────────────────────────────────
// WHY THIS FILE EXISTS:
// Tailwind className merging helper.
// Keeps conditional class logic readable inside JSX.
// Usage: cn('base-class', isActive && 'active-class', 'always-on')
// → "base-class active-class always-on"   (falsy values dropped)
// ─────────────────────────────────────────────────────────────

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

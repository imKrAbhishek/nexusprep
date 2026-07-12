// hooks/useAuth.js
// ─────────────────────────────────────────────────────────────
// WHY THIS FILE EXISTS:
// Re-exports the useAuth hook from AuthContext.
// Components import from hooks/ not from context/ directly.
// This keeps the import path consistent even if AuthContext moves.
// Usage: import { useAuth } from 'hooks/useAuth'
// ─────────────────────────────────────────────────────────────
export { useAuth } from '../context/AuthContext';

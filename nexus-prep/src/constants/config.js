// constants/config.js
// ─────────────────────────────────────────────────────────────
// WHY THIS FILE EXISTS:
// All environment-dependent values live here.
// Never scatter process.env calls throughout the codebase.
// When you add a .env file, update ONLY this file.
// ─────────────────────────────────────────────────────────────

export const CONFIG = {
  // API base URL — set REACT_APP_API_URL in .env for production
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',

  // App metadata
  APP_NAME:    process.env.REACT_APP_NAME    || 'NexusPrep',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',

  // Feature flags — flip these to enable/disable features without code changes
  FEATURES: {
    AI_DOUBTS:       true,
    GOOGLE_OAUTH:    false,   // flip to true once Google OAuth is wired up
    PAYMENT_GATEWAY: false,   // flip to true once Razorpay/Stripe is integrated
    DARK_MODE:       false,
  },

  // Pagination defaults
  PAGE_SIZE: 12,

  // Token key in localStorage — used by authService later
  TOKEN_KEY: 'nexusprep_token',
};

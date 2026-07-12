// utils/validators.js
// ─────────────────────────────────────────────────────────────
// WHY THIS FILE EXISTS:
// Form validation rules shared between LoginPage, SignupPage, and
// any future forms. Change a rule here → fixes all forms at once.
// ─────────────────────────────────────────────────────────────

export const validators = {
  required: (val, label = 'This field') =>
    !val?.toString().trim() ? `${label} is required.` : '',

  email: (val) =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? 'Enter a valid email address.' : '',

  minLength: (val, min, label = 'This field') =>
    val?.length < min ? `${label} must be at least ${min} characters.` : '',

  passwordMatch: (pw, confirm) =>
    pw !== confirm ? 'Passwords do not match.' : '',

  passwordStrength: (pw) => {
    if (!pw) return '';
    if (pw.length < 8) return 'Password must be at least 8 characters.';
    return '';
  },
};

/**
 * Run multiple validators on a single value and return the first error.
 * Usage: validate(email, [validators.required, validators.email])
 */
export const validate = (value, rules = []) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return '';
};

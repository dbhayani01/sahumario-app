/**
 * Structured payment event logger.
 * All payment-related console output goes through here for consistency
 * and easier filtering in production logs.
 */

const FRIENDLY_ERRORS = [
  [/insufficient/i, "Insufficient funds. Please try a different payment method."],
  [/declined/i, "Payment declined. Please try a different method."],
  [/bad_request_error/i, "Invalid payment details. Please check and retry."],
  [/network/i, "Network error. Check your connection and retry."],
  [/timeout/i, "Request timed out. Please retry."],
  [/verification failed/i, "Payment could not be verified. Please contact support."],
];

/**
 * Maps a raw error to a user-friendly message string.
 * Returns null for CANCELLED (user dismissed modal — no error shown).
 */
export function friendlyPaymentError(err) {
  const msg = err?.message || "";
  if (msg === "CANCELLED") return null;

  for (const [pattern, friendly] of FRIENDLY_ERRORS) {
    if (pattern.test(msg)) return friendly;
  }

  return msg || "An unexpected error occurred. Please try again.";
}

/**
 * Logs a payment lifecycle event to the console.
 * @param {"info"|"warn"|"error"} level
 * @param {string} event  e.g. "INITIATED", "ORDER_CREATED", "VERIFIED", "FAILED"
 * @param {object} [data]
 */
export function paymentLog(level, event, data = {}) {
  const prefix = `[Payment:${event}]`;
  if (level === "warn") console.warn(prefix, data);
  else if (level === "error") console.error(prefix, data);
  else console.info(prefix, data);
}

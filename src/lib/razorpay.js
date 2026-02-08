/**
 * Razorpay frontend SDK helpers.
 *
 * Keeps all SDK-related logic in one place so CheckoutPage stays clean.
 */

const SDK_URL = "https://checkout.razorpay.com/v1/checkout.js";

/**
 * Lazily loads the Razorpay checkout script.
 * Safe to call multiple times — resolves immediately if already loaded.
 */
export function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () =>
      reject(new Error("Failed to load payment SDK. Check your internet connection."));
    document.body.appendChild(script);
  });
}

/**
 * Returns true when the key is a Razorpay test key (starts with "rzp_test_").
 * Used to show a test-mode badge in the UI.
 */
export function isTestMode(keyId) {
  return typeof keyId === "string" && keyId.startsWith("rzp_test_");
}

/**
 * Opens the Razorpay checkout modal and returns a Promise:
 *  - Resolves with { razorpay_payment_id, razorpay_order_id, razorpay_signature }
 *  - Rejects with an Error whose message is "CANCELLED" when user dismisses,
 *    or a descriptive string on payment failure.
 *
 * Keeping dismiss separate from failure lets callers suppress the "cancelled" error silently.
 */
export function openRazorpayCheckout(options) {
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      ...options,
      // Success: Razorpay calls handler with the payment response
      handler(response) {
        resolve(response);
      },
      modal: {
        // User closed the modal without paying
        ondismiss() {
          reject(new Error("CANCELLED"));
        },
      },
    });

    // Card declined, insufficient funds, etc.
    rzp.on("payment.failed", (response) => {
      reject(
        new Error(
          response.error?.description ||
            response.error?.reason ||
            "Payment failed. Please try a different method."
        )
      );
    });

    rzp.open();
  });
}

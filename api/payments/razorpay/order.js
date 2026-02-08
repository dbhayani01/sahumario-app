/**
 * POST /api/payments/razorpay/order
 *
 * Creates a Razorpay order. Must be called before opening the checkout modal.
 * Expects: { amount (paise), currency, customer: { name, phone, email }, notes }
 * Returns: Razorpay order object { id, amount, currency, ... }
 */
const Razorpay = require("razorpay");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { amount, currency = "INR", customer = {}, notes = {} } = req.body || {};

  if (!amount || typeof amount !== "number" || amount < 100) {
    return res.status(400).json({ message: "amount must be a number >= 100 (paise)" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error("[Razorpay] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET env vars");
    return res.status(500).json({ message: "Payment gateway is not configured" });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        ...notes,
        customer_name: customer.name || "",
        customer_phone: customer.phone || "",
        customer_email: customer.email || "",
      },
    });

    return res.status(200).json(order);
  } catch (err) {
    console.error("[Razorpay] Order creation failed:", err);
    return res
      .status(502)
      .json({ message: err?.error?.description || "Failed to create payment order" });
  }
};

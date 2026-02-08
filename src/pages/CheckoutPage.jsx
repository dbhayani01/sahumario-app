import React, { useState, useCallback } from "react";
import { Card, Button } from "../components/ui";
import { ShoppingBag, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import ShippingForm from "../components/ShippingForm";
import CartSummary from "../components/CartSummary";
import { useCart } from "../context/cartContext";
import { formatINR } from "../utils/money";

/**
 * CheckoutPage Component - Modern, secure checkout experience
 *
 * Features:
 * - Premium UI with smooth transitions
 * - Multi-step validation
 * - Loading and error states
 * - Mobile-first responsive design
 * - Accessibility-compliant
 */
export default function CheckoutPage({ setCurrentPage }) {
  const { items, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFormChange = useCallback((data) => {
    setFormData(data);
    setError(null);
  }, []);

  const initiatePayment = useCallback(async () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pin) {
      setError("Please fill in all required fields before proceeding to payment.");
      return;
    }

    try {
      setLoading(true);
      const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error("Razorpay key is not configured.");
      }

      const orderResponse = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(subtotal * 100),
          currency: "INR",
          customer: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email || "",
          },
          notes: {
            address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pin}`,
            instructions: formData.notes || "",
          },
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Unable to create payment order.");
      }

      const orderData = await orderResponse.json();
      await loadRazorpayScript();

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Sahumario",
        description: "Perfume order payment",
        order_id: orderData.id,
        prefill: {
          name: formData.name,
          email: formData.email || "",
          contact: formData.phone,
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pin}`,
          instructions: formData.notes || "",
        },
        theme: {
          color: "#d97706",
        },
        handler: () => {
          clearCart();
          setCurrentPage("perfumes");
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      setError(err?.message || "Failed to start payment. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [formData, subtotal, clearCart, setCurrentPage]);

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK."));
      document.body.appendChild(script);
    });
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-50 mb-4">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Your cart is empty</h2>
          <p className="text-[var(--color-muted)] mb-6 max-w-md mx-auto">
            Add some beautiful fragrances to your cart to continue with checkout.
          </p>
          <Button
            onClick={() => setCurrentPage("perfumes")}
            size="lg"
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            Browse Perfumes
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      {/* Header with security badge */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Secure Checkout</h1>
            <p className="text-sm text-[var(--color-muted)] flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Your payment information is secure and encrypted
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <span>Step 1 of 2</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
              Payment Error
            </h3>
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div
          className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
          role="alert"
          aria-live="polite"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
              Payment Successful!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-200">
              Your order has been confirmed. Redirecting...
            </p>
          </div>
        </div>
      )}

      {/* Main Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left: Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-300 font-semibold">
                1
              </div>
              <h2 className="text-xl font-semibold">Shipping Information</h2>
            </div>
            <ShippingForm
              onFormChange={handleFormChange}
              initialValues={formData}
            />
          </Card>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm text-[var(--color-muted)]">
            <div className="flex flex-col items-center gap-2">
              <Lock className="w-5 h-5" />
              <span>Secure Payment</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Verified Seller</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Quality Products</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Safe Checkout</span>
            </div>
          </div>
        </div>

        {/* Right: Order Summary - Sticky on desktop */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-20">
            <Card className="p-6 shadow-xl border-2 border-[var(--color-border)]">
              <CartSummary
                items={items}
                subtotal={subtotal}
                onCheckout={initiatePayment}
                onContinueShopping={() => setCurrentPage("perfumes")}
                loading={loading}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Processing payment"
        >
          <Card className="p-8 max-w-sm mx-4 text-center">
            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-sm text-[var(--color-muted)]">
              Please wait while we securely process your payment...
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-4">
              Do not close this window or press back
            </p>
          </Card>
        </div>
      )}
    </section>
  );
}

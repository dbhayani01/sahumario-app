import React, { useState, useCallback } from "react";
import { Card, Button } from "../components/ui";
import ShippingForm from "../components/ShippingForm";
import CartSummary from "../components/CartSummary";
import { useCart } from "../context/cartContext";
import { formatINR } from "../utils/money";

export default function CheckoutPage({ setCurrentPage }) {
  const { items, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h2 className="text-2xl font-semibold">Checkout</h2>
        <p className="mt-4 text-[var(--color-muted)]">Your cart is empty.</p>
        <Button 
          onClick={() => setCurrentPage("perfumes")}
          className="mt-4"
          size="lg"
        >
          Browse Perfumes
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="text-2xl font-semibold mb-8">Checkout</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping Form */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Shipping Address</h3>
            <ShippingForm 
              onFormChange={handleFormChange}
              initialValues={formData}
            />
          </Card>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card className="p-6 sticky top-20">
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
    </section>
  );
}

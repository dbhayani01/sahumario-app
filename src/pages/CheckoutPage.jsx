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

  const sendCartToWhatsApp = useCallback(async () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pin) {
      setError("Please fill in all required fields before sending the cart to WhatsApp.");
      return;
    }

    try {
      setLoading(true);
      const phoneNumber = "+919427368910";
      const cartDetails = items.map(item => `${item.name} x${item.qty}`).join("\n");
      const addressDetails = `Name: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pin}`;
      const notes = formData.notes ? `\nNotes: ${formData.notes}` : "";
      const message = `Cart Details:\n${cartDetails}\n\n${addressDetails}${notes}\n\nTotal: ${formatINR(subtotal)}`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, "_blank");
      clearCart();
      setCurrentPage("perfumes");
    } catch (err) {
      setError("Failed to send cart. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [formData, items, subtotal, clearCart, setCurrentPage]);

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h2 className="text-2xl font-semibold">Checkout</h2>
        <p className="mt-4 text-gray-600">Your cart is empty.</p>
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
              onCheckout={sendCartToWhatsApp}
              onContinueShopping={() => setCurrentPage("perfumes")}
              loading={loading}
            />
          </Card>
        </div>
      </div>
    </section>
  );
}
    </section>
  );
}
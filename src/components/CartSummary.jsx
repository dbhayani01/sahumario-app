import React from 'react';
import { Button } from './ui';
import { formatINR } from '../utils/money';

const CartSummary = React.memo(({ items, subtotal, onCheckout, onContinueShopping, loading = false }) => {
  const TAX_RATE = 0.1;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Order Summary</h3>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.product_id} className="flex justify-between text-sm">
            <span className="text-gray-600">{item.name} x{item.qty}</span>
            <span className="font-medium">{formatINR(item.price * item.qty)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatINR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (10%)</span>
          <span className="font-medium">{formatINR(tax)}</span>
        </div>
        <div className="flex justify-between text-base border-t pt-2">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">{formatINR(total)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-4">
        <Button
          onClick={onCheckout}
          disabled={items.length === 0 || loading}
          variant="success"
          className="w-full"
        >
          {loading ? 'Processing...' : 'Send Cart to WhatsApp'}
        </Button>
        <Button
          onClick={onContinueShopping}
          variant="secondary"
          className="w-full"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
});

CartSummary.displayName = 'CartSummary';

export default CartSummary;

import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from './ui';
import { formatINR } from '../utils/money';

/**
 * CartSummary Component - Premium checkout summary with visual enhancements
 */
const CartSummary = React.memo(({ items, subtotal, onCheckout, onContinueShopping, loading = false }) => {
  const total = subtotal;
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">Order Summary</h3>
          <span className="text-sm text-[var(--color-muted)]">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>
        <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full" />
      </div>

      {/* Items List */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
        {items.map((item) => (
          <div
            key={item.product_id}
            className="flex justify-between items-start gap-3 pb-3 border-b border-[var(--color-border)] last:border-0"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{item.name}</p>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">
                Qty: {item.qty} × {formatINR(item.price)}
              </p>
            </div>
            <span className="font-semibold text-sm whitespace-nowrap">
              {formatINR(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3 pt-4 border-t-2 border-[var(--color-border)]">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-muted)]">Subtotal</span>
          <span className="font-medium">{formatINR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-muted)]">Shipping</span>
          <span className="font-medium text-green-600">FREE</span>
        </div>
        <div className="flex justify-between items-center text-base pt-3 border-t border-[var(--color-border)]">
          <span className="font-bold text-lg">Total</span>
          <span className="font-bold text-xl text-amber-600">
            {formatINR(total)}
          </span>
        </div>
      </div>

      {/* Payment CTA */}
      <div className="space-y-3 pt-2">
        <Button
          onClick={onCheckout}
          disabled={items.length === 0 || loading}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Proceed to Payment
            </span>
          )}
        </Button>

        <Button
          onClick={onContinueShopping}
          variant="secondary"
          className="w-full"
          disabled={loading}
        >
          Continue Shopping
        </Button>

        <p className="text-xs text-center text-[var(--color-muted)] pt-2">
          By proceeding, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
});

CartSummary.displayName = 'CartSummary';

export default CartSummary;

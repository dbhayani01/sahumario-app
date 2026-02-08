import React from 'react';
import { X } from 'lucide-react';
import SafeImage from './SafeImage';
import { Button } from './ui';
import { formatINR } from '../utils/money';

const ProductDetailModal = React.memo(({ 
  product, 
  quantity = 0, 
  onClose, 
  onAdd, 
  onUpdateQty 
}) => {
  if (!product) return null;

  const handleQtyChange = (newQty) => {
    if (newQty >= 0) {
      onUpdateQty(product.id, newQty);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--color-surface)] rounded-lg shadow-xl p-4 sm:p-6 border border-[var(--color-border)] text-[var(--color-text)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl sm:text-2xl font-bold pr-2">{product.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-surface-muted)] rounded-lg flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Image */}
          <div className="bg-[var(--color-surface-muted)] rounded-lg overflow-hidden">
            <SafeImage
              src={product.image}
              alt={product.alt || product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <p className="text-[var(--color-muted)] text-base sm:text-lg mb-4">{product.description}</p>

            <div className="mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl font-bold text-amber-600">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
            </div>

            {quantity > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleQtyChange(quantity - 1)}
                  >
                    −
                  </Button>
                  <span className="text-lg font-semibold min-w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleQtyChange(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                <p className="text-sm text-[var(--color-muted)]">
                  Subtotal: {formatINR(product.price * quantity)}
                </p>
              </div>
            ) : (
              <Button
                onClick={() => onAdd(product)}
                className="w-full"
                size="lg"
              >
                Add to Cart
              </Button>
            )}

            <button
              onClick={onClose}
              className="w-full mt-4 py-2 px-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-muted)] transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductDetailModal.displayName = 'ProductDetailModal';

export default ProductDetailModal;

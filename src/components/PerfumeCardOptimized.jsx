import React from 'react';
import SafeImage from './SafeImage';
import { formatINR } from '../utils/money';

const PerfumeCardOptimized = React.memo(({ 
  product, 
  quantity = 0, 
  onClickCard, 
  onAdd, 
  onUpdateQty 
}) => {
  const { id, name, description, price, image, alt } = product;

  return (
    <article
      className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClickCard}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClickCard();
        }
      }}
    >
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
        <SafeImage
          src={image}
          alt={alt || name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h4 className="font-semibold text-lg line-clamp-1">{name}</h4>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2 hidden sm:block">
          {description}
        </p>
        
        <div className="mt-3 font-medium hidden sm:block">
          ₹{Number(price).toLocaleString('en-IN')}
        </div>

        {quantity > 0 && (
          <div className="mt-4 flex items-center space-x-2 hidden sm:flex">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateQty(id, quantity - 1);
              }}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              aria-label={`Decrease ${name}`}
            >
              −
            </button>
            <span className="min-w-6 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateQty(id, quantity + 1);
              }}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              aria-label={`Increase ${name}`}
            >
              +
            </button>
          </div>
        )}
      </div>
    </article>
  );
});

PerfumeCardOptimized.displayName = 'PerfumeCardOptimized';

export default PerfumeCardOptimized;

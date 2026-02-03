import React, { useMemo } from 'react';
import PerfumeCardOptimized from './PerfumeCardOptimized';

const ProductGrid = React.memo(({ 
  products = [], 
  selectedProductId, 
  onSelectProduct, 
  onAddToCart, 
  onUpdateQty,
  columns = { default: 2, sm: 3, lg: 4 }
}) => {
  const gridColsClass = useMemo(() => {
    return `grid-cols-${columns.default} sm:grid-cols-${columns.sm} lg:grid-cols-${columns.lg}`;
  }, [columns]);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-muted)] text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${gridColsClass}`}>
      {products.map((product) => (
        <PerfumeCardOptimized
          key={product.id}
          product={product}
          quantity={product.qty || 0}
          onClickCard={() => onSelectProduct(product)}
          onAdd={() => onAddToCart(product)}
          onUpdateQty={(id, newQty) => onUpdateQty(id, newQty)}
        />
      ))}
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;

// src/pages/PerfumesPage.jsx
import React, { useState, useCallback, useMemo } from "react";
import ProductGrid from "../components/ProductGrid";
import ProductDetailModal from "../components/ProductDetailModal";
import SectionHeader from "../components/SectionHeader";
import localProducts from "../data/products.json";
import { useCart } from "../context/cartContext";

export default function PerfumesPage() {
  const { items, addToCart, updateQty } = useCart();
  const [selectedProductId, setSelectedProductId] = useState(null);

  const itemQtyById = useMemo(
    () =>
      items.reduce((acc, item) => {
        acc[item.product_id] = item.qty;
        return acc;
      }, {}),
    [items]
  );

  const products = useMemo(
    () =>
      localProducts.map((product) => ({
        ...product,
        qty: itemQtyById[product.id] ?? 0,
      })),
    [itemQtyById]
  );

  const selectedPerfume = useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? null,
    [products, selectedProductId]
  );

  const handleSelectProduct = useCallback((product) => {
    setSelectedProductId(product.id);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProductId(null);
  }, []);

  const handleAddToCart = useCallback(
    (product) => {
      addToCart(product);
      setSelectedProductId(product.id);
    },
    [addToCart]
  );

  const handleUpdateQty = useCallback((productId, newQty) => {
    updateQty(productId, newQty);
  }, [updateQty]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader 
        title="Our Collection"
        subtitle="Discover our range of authentic oil-based perfumes."
      />

      {selectedPerfume && (
        <ProductDetailModal
          product={selectedPerfume}
          quantity={selectedPerfume.qty || 0}
          onClose={handleCloseModal}
          onAdd={handleAddToCart}
          onUpdateQty={handleUpdateQty}
        />
      )}

      <div className="mt-8">
        <ProductGrid
          products={products}
          selectedProductId={selectedProductId}
          onSelectProduct={handleSelectProduct}
          onAddToCart={handleAddToCart}
          onUpdateQty={handleUpdateQty}
        />
      </div>
    </section>
  );
}

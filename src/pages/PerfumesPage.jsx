// src/pages/PerfumesPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import ProductGrid from "../components/ProductGrid";
import ProductDetailModal from "../components/ProductDetailModal";
import SectionHeader from "../components/SectionHeader";
import localProducts from "../data/products.json";
import { useCart } from "../context/cartContext";

export default function PerfumesPage() {
  const { items, addToCart, updateQty } = useCart();
  const [selectedPerfume, setSelectedPerfume] = useState(null);

  // Memoize products with quantity data
  const products = useMemo(() => {
    return localProducts.map((product) => {
      const cartItem = items.find((item) => item.product_id === product.id);
      return {
        ...product,
        qty: cartItem ? cartItem.qty : 0,
      };
    });
  }, [items]);

  // Update selected product quantity when cart changes
  useEffect(() => {
    if (selectedPerfume) {
      const updatedItem = items.find(item => item.product_id === selectedPerfume.id);
      setSelectedPerfume(prev => ({ ...prev, qty: updatedItem ? updatedItem.qty : 0 }));
    }
  }, [items, selectedPerfume?.id]);

  const handleSelectProduct = useCallback((product) => {
    setSelectedPerfume(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPerfume(null);
  }, []);

  const handleAddToCart = useCallback((product) => {
    addToCart(product);
    setSelectedPerfume(prev => ({ ...prev, qty: 1 }));
  }, [addToCart]);

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
          selectedProductId={selectedPerfume?.id}
          onSelectProduct={handleSelectProduct}
          onAddToCart={handleAddToCart}
          onUpdateQty={handleUpdateQty}
        />
      </div>
    </section>
  );
}
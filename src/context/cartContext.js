import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const CartCtx = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load from server
  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const data = await api("/cart");
        if (!ignore) setItems(data);
      } catch { /* ignore */ }
    }
    load();
    return () => { ignore = true; };
  }, []);

  const addToCart = async (product) => {
    if (!product.id || !product.price) {
      alert("Invalid product");
      return;
    }
    const newItem = {
      product_id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    };
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product_id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product_id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevItems, newItem];
    });
  };

  const updateQty = (itemId, qty) => {
    setItems((prevItems) => {
      if (qty === 0) {
        return prevItems.filter((item) => item.product_id !== itemId);
      }
      return prevItems.map((item) =>
        item.product_id === itemId ? { ...item, qty } : item
      );
    });
  };

  const removeItem = async (itemId) => {
    await api(`/cart/items/${itemId}`, { method: "DELETE" });
    const next = await api("/cart");
    setItems(next);
  };

  const clearCart = async () => {
    try {
      await api("/cart", { method: "DELETE" });
      setItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      alert("An error occurred while clearing the cart. Please try again.");
    }
  };

  const syncCartWithPerfumes = () => {
    setItems((prevItems) => {
      const cartItemsMap = new Map(prevItems.map((item) => [item.product_id, item.qty]));
      const updatedItems = prevItems.map((item) => {
        const updatedQty = cartItemsMap.get(item.product_id) || item.qty;
        return { ...item, qty: updatedQty };
      });

      // Only update state if items have changed
      if (JSON.stringify(prevItems) !== JSON.stringify(updatedItems)) {
        return updatedItems;
      }
      return prevItems;
    });
  };

  useEffect(() => {
    syncCartWithPerfumes();
  }, []); // Removed `items` dependency to prevent infinite loop

  const count = useMemo(() => items.reduce((s, p) => s + p.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, p) => s + p.qty * p.price, 0), [items]);
  const TAX_RATE = 0; // keep in sync with backend if you surface locally
  const tax = useMemo(() => Math.round(subtotal * TAX_RATE), [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  return (
    <CartCtx.Provider value={{ items, addToCart, updateQty, removeItem, clearCart, count, subtotal, tax, total }}>
      {children}
    </CartCtx.Provider>
  );
}
export function useCart() { return useContext(CartCtx); }

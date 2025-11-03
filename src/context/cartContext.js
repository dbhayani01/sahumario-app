import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "./AuthContext";

const CartCtx = createContext();

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load from server when logged in
  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!token) { setItems([]); return; }
      try {
        const data = await api("/cart", { token });
        if (!ignore) setItems(data);
      } catch { /* ignore */ }
    }
    load();
    return () => { ignore = true; };
  }, [token]);

  const addToCart = async (product) => {
    if (!token) {
      alert("Please login to add to cart");
      return;
    }
    if (!product.id || !product.price) {
      alert("Invalid product");
      return;
    }
    const res = await api("/cart/items", {
      method: "POST",
      token,
      body: {
        product_id: product.id,
        name: product.name, // Ensure the name is passed
        price: product.price, // Include price
        qty: 1,
      },
    });
    const next = await api("/cart", { token });
    setItems(next);
  };

  const updateQty = async (itemId, qty) => {
    if (!token || loading) return;
    setLoading(true);
    try {
      if (qty === 0) {
        await api(`/cart/items/${itemId}`, { method: "DELETE", token });
      } else {
        await api(`/cart/items/${itemId}`, { method: "PATCH", token, body: { qty } });
      }
      const next = await api("/cart", { token });
      setItems(Array.isArray(next) ? next : []);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert(`An error occurred while updating the cart: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    await api(`/cart/items/${itemId}`, { method: "DELETE", token });
    const next = await api("/cart", { token });
    setItems(next);
  };

  const clearCart = async () => {
    try {
      await api("/cart", { method: "DELETE", token });
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

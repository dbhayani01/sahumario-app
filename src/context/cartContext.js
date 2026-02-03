import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

const CartCtx = createContext();
const CART_STORAGE_KEY = "sahumario_cart";
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const storedItems = localStorage.getItem(CART_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore write errors in restricted environments.
    }
  }, [items]);

  const addToCart = (product) => {
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

  const updateQty = useCallback((itemId, qty) => {
    setItems((prevItems) => {
      if (qty === 0) {
        return prevItems.filter((item) => item.product_id !== itemId);
      }
      return prevItems.map((item) =>
        item.product_id === itemId ? { ...item, qty } : item
      );
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.product_id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const count = useMemo(() => items.reduce((s, p) => s + p.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, p) => s + p.qty * p.price, 0), [items]);
  const TAX_RATE = 0.1; // Example tax rate
  const tax = useMemo(() => Math.round(subtotal * TAX_RATE), [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  return (
    <CartCtx.Provider value={{ items, addToCart, updateQty, removeItem, clearCart, count, subtotal, tax, total }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  return useContext(CartCtx);
}

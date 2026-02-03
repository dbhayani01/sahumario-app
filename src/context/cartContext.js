import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product) => {
    if (!product?.id || !product?.price) {
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
  }, []);

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
  const total = subtotal;

  const value = useMemo(
    () => ({
      items,
      addToCart,
      updateQty,
      removeItem,
      clearCart,
      count,
      subtotal,
      total,
    }),
    [items, addToCart, updateQty, removeItem, clearCart, count, subtotal, total]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  return useContext(CartCtx);
}

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const OrdersContext = createContext(null);
const ORDERS_KEY = "sahumario_orders";

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Persist orders to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // Silently ignore write errors (e.g. private browsing storage limit)
    }
  }, [orders]);

  // orderData shape: { id, items, subtotal, total, address, payment, createdAt }
  const addOrder = useCallback((orderData) => {
    setOrders((prev) => [orderData, ...prev]); // newest-first order
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside <OrdersProvider>");
  return ctx;
}

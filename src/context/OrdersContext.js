/**
 * Orders Context - Manages order history with localStorage persistence
 *
 * Features:
 * - Store completed orders
 * - Automatic localStorage sync
 * - Newest orders first ordering
 */

import React, { createContext, useContext, useEffect, useState } from "react";

const OrdersContext = createContext();
const ORDERS_KEY = "sahumario_orders";

/**
 * Orders Provider Component
 * Wraps the application to provide order history state and operations
 */
export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  /**
   * Add a completed order to history
   * @param {Object} orderData - Order object with id, items, subtotal, total, address, payment, createdAt
   */
  const addOrder = (orderData) => {
    if (!orderData || !orderData.id) {
      console.error('Invalid order data:', orderData);
      return;
    }
    setOrders((prev) => [orderData, ...prev]); // Newest orders first
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

/**
 * Hook to access orders context
 * @returns {Object} Orders state and operations
 * @throws {Error} If used outside OrdersProvider
 */
export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}

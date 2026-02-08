/**
 * Cart Context - Manages shopping cart state with localStorage persistence
 *
 * Features:
 * - Add/remove/update cart items
 * - Automatic localStorage sync
 * - Quantity management with validation
 * - Subtotal, tax, and total calculations
 * - Cart count tracking
 */

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

/**
 * Cart Provider Component
 * Wraps the application to provide cart state and operations
 */
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

  /**
   * Add a product to cart or increment quantity if already exists
   * @param {Object} product - Product object with id, name, price
   */
  const addToCart = useCallback((product) => {
    // Validate product data
    if (!product || !product.id || typeof product.price !== 'number') {
      console.error('Invalid product data:', product);
      return;
    }

    const newItem = {
      product_id: product.id,
      name: product.name || 'Unknown Product',
      price: product.price,
      qty: 1,
    };

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product_id === product.id);
      if (existingItem) {
        // Increment quantity if item already in cart
        return prevItems.map((item) =>
          item.product_id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      // Add new item to cart
      return [...prevItems, newItem];
    });
  }, []);

  /**
   * Update quantity of a cart item
   * @param {number} itemId - Product ID
   * @param {number} qty - New quantity (0 removes item)
   */
  const updateQty = useCallback((itemId, qty) => {
    if (typeof qty !== 'number' || qty < 0) {
      console.error('Invalid quantity:', qty);
      return;
    }

    setItems((prevItems) => {
      if (qty === 0) {
        // Remove item if quantity is 0
        return prevItems.filter((item) => item.product_id !== itemId);
      }
      // Update quantity
      return prevItems.map((item) =>
        item.product_id === itemId ? { ...item, qty } : item
      );
    });
  }, []);

  /**
   * Remove a specific item from cart
   * @param {number} itemId - Product ID to remove
   */
  const removeItem = useCallback((itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.product_id !== itemId));
  }, []);

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calculate cart totals
  const count = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.qty * item.price), 0), [items]);

  // Tax calculation (10% - can be configured)
  const TAX_RATE = 0.1;
  const tax = useMemo(() => Math.round(subtotal * TAX_RATE), [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  return (
    <CartCtx.Provider value={{ items, addToCart, updateQty, removeItem, clearCart, count, subtotal, tax, total }}>
      {children}
    </CartCtx.Provider>
  );
}

/**
 * Hook to access cart context
 * @returns {Object} Cart state and operations
 * @throws {Error} If used outside CartProvider
 */
export function useCart() {
  const context = useContext(CartCtx);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

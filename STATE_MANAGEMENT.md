# State Management Documentation

## Overview
This application uses React Context API for global state management with localStorage persistence. Three main contexts handle different aspects of application state.

## Context Providers

### 1. CartContext (`src/context/cartContext.js`)

Manages shopping cart state with automatic localStorage synchronization.

#### Features
- Add products to cart
- Update item quantities
- Remove items from cart
- Clear entire cart
- Automatic price calculations (subtotal, tax, total)
- Cart item count tracking
- localStorage persistence

#### API

```javascript
const {
  items,        // Array of cart items
  addToCart,    // (product) => void
  updateQty,    // (itemId, newQty) => void
  removeItem,   // (itemId) => void
  clearCart,    // () => void
  count,        // Total number of items
  subtotal,     // Sum of item prices
  tax,          // Calculated tax (10%)
  total         // Subtotal + tax
} = useCart();
```

#### Cart Item Structure
```javascript
{
  product_id: number,
  name: string,
  price: number,
  qty: number
}
```

#### Usage Example
```javascript
import { useCart } from '../context/cartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <button onClick={() => addToCart(product)}>
      Add to Cart
    </button>
  );
}
```

#### Error Handling
- Validates product data before adding to cart
- Validates quantity values (must be non-negative)
- Gracefully handles localStorage errors
- Logs errors to console for debugging

#### Storage Key
`sahumario_cart` - persists cart items across sessions

---

### 2. ThemeContext (`src/context/ThemeContext.js`)

Manages light/dark theme preference with localStorage persistence.

#### Features
- Toggle between light and dark themes
- Automatic localStorage synchronization
- Updates CSS custom properties (`data-theme` attribute)

#### API

```javascript
const {
  theme,         // 'light' | 'dark'
  toggleTheme    // () => void
} = useTheme();
```

#### Usage Example
```javascript
import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌞' : '🌙'}
    </button>
  );
}
```

#### CSS Integration
Theme is applied via `data-theme` attribute on `<html>` element:
```css
:root {
  --color-bg: #ffffff;
  --color-text: #0f172a;
}

:root[data-theme="dark"] {
  --color-bg: #2a1206;
  --color-text: #fff7ed;
}
```

#### Storage Key
`sahumario_theme` - persists theme preference across sessions

---

### 3. OrdersContext (`src/context/OrdersContext.js`)

Manages order history with localStorage persistence.

#### Features
- Store completed orders
- Automatic localStorage synchronization
- Orders sorted by newest first

#### API

```javascript
const {
  orders,     // Array of order objects
  addOrder    // (orderData) => void
} = useOrders();
```

#### Order Structure
```javascript
{
  id: string,           // Unique order identifier
  items: Array,         // Cart items at time of purchase
  subtotal: number,     // Order subtotal
  total: number,        // Order total (including tax)
  address: object,      // Shipping address
  payment: object,      // Payment information
  createdAt: string     // ISO timestamp
}
```

#### Usage Example
```javascript
import { useOrders } from '../context/OrdersContext';
import { useCart } from '../context/cartContext';

function CheckoutPage() {
  const { items, subtotal, total, clearCart } = useCart();
  const { addOrder } = useOrders();

  const completeOrder = () => {
    const order = {
      id: generateOrderId(),
      items,
      subtotal,
      total,
      address: formData,
      payment: { method: 'razorpay' },
      createdAt: new Date().toISOString()
    };

    addOrder(order);
    clearCart();
  };

  return <button onClick={completeOrder}>Complete Order</button>;
}
```

#### Storage Key
`sahumario_orders` - persists order history across sessions

---

## Provider Hierarchy

Contexts are nested in `src/index.js`:

```javascript
<ThemeProvider>
  <OrdersProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </OrdersProvider>
</ThemeProvider>
```

This order ensures:
1. Theme is available first (visual)
2. Orders are independent of cart
3. Cart is innermost (most frequently accessed)

---

## Best Practices

### 1. Always Use Hooks
Never access context directly. Always use provided hooks:
```javascript
// ✅ Correct
const { items } = useCart();

// ❌ Wrong
const cartContext = useContext(CartCtx);
```

### 2. Error Boundaries
Consider wrapping context consumers in error boundaries:
```javascript
<ErrorBoundary fallback={<CartError />}>
  <CartDrawer />
</ErrorBoundary>
```

### 3. Memoization
All context values are memoized to prevent unnecessary re-renders:
- `useCallback` for functions
- `useMemo` for computed values

### 4. Validation
All context operations validate input data:
```javascript
// Product validation in addToCart
if (!product || !product.id || typeof product.price !== 'number') {
  console.error('Invalid product data:', product);
  return;
}
```

### 5. localStorage Safety
All localStorage operations are wrapped in try-catch:
```javascript
try {
  localStorage.setItem(key, value);
} catch {
  // Fail silently - works in restricted environments
}
```

---

## Testing Considerations

### Unit Testing
Mock context providers in tests:
```javascript
import { CartProvider } from '../context/cartContext';

const wrapper = ({ children }) => (
  <CartProvider>{children}</CartProvider>
);

test('adds item to cart', () => {
  const { result } = renderHook(() => useCart(), { wrapper });
  act(() => {
    result.current.addToCart(mockProduct);
  });
  expect(result.current.items).toHaveLength(1);
});
```

### Integration Testing
Test full context hierarchy:
```javascript
render(
  <ThemeProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </ThemeProvider>
);
```

---

## Performance Optimization

### 1. Memo Wrapping
Components consuming context should use `React.memo`:
```javascript
const CartDrawer = React.memo(({ open, onClose }) => {
  const { items } = useCart();
  // ...
});
```

### 2. Selective Subscriptions
Only destructure values you need:
```javascript
// ✅ Good - only subscribes to count
const { count } = useCart();

// ❌ Avoid - subscribes to all cart changes
const cart = useCart();
```

### 3. Computation Location
Heavy computations are done in context (memoized):
- Subtotal calculation
- Tax calculation
- Item count

This prevents recalculation in every consuming component.

---

## Troubleshooting

### Cart Items Not Persisting
1. Check localStorage is enabled in browser
2. Check for console errors
3. Verify `CART_STORAGE_KEY` is correct
4. Check for localStorage quota exceeded

### Theme Not Applying
1. Verify `data-theme` attribute on `<html>`
2. Check CSS custom properties are defined
3. Verify ThemeProvider wraps entire app
4. Check for CSS specificity issues

### Orders Not Saving
1. Check order object structure
2. Verify `addOrder` is called after payment
3. Check localStorage quota
4. Verify order has unique ID

---

## Future Enhancements

### Potential Improvements
1. **Cart Sync Across Tabs**
   - Use `storage` event listener
   - Sync cart changes across browser tabs

2. **Undo/Redo for Cart**
   - Implement history stack
   - Allow undoing cart operations

3. **Cart Item Limits**
   - Maximum quantity per item
   - Maximum total items in cart

4. **Order Search/Filter**
   - Filter orders by date range
   - Search by order ID or items

5. **Wishlist Context**
   - Separate wishlist state
   - Move items between cart and wishlist

6. **Analytics Integration**
   - Track cart events
   - Monitor cart abandonment

---

## Migration Notes

### From Class Components
If migrating from class-based state management:

**Before (Class):**
```javascript
class Cart extends Component {
  state = { items: [] };

  addToCart = (product) => {
    this.setState({ items: [...this.state.items, product] });
  }
}
```

**After (Context):**
```javascript
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const addToCart = useCallback((product) => {
    setItems(prev => [...prev, product]);
  }, []);
  // ...
}
```

### From Redux
If migrating from Redux:

| Redux | Context API |
|-------|-------------|
| `mapStateToProps` | `useCart()` hook |
| `mapDispatchToProps` | Functions from hook |
| Actions | Direct function calls |
| Reducers | `useState` + callbacks |
| Store | Provider component |

---

**Last Updated**: 2026-02-08
**Maintained By**: Development Team

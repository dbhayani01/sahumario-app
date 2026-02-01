# Performance & Architecture Best Practices

## Quick Reference

### Component Checklist ✓
- [ ] Wrapped with `React.memo` if receiving props
- [ ] Event handlers use `useCallback`
- [ ] Heavy calculations use `useMemo`
- [ ] Images use `loading="lazy"`
- [ ] Props are optimized (avoid inline objects/arrays)
- [ ] Component has displayName for debugging
- [ ] PropTypes or TypeScript types defined (future)

### Performance Tips

#### 1. Avoid Inline Functions in Props
```javascript
// ❌ BAD - Creates new function on every render
<ProductCard onClick={() => handleClick(id)} />

// ✅ GOOD - Use useCallback
const handleCardClick = useCallback((id) => {
  handleClick(id);
}, []);
<ProductCard onClick={() => handleCardClick(id)} />
```

#### 2. Use useMemo for Computed Values
```javascript
// ❌ BAD - Recalculates on every render
const products = items.map(item => ({...item, qty: 0}));

// ✅ GOOD - Only recalculates when items changes
const products = useMemo(() => 
  items.map(item => ({...item, qty: 0})),
  [items]
);
```

#### 3. Memoize Components
```javascript
// ❌ BAD - Re-renders when parent re-renders
function MyComponent({ data }) {
  return <div>{data}</div>;
}

// ✅ GOOD - Only re-renders when data changes
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});
```

#### 4. Lazy Load Images
```javascript
// ✅ GOOD - Non-blocking image load
<img src="..." loading="lazy" decoding="async" />
```

---

## Component Organization

### UI Library Components
Located in `src/components/ui/` - Use for all forms and basic UI:
```javascript
import { Button, Input, Select, Card, Textarea } from '../components/ui';
```

### Feature Components
Located in `src/components/` - Use for specific features:
- CartSummary - Order summary display
- CartDrawer - Shopping cart sidebar
- ShippingForm - Checkout form
- ProductDetailModal - Product detail view
- ProductGrid - Product display grid

### Page Components
Located in `src/pages/` - Combine feature components:
- PerfumesPage - Product browsing
- CheckoutPage - Order checkout
- AboutPage - Company information

---

## State Management

### Cart State (Context)
- Location: `src/context/cartContext.js`
- Hook: `useCart()`
- Methods: addToCart, updateQty, removeItem, clearCart

### Auth State (Context)
- Location: `src/context/AuthContext.jsx`
- Use as needed for authentication

### Orders State (Context)
- Location: `src/context/OrdersContext.js`
- Use for order management

---

## Adding New Features

### Example: Add Filter to Products

1. **Create Filter Component** (`src/components/ProductFilter.jsx`)
```javascript
const ProductFilter = React.memo(({ onFilter, categories }) => {
  const handleFilterChange = useCallback((category) => {
    onFilter(category);
  }, [onFilter]);

  return (
    <div className="flex gap-2">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => handleFilterChange(cat)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          {cat}
        </button>
      ))}
    </div>
  );
});
ProductFilter.displayName = 'ProductFilter';
export default ProductFilter;
```

2. **Update PerfumesPage**
```javascript
const [filter, setFilter] = useState('all');

const filteredProducts = useMemo(() => {
  return products.filter(p => 
    filter === 'all' || p.category === filter
  );
}, [products, filter]);

return (
  <>
    <ProductFilter onFilter={setFilter} categories={['all', 'men', 'women']} />
    <ProductGrid products={filteredProducts} ... />
  </>
);
```

---

## Testing Checklist

### Unit Tests
- [ ] UI components render with props
- [ ] Button variants apply correct styles
- [ ] Form validation works
- [ ] Cart operations (add, update, remove)

### Integration Tests
- [ ] Product page loads and displays items
- [ ] Cart operations reflect on UI
- [ ] Checkout form submission

### E2E Tests
- [ ] Add product to cart
- [ ] Complete checkout
- [ ] Navigation between pages

---

## Deployment Checklist

Before deploying:
- [ ] Run `npm run build`
- [ ] Check bundle size (use `npm install --save-dev webpack-bundle-analyzer`)
- [ ] Test on mobile devices
- [ ] Test cart operations
- [ ] Test WhatsApp integration
- [ ] Check images load properly
- [ ] Verify responsive design

---

## Common Issues & Solutions

### Issue: Component Re-renders Unnecessarily
**Solution:** Check if parent's props changed, add React.memo

### Issue: Image Loading Blocks Page
**Solution:** Add `loading="lazy"` and `decoding="async"`

### Issue: Form Validation Doesn't Show Errors
**Solution:** Check error state is passed and displayed

### Issue: Cart Doesn't Update
**Solution:** Ensure useCart() hook is called, check context provider in App.js

### Issue: Mobile Menu Doesn't Close
**Solution:** Call setIsMenuOpen(false) when navigating

---

## Useful Commands

```bash
# Run development server
npm start

# Build for production
npm build

# Run tests
npm test

# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer
# Then add script and run

# Check for unused dependencies
npm ls --depth=0
```

---

## Performance Monitoring

### Chrome DevTools
1. Open DevTools → Performance tab
2. Record interactions
3. Look for long tasks and re-renders
4. Use React DevTools Profiler for component render times

### Lighthouse
1. Open DevTools → Lighthouse tab
2. Run Audit
3. Check for performance issues
4. Fix and re-audit

---

## Code Style Guide

### Naming Conventions
- Components: PascalCase (`ProductCard.jsx`)
- Functions: camelCase (`handleClick`, `fetchData`)
- Constants: UPPER_SNAKE_CASE (`TAX_RATE`, `MAX_ITEMS`)
- Private functions: `_functionName` or within module

### Formatting
- Use 2-space indentation
- Max line length: 100 characters
- Consistent spacing around operators
- Comments for complex logic only

### Structure
```javascript
// Imports
import React, { useState, useCallback } from 'react';
import SomeComponent from './SomeComponent';

// Component
const MyComponent = React.memo(({ prop1, prop2 }) => {
  // State
  const [state, setState] = useState(null);
  
  // Callbacks
  const handleClick = useCallback(() => {
    setState(true);
  }, []);
  
  // Effects
  useEffect(() => {
    // ...
  }, []);
  
  // Render
  return <div>{/* JSX */}</div>;
});

// Display name for debugging
MyComponent.displayName = 'MyComponent';

export default MyComponent;
```

---

## Security Considerations

- ✅ Don't store sensitive data in localStorage
- ✅ Validate all user inputs
- ✅ Sanitize data before displaying
- ✅ Use environment variables for API keys
- ✅ Escape special characters in output

---

## Accessibility Standards

- ✅ Use semantic HTML (button, nav, main, etc.)
- ✅ Add ARIA labels for interactive elements
- ✅ Ensure keyboard navigation works
- ✅ Maintain color contrast ratios
- ✅ Use alt text for images
- ✅ Test with screen readers

---

## Documentation

### For New Components
```javascript
/**
 * ProductCard - Displays a single product
 * 
 * @component
 * @example
 * const props = {
 *   product: { id: 1, name: 'Perfume', price: 500 },
 *   onSelect: () => {},
 * }
 * return <ProductCard {...props} />
 * 
 * @param {Object} product - Product data
 * @param {Function} onSelect - Callback when product selected
 */
```

---

**Last Updated:** February 2025
**Version:** 1.0

# Quick Start Guide - Using Refactored Components

## 🚀 Getting Started

### Installation
No new dependencies needed! All refactoring uses existing React libraries.

```bash
cd sahumario-app
npm install  # Already done - no changes to package.json
npm start
```

---

## 📦 Import Patterns

### UI Components
```javascript
// Option 1: Import specific components
import { Button, Input, Card } from '../components/ui';

// Option 2: Import individually
import Button from '../components/ui/Button';
```

### Feature Components
```javascript
import CartSummary from '../components/CartSummary';
import ProductGrid from '../components/ProductGrid';
import ShippingForm from '../components/ShippingForm';
import ProductDetailModal from '../components/ProductDetailModal';
import SectionHeader from '../components/SectionHeader';
```

### Optimized Components
```javascript
import NavbarOptimized from '../components/NavbarOptimized';
import PerfumeCardOptimized from '../components/PerfumeCardOptimized';
```

---

## 🎨 UI Component Examples

### Button Component
```javascript
// Primary button (default)
<Button onClick={handleClick}>
  Add to Cart
</Button>

// Variants
<Button variant="secondary">Cancel</Button>
<Button variant="success">Confirm</Button>
<Button variant="danger">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// With states
<Button disabled>Disabled</Button>
<Button className="w-full">Full Width</Button>
```

### Input Component
```javascript
// Basic input
<Input 
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Your name"
/>

// With label and validation
<Input
  label="Email"
  type="email"
  required
  error={emailError}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Select Component
```javascript
<Select
  label="State"
  value={state}
  onChange={(e) => setState(e.target.value)}
  options={[
    { value: 'MH', label: 'Maharashtra' },
    { value: 'GJ', label: 'Gujarat' },
    { value: 'KA', label: 'Karnataka' },
  ]}
/>
```

### Card Component
```javascript
<Card className="p-6">
  <h3 className="font-semibold">Order Summary</h3>
  <p className="text-gray-600">Total: ₹5000</p>
</Card>
```

---

## 🛒 Feature Component Examples

### CartSummary
```javascript
import CartSummary from '../components/CartSummary';
import { useCart } from '../context/cartContext';

export default function MyCheckout() {
  const { items, subtotal } = useCart();
  
  return (
    <CartSummary
      items={items}
      subtotal={subtotal}
      onCheckout={() => console.log('Checkout')}
      onContinueShopping={() => navigate('/products')}
      loading={false}
    />
  );
}
```

### ProductGrid
```javascript
import ProductGrid from '../components/ProductGrid';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  
  return (
    <ProductGrid
      products={products}
      onSelectProduct={(product) => setSelectedProduct(product)}
      onAddToCart={(product) => addToCart(product)}
      onUpdateQty={(id, qty) => updateQty(id, qty)}
    />
  );
}
```

### ShippingForm
```javascript
import ShippingForm from '../components/ShippingForm';

export default function Checkout() {
  const [formData, setFormData] = useState({});
  
  return (
    <ShippingForm
      onFormChange={setFormData}
      initialValues={formData}
    />
  );
}
```

### ProductDetailModal
```javascript
import ProductDetailModal from '../components/ProductDetailModal';

export default function ProductPage() {
  const [selected, setSelected] = useState(null);
  
  return (
    <>
      {selected && (
        <ProductDetailModal
          product={selected}
          quantity={selected.qty || 0}
          onClose={() => setSelected(null)}
          onAdd={() => addToCart(selected)}
          onUpdateQty={(id, qty) => updateQty(id, qty)}
        />
      )}
    </>
  );
}
```

---

## 🎯 Common Tasks

### Add a New Page
```javascript
// 1. Create page component
// src/pages/MyNewPage.jsx
import { Card } from '../components/ui';
import SectionHeader from '../components/SectionHeader';

export default function MyNewPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader 
        title="My New Page"
        subtitle="Description here"
      />
      <Card>
        {/* Page content */}
      </Card>
    </section>
  );
}

// 2. Add to App.js routing
import MyNewPage from './pages/MyNewPage';

// In App component:
{currentPage === "mynewpage" && <MyNewPage />}

// 3. Add navigation link
<NavLink id="mynewpage" onClick={handleNavClick}>
  My New Page
</NavLink>
```

### Create a New Form
```javascript
// Option 1: Use UI components
import { Input, Select, Textarea, Button } from '../components/ui';

export default function MyForm() {
  const [form, setForm] = useState({});
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // Submit
    }}>
      <Input
        label="Name"
        required
        value={form.name || ''}
        onChange={(e) => setForm({...form, name: e.target.value})}
      />
      <Textarea
        label="Message"
        value={form.message || ''}
        onChange={(e) => setForm({...form, message: e.target.value})}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}

// Option 2: Extend ShippingForm pattern
// Create component that manages validation internally
```

### Add Product Filtering
```javascript
import ProductGrid from '../components/ProductGrid';
import SectionHeader from '../components/SectionHeader';
import { useMemo, useState, useCallback } from 'react';

export default function PerfumesPage() {
  const [filter, setFilter] = useState('all');
  const [products, setProducts] = useState([]);
  
  const filteredProducts = useMemo(() => {
    if (filter === 'all') return products;
    return products.filter(p => p.category === filter);
  }, [products, filter]);
  
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader title="Products" />
      
      <div className="flex gap-2 my-6">
        {['all', 'men', 'women'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded ${
              filter === cat ? 'bg-amber-600 text-white' : 'border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <ProductGrid products={filteredProducts} />
    </section>
  );
}
```

---

## 🔍 Debugging Tips

### Check Component Re-renders
```javascript
// Add this in a component to see when it renders
useEffect(() => {
  console.log('ComponentName rendered');
}, []);
```

### Use React DevTools
1. Install React DevTools browser extension
2. Open DevTools → Components tab
3. See component hierarchy
4. Check props and state
5. Use Profiler to measure render times

### Check Props
```javascript
// Log all props to verify they're passed correctly
console.log('Props:', { prop1, prop2, prop3 });
```

### Verify Memoization
```javascript
// If component is memoized but still re-renders, 
// it means props changed. Check parent component.
const MyComponent = React.memo(({ data }) => {
  console.log('Rendering MyComponent');
  return <div>{data}</div>;
});
```

---

## 🚨 Common Issues

### Issue: Form doesn't validate
**Solution:** Check error state in ShippingForm is being passed and displayed
```javascript
// Make sure you're checking form.isValid or passing error states
const isValid = !Object.keys(errors).length;
```

### Issue: Images don't load
**Solution:** Check image paths and add placeholder
```javascript
// Make sure images exist in public/products/ folder
// Placeholder at: public/products/placeholder.jpg
```

### Issue: Button doesn't work
**Solution:** Check onClick handler is passed
```javascript
// Make sure handler is passed as prop
<Button onClick={handleClick}>Click</Button>

// Or use as default action
<Button type="submit">Submit</Button>
```

### Issue: Cart doesn't update
**Solution:** Verify useCart hook is imported
```javascript
import { useCart } from '../context/cartContext';
const { items, addToCart } = useCart();
```

---

## 📚 File Locations Reference

| What | Where |
|------|-------|
| UI Components | `src/components/ui/` |
| Feature Components | `src/components/` |
| Pages | `src/pages/` |
| Context (State) | `src/context/` |
| Utilities | `src/utils/` |
| Constants | `src/constants/` |
| Styles | `src/` (Tailwind) |
| Images | `public/` |
| Products Data | `src/data/` |

---

## 🔗 Dependencies

All components use existing dependencies:
- **React 19.2.0** - Core framework
- **Tailwind CSS 3.4.18** - Styling
- **lucide-react 0.548.0** - Icons
- **PostCSS** - CSS processing

No new packages needed!

---

## 💾 Saving Your Work

```bash
# Check what changed
git status

# Stage changes
git add .

# Commit
git commit -m "Refactored with new components"

# Push
git push origin main
```

---

## 🎓 Next Learning Steps

1. Read REFACTORING_GUIDE.md for detailed component info
2. Read BEST_PRACTICES.md for coding patterns
3. Explore component files to understand structure
4. Experiment with UI components in a new page
5. Monitor performance with Chrome DevTools

---

## 🆘 Need Help?

1. Check REFACTORING_GUIDE.md - Component details
2. Check BEST_PRACTICES.md - Patterns and examples
3. Look at existing pages for examples
4. React documentation: https://react.dev
5. Tailwind CSS docs: https://tailwindcss.com

---

**Last Updated:** February 2025
**Status:** ✅ Ready to Use

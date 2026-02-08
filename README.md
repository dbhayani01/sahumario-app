# Sahumario Perfume E-Commerce

> Authentic oil-based perfumes crafted with natural ingredients. A modern, responsive e-commerce platform built with React.

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.18-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Guide](#development-guide)
- [Documentation](#documentation)
- [Deployment](#deployment)

---

## Overview

Sahumario is a modern e-commerce platform specializing in authentic oil-based perfumes. The application provides a seamless shopping experience with a focus on performance, accessibility, and user experience.

### Key Highlights

- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Accessible**: WCAG-compliant with keyboard navigation and screen reader support
- **Fast**: Optimized components with lazy loading and memoization
- **SEO-Ready**: Meta tags, Open Graph, structured data, and sitemap
- **Theme Support**: Light and dark mode with localStorage persistence

---

## Features

### Shopping Experience
- Browse curated collection of oil-based perfumes
- Product detail modals with high-quality images
- Real-time cart management with quantity controls
- Persistent cart across sessions (localStorage)
- Responsive product grid layout

### Checkout & Payment
- Premium checkout UI with step indicator
- Multi-state interface (loading, error, success)
- Form validation with helpful error messages
- Razorpay payment gateway integration
- Trust badges and security indicators
- Order confirmation and history
- Shipping address management

### Admin Panel
- Product management interface
- Add new products with form validation
- Automatic ID generation
- Direct GitHub repository commits
- Real-time product preview
- Visual feedback for all operations

### UI/UX
- Clean, minimal Slack-inspired design
- Smooth animations and transitions
- Mobile-first responsive layout
- Keyboard navigation support
- Skip-to-content link for accessibility

### Technical
- Context API for state management
- localStorage persistence for cart, orders, and theme
- Memoized components for performance
- Error boundaries for stability
- Comprehensive form validation

---

## Tech Stack

### Core
- **React** 19.2.0 - UI library
- **Create React App** 5.0.1 - Build tooling
- **TailwindCSS** 3.4.18 - Utility-first CSS

### State Management
- **React Context API** - Global state
- **localStorage** - Data persistence

### Icons & UI
- **lucide-react** 0.548.0 - Icon library
- Custom UI components (Button, Input, Card, etc.)

### Payment
- **Razorpay** - Payment gateway integration

### Development
- **PostCSS** 8.5.6 - CSS processing
- **Autoprefixer** 10.4.21 - CSS vendor prefixes

---

## Getting Started

### Prerequisites

- **Node.js** 14+ and npm
- **Git** for version control
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/sahumario.git
   cd sahumario
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Payment Integration
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_here

   # Admin Panel (Optional)
   REACT_APP_GITHUB_TOKEN=your_github_token
   REACT_APP_GITHUB_OWNER=your_github_username
   REACT_APP_GITHUB_REPO=your_repo_name
   REACT_APP_GITHUB_BRANCH=main
   ```

   📖 **See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed configuration instructions**

4. **Start development server**
   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs development server on port 3000 |
| `npm run build` | Creates optimized production build |
| `npm test` | Launches test runner (when tests added) |

---

## Project Structure

```
sahumario/
├── public/
│   ├── index.html          # HTML template
│   ├── sitemap.xml         # SEO sitemap
│   ├── robots.txt          # Search engine rules
│   ├── logo.png            # Brand logo
│   └── products/           # Product images
│       ├── bloom.jpg
│       ├── dew_drop.jpg
│       └── ...
├── src/
│   ├── components/         # Reusable components
│   │   ├── ui/             # Base UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   └── ...
│   │   ├── CartDrawer.jsx
│   │   ├── Hero.jsx
│   │   ├── NavbarOptimized.jsx
│   │   └── ...
│   ├── context/            # State management
│   │   ├── cartContext.js  # Shopping cart state
│   │   ├── ThemeContext.js # Theme state
│   │   └── OrdersContext.js# Order history
│   ├── pages/              # Page components
│   │   ├── PerfumesPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── AboutPage.jsx
│   │   └── OrdersPage.jsx
│   ├── data/
│   │   └── products.json   # Product catalog
│   ├── utils/
│   │   └── money.js        # Currency formatting
│   ├── constants/
│   │   └── checkout.js     # Checkout constants
│   ├── App.js              # Main app component
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── SEO_GUIDE.md            # SEO documentation
├── STATE_MANAGEMENT.md     # State management guide
├── QUICK_START.md          # Quick start guide
├── package.json            # Dependencies
└── README.md               # This file
```

### Key Directories

- **`/components`**: Reusable UI components with memoization
- **`/pages`**: Top-level page components
- **`/context`**: Context providers for global state
- **`/utils`**: Utility functions (formatting, validation)
- **`/data`**: Static data files (products catalog)

---

## Development Guide

### Component Guidelines

1. **Use Functional Components**
   ```javascript
   function MyComponent() {
     return <div>Hello</div>;
   }
   ```

2. **Memoize Performance-Critical Components**
   ```javascript
   const MyComponent = React.memo(({ data }) => {
     return <div>{data}</div>;
   });
   ```

3. **Use Context Hooks**
   ```javascript
   import { useCart } from '../context/cartContext';

   function Component() {
     const { items, addToCart } = useCart();
     // ...
   }
   ```

### Styling Conventions

- Use **TailwindCSS utility classes**
- Use **CSS custom properties** for theming (`var(--color-bg)`)
- Keep responsive with **mobile-first** approach
- Use **semantic HTML** (nav, main, article, etc.)

### State Management

See [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md) for detailed documentation.

Quick example:
```javascript
import { useCart } from './context/cartContext';

function AddToCartButton({ product }) {
  const { addToCart } = useCart();

  return (
    <button onClick={() => addToCart(product)}>
      Add to Cart
    </button>
  );
}
```

### Adding New Products

Edit `src/data/products.json`:
```json
{
  "id": 6,
  "name": "New Perfume",
  "description": "Description here",
  "price": 749,
  "image": "/products/new_perfume.jpg",
  "alt": "Descriptive alt text"
}
```

### Code Style

- **Prettier/ESLint**: Follow existing code style
- **Naming**: camelCase for variables, PascalCase for components
- **Comments**: Explain "why", not "what"
- **Keep it simple**: Prefer readability over cleverness

---

## Documentation

| Document | Description |
|----------|-------------|
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | **Complete setup guide for payment & admin** |
| [ADMIN_GUIDE.md](ADMIN_GUIDE.md) | Admin panel user manual and API reference |
| [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md) | Context API usage, best practices |
| [SEO_GUIDE.md](SEO_GUIDE.md) | SEO implementation and optimization |
| [QUICK_START.md](QUICK_START.md) | Quick reference guide |

---

## Deployment

### Production Build

```bash
npm run build
```

Creates optimized production build in `build/` folder.

### Deployment Platforms

The app can be deployed to:
- **Vercel**: Zero-config deployment for React apps
- **Netlify**: Continuous deployment from Git
- **AWS S3 + CloudFront**: Static hosting with CDN
- **GitHub Pages**: Free hosting for static sites

### Environment Variables

Set these in your deployment platform:
- `REACT_APP_RAZORPAY_KEY_ID` - Razorpay API key

### Post-Deployment Checklist

- [ ] Test payment integration
- [ ] Verify all images load correctly
- [ ] Check mobile responsiveness
- [ ] Test theme switching
- [ ] Verify cart persistence
- [ ] Submit sitemap to Google Search Console
- [ ] Configure custom domain (if applicable)
- [ ] Set up HTTPS/SSL

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

ISC License - see LICENSE file for details

---

## Contact

- **Email**: sahumariofragnance@gmail.com
- **Phone**: +91 9974599911
- **Website**: [sahumario.com](https://sahumario.com)

---

## Acknowledgments

- React team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- Create React App for the build tooling
- Lucide for the beautiful icon set

---

## Development Progress Log

### Task 1: Project Audit (Completed)
**Date:** 2026-02-08

Conducted comprehensive audit of repository structure, dependencies, and architecture. Identified critical issues including duplicate files (App.js/App.jsx, multiple page versions), inconsistent state management, product data errors, and missing assets. Established baseline for improvement roadmap focusing on removing duplicates, fixing data quality, and consolidating architectural patterns.

### Task 2: Performance Cleanup (Completed)
**Date:** 2026-02-08

Removed 26 unused/duplicate files including App.jsx, duplicate components (Navbar, PerfumeCard), old page versions (PerfumesPage_og, PerfumesPage_works), unused authentication system (LoginPage, AuthContext, api.jsx), entire duplicate pages/ directory, 7 redundant documentation files, and CRA boilerplate (App.css, logo.svg, test files). Updated .gitignore to exclude .claude/ directory. Codebase now cleaner with single source of truth for all components.

### Task 3: Accessibility Basics (Completed)
**Date:** 2026-02-08

Enhanced accessibility across the application. Added proper form label associations (htmlFor/id) with ARIA attributes (aria-invalid, aria-describedby, aria-required, role="alert") to Input, Select, and Textarea components. Improved semantic HTML with nav element in Footer and aria-labels throughout. Added skip-to-content link for keyboard navigation. Updated meta description in index.html for better SEO. Fixed product data with unique, descriptive alt text for all perfume images. Added sr-only CSS utility for screen reader accessibility.

### Task 4: SEO Foundation (Completed)
**Date:** 2026-02-08

Implemented comprehensive SEO infrastructure. Added Open Graph and Twitter Card meta tags for social media sharing. Created JSON-LD structured data for organization schema with contact information. Generated sitemap.xml for search engine indexing. Enhanced page title and meta description. Added keyword meta tags. Created detailed SEO_GUIDE.md documenting all SEO implementations, best practices, and future enhancement recommendations including analytics setup, content strategy, and technical SEO checklist.

### Task 5: Responsive UI Refinement (Completed)
**Date:** 2026-02-08

Enhanced mobile responsiveness across all pages. Improved spacing with responsive padding/margins (py-8 sm:py-12). Made typography scale better across breakpoints (text-xl sm:text-2xl md:text-3xl). Fixed checkout page sticky sidebar to only stick on desktop. Improved ProductDetailModal with better mobile layout, click-outside-to-close, and responsive text sizes. Enhanced Hero section with responsive font sizes and padding. Improved CartDrawer width on mobile (full width to max-w-md on sm+). Added responsive gaps in grids and improved touch target sizes for better mobile UX.

### Task 6: Cart & State Stability (Completed)
**Date:** 2026-02-08

Strengthened state management reliability and documentation. Added comprehensive JSDoc comments to all context providers (CartContext, ThemeContext, OrdersContext) explaining features, APIs, and data structures. Enhanced error handling with input validation for cart operations, proper error logging, and graceful localStorage failure handling. Improved context hooks to throw descriptive errors when used outside providers. Added useCallback memoization to prevent unnecessary re-renders. Created detailed STATE_MANAGEMENT.md documentation covering all contexts, usage patterns, best practices, testing considerations, performance optimization, troubleshooting guide, and migration notes.

### Task 7: Documentation Upgrade (Completed)
**Date:** 2026-02-08

Completely rewrote README.md with professional, comprehensive documentation. Added project overview with key highlights, complete feature list, detailed tech stack breakdown, getting started guide with prerequisites and installation steps, comprehensive project structure diagram with explanations, development guide with component guidelines and code style rules, deployment checklist and platform recommendations, browser support matrix, and contribution guidelines. Organized documentation with clear table of contents, badges, and well-structured sections. Maintained existing QUICK_START.md for rapid reference. Created cohesive documentation ecosystem with cross-references between README, STATE_MANAGEMENT.md, and SEO_GUIDE.md.

## Payment Integration Progress Log

### Task 1: Checkout UI Foundation (Completed)
**Date:** 2026-02-08

Created premium checkout experience with modern UI/UX design. Implemented multi-state interface with empty cart view, error alerts (dismissible with animation), success alerts, and full-screen loading overlay with spinner. Enhanced CartSummary component with gradient accent bar, item count display, FREE shipping badge, and prominent gradient CTA button with lock icon. Added trust badges section below checkout form (Secure Payment, Verified Seller, Quality Products, Safe Checkout). Implemented smooth CSS animations (fade-in, slide-in-from-top) and custom scrollbar styling for cart items. Created step indicator and security messaging in header. Mobile-first responsive design with sticky order summary on desktop. All components include proper ARIA labels and accessibility attributes.

### Admin Page: Product Management System (Completed)
**Date:** 2026-02-08

Built comprehensive admin panel for product catalog management with GitHub integration. Features include validated form for adding products (name, description, price, image path, alt text), automatic ID generation, GitHub Contents API integration for direct repository commits, loading/success/error states with visual feedback, product preview list with images, and setup instruction card. Added Admin navigation link to navbar (desktop and mobile). Created .env.example template with GitHub configuration (REACT_APP_GITHUB_TOKEN, REACT_APP_GITHUB_OWNER, REACT_APP_GITHUB_REPO, REACT_APP_GITHUB_BRANCH). Security: Token stored in environment variables, validation on all inputs, documented production recommendation for backend API. Created comprehensive ADMIN_GUIDE.md with setup instructions, troubleshooting, API reference, and migration guide.

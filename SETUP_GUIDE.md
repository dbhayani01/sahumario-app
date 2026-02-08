# Complete Setup Guide

## Overview

This guide will walk you through setting up the Sahumario e-commerce platform with payment integration and admin functionality.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Payment Integration Setup](#payment-integration-setup)
4. [Admin Panel Setup](#admin-panel-setup)
5. [Environment Configuration](#environment-configuration)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** 14.x or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** for version control
- **GitHub account** (for admin functionality)
- **Razorpay account** (for payment processing)
- **Code editor** (VS Code recommended)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sahumario.git
cd sahumario
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- React 19.2.0
- TailwindCSS 3.4.18
- lucide-react (icons)
- Other dependencies

### 3. Verify Installation

```bash
npm start
```

The app should open at `http://localhost:3000`

---

## Payment Integration Setup

### Step 1: Create Razorpay Account

1. **Sign up for Razorpay**: https://razorpay.com/
   - Create an account
   - Complete KYC verification (required for live mode)
   - Get approved for payment processing

2. **Navigate to Dashboard**:
   - Go to https://dashboard.razorpay.com/
   - Click on "Settings" → "API Keys"

### Step 2: Get API Keys

#### For Testing (Test Mode):

1. In Razorpay Dashboard, enable **Test Mode** (toggle in top-left)
2. Go to Settings → API Keys
3. Click "Generate Test Key"
4. Copy the **Key ID** (starts with `rzp_test_`)
5. Note: Test mode doesn't process real payments

#### For Production (Live Mode):

1. Ensure account is activated and KYC completed
2. Switch to **Live Mode**
3. Go to Settings → API Keys
4. Click "Generate Live Key"
5. Copy the **Key ID** (starts with `rzp_live_`)
6. Store the **Key Secret** securely (shown only once)

### Step 3: Configure Payment Key

1. **Create `.env` file** in project root:

```bash
# Create .env file (copy from .env.example)
cp .env.example .env
```

2. **Add your Razorpay Key**:

```env
# Payment Gateway Configuration
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
```

**Important:**
- Use **test key** (`rzp_test_*`) for development
- Use **live key** (`rzp_live_*`) for production
- Never commit `.env` file to Git

### Step 4: Test Payment Integration

1. **Start the development server**:
```bash
npm start
```

2. **Test the checkout flow**:
   - Add products to cart
   - Go to checkout
   - Fill in shipping information
   - Click "Proceed to Payment"
   - Use test card details (Test Mode only):
     - **Card Number**: 4111 1111 1111 1111
     - **CVV**: Any 3 digits
     - **Expiry**: Any future date
     - **Name**: Any name

3. **Verify payment**:
   - Check Razorpay Dashboard → Payments
   - Test payments appear instantly
   - No actual money is charged in test mode

### Step 5: Payment Webhooks (Optional)

For production, set up webhooks to receive payment confirmations:

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events to track:
   - `payment.captured`
   - `payment.failed`
4. Copy the webhook secret
5. Implement webhook handler in backend

---

## Admin Panel Setup

### Step 1: Create GitHub Personal Access Token

1. **Go to GitHub Settings**:
   - Visit: https://github.com/settings/tokens
   - Or: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token**:
   - Click "Generate new token (classic)"
   - Token name: `Sahumario Admin Panel`
   - Expiration: Choose duration (90 days recommended)

3. **Select Scopes**:
   - ✅ Check `repo` (Full control of private repositories)
     - This includes:
       - repo:status
       - repo_deployment
       - public_repo
       - repo:invite
       - security_events

4. **Generate Token**:
   - Scroll down and click "Generate token"
   - **CRITICAL**: Copy the token immediately
   - Token format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - You won't be able to see it again!

5. **Save Token Securely**:
   - Store in password manager
   - Never share or commit to Git
   - Treat like a password

### Step 2: Get Repository Information

1. **Repository Owner**:
   - Your GitHub username
   - Example: If your profile is `github.com/johndoe`, owner is `johndoe`

2. **Repository Name**:
   - The name of your repository
   - Example: `sahumario` (from `github.com/johndoe/sahumario`)

3. **Branch Name**:
   - Usually `main` or `master`
   - Check in your repository's branch dropdown

### Step 3: Configure Admin Environment Variables

Add to your `.env` file:

```env
# GitHub Integration for Admin Product Management
REACT_APP_GITHUB_TOKEN=ghp_your_personal_access_token_here
REACT_APP_GITHUB_OWNER=your_github_username
REACT_APP_GITHUB_REPO=sahumario
REACT_APP_GITHUB_BRANCH=main
```

**Example Configuration**:
```env
REACT_APP_GITHUB_TOKEN=ghp_abc123xyz789example
REACT_APP_GITHUB_OWNER=johndoe
REACT_APP_GITHUB_REPO=sahumario-perfumes
REACT_APP_GITHUB_BRANCH=main
```

### Step 4: Test Admin Panel

1. **Restart development server** (required after .env changes):
```bash
# Stop server (Ctrl+C)
npm start
```

2. **Navigate to Admin Page**:
   - Click "Admin" in navigation menu
   - Or go to: `http://localhost:3000` and click Admin

3. **Add a Test Product**:
   - Fill in the form:
     - **Name**: Test Perfume
     - **Description**: This is a test product
     - **Price**: 749
     - **Image Path**: /products/bloom.jpg
     - **Alt Text**: Test perfume bottle
   - Click "Save & Commit to GitHub"

4. **Verify Success**:
   - Success message should appear
   - Product appears in "Current Products" list
   - Check your GitHub repository:
     - Go to your repo on GitHub
     - View commits (should see "Add product: Test Perfume")
     - Check `src/data/products.json` (should include new product)

5. **Verify on Frontend**:
   - Navigate to "Perfumes" page
   - New product should appear in the grid
   - (May need to refresh page)

---

## Environment Configuration

### Complete .env File Template

```env
# ============================================
# PAYMENT GATEWAY CONFIGURATION
# ============================================

# Razorpay API Key
# Get from: https://dashboard.razorpay.com/app/keys
# Test Key: rzp_test_* (for development)
# Live Key: rzp_live_* (for production)
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_here

# ============================================
# GITHUB INTEGRATION (ADMIN PANEL)
# ============================================

# GitHub Personal Access Token
# Create at: https://github.com/settings/tokens
# Required scope: repo
REACT_APP_GITHUB_TOKEN=ghp_your_token_here

# Repository Owner (GitHub username)
REACT_APP_GITHUB_OWNER=your_username

# Repository Name
REACT_APP_GITHUB_REPO=your_repo_name

# Branch Name (usually 'main' or 'master')
REACT_APP_GITHUB_BRANCH=main

# ============================================
# SECURITY NOTES
# ============================================
# 1. Never commit this file to Git
# 2. Add .env to .gitignore
# 3. Use different keys for development and production
# 4. Rotate tokens regularly (every 90 days)
# 5. For production, use environment variables in hosting platform
```

### Environment Variables by Feature

| Feature | Required Variables |
|---------|-------------------|
| **Payment Processing** | `REACT_APP_RAZORPAY_KEY_ID` |
| **Admin Panel** | All `REACT_APP_GITHUB_*` variables |

---

## Testing

### Test Payment Flow (Development)

1. **Add Products to Cart**:
   - Browse to Perfumes page
   - Click on any product
   - Click "Add to Cart"

2. **Proceed to Checkout**:
   - Click cart icon in navbar
   - Click "Checkout" in cart drawer
   - Fill in shipping information:
     - Name: Test User
     - Phone: 9999999999
     - Address: 123 Test Street
     - City: Mumbai
     - State: Maharashtra
     - PIN: 400001

3. **Complete Payment**:
   - Click "Proceed to Payment"
   - Razorpay modal opens
   - Enter test card details:
     - Card: 4111 1111 1111 1111
     - CVV: 123
     - Expiry: 12/25
     - Name: Test User
   - Click "Pay"

4. **Verify Payment**:
   - Check Razorpay Dashboard
   - Payment status should be "Captured"

### Test Admin Panel

1. **Add New Product**:
   - Go to Admin page
   - Fill in all fields
   - Click "Save & Commit to GitHub"
   - Wait for success message

2. **Verify in GitHub**:
   - Open your repository
   - Check recent commits
   - View `src/data/products.json`

3. **Verify on Site**:
   - Go to Perfumes page
   - Refresh if needed
   - New product should appear

### Test Checklist

- [ ] App starts without errors
- [ ] Can browse products
- [ ] Can add to cart
- [ ] Cart persists after refresh
- [ ] Checkout form validates
- [ ] Payment modal opens
- [ ] Test payment succeeds
- [ ] Admin page loads
- [ ] Can add product
- [ ] Product commits to GitHub
- [ ] New product appears on site
- [ ] Theme toggle works
- [ ] Mobile responsive
- [ ] All images load

---

## Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Add Environment Variables in Vercel**:
   - Go to Vercel Dashboard
   - Select your project
   - Settings → Environment Variables
   - Add all variables from `.env`:
     - `REACT_APP_RAZORPAY_KEY_ID`
     - `REACT_APP_GITHUB_TOKEN`
     - `REACT_APP_GITHUB_OWNER`
     - `REACT_APP_GITHUB_REPO`
     - `REACT_APP_GITHUB_BRANCH`

5. **Redeploy** (to apply env variables):
```bash
vercel --prod
```

### Netlify Deployment

1. **Build the app**:
```bash
npm run build
```

2. **Deploy to Netlify**:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

3. **Add Environment Variables**:
   - Netlify Dashboard → Site settings → Environment variables
   - Add all variables from `.env`

### Environment Variables for Production

**Important:** Use production credentials:
- **Razorpay**: Use `rzp_live_*` key (not test key)
- **GitHub**: Use token with minimal necessary permissions
- Consider using a backend API for admin functions

---

## Troubleshooting

### Payment Integration Issues

#### Issue: "Razorpay key is not configured"

**Solution:**
1. Check `.env` file exists in project root
2. Verify `REACT_APP_RAZORPAY_KEY_ID` is set
3. Restart development server
4. Clear browser cache

#### Issue: Payment modal doesn't open

**Solution:**
1. Check browser console for errors
2. Verify Razorpay SDK loaded (check Network tab)
3. Check if popup blockers are disabled
4. Try different browser

#### Issue: Test payment fails

**Solution:**
1. Ensure using test mode key (`rzp_test_*`)
2. Use correct test card: 4111 1111 1111 1111
3. Check Razorpay Dashboard for error details
4. Verify account status in Razorpay

### Admin Panel Issues

#### Issue: "GitHub configuration missing"

**Solution:**
1. Check all GitHub environment variables are set:
   - `REACT_APP_GITHUB_TOKEN`
   - `REACT_APP_GITHUB_OWNER`
   - `REACT_APP_GITHUB_REPO`
   - `REACT_APP_GITHUB_BRANCH`
2. Restart development server
3. Verify no typos in variable names

#### Issue: "Failed to commit to GitHub"

**Solution:**
1. **Check token validity**:
   - Go to https://github.com/settings/tokens
   - Verify token hasn't expired
   - Regenerate if needed

2. **Check token permissions**:
   - Token must have `repo` scope
   - Regenerate with correct permissions

3. **Check repository details**:
   - Verify owner and repo names are correct
   - Check you have write access to repository
   - Ensure branch exists

4. **Network issues**:
   - Check internet connection
   - Check if GitHub is accessible
   - Check browser console for detailed error

#### Issue: Product added but doesn't appear

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Check if commit was successful in GitHub
3. Verify products.json was updated in repository
4. Check browser console for loading errors
5. Pull latest changes from GitHub

### Common Setup Errors

#### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

#### Issue: Environment variables not working

**Solution:**
1. Verify `.env` file is in project root (not in src/)
2. Variable names must start with `REACT_APP_`
3. No quotes around values
4. No spaces around `=`
5. Restart development server after changes

---

## Security Best Practices

### Development

1. **Never commit sensitive data**:
   - Add `.env` to `.gitignore`
   - Use `.env.example` for templates
   - Never commit API keys or tokens

2. **Use test credentials**:
   - Use Razorpay test keys in development
   - Use GitHub tokens with minimal permissions
   - Rotate tokens regularly

3. **Secure local environment**:
   - Don't share `.env` file
   - Use strong passwords
   - Enable 2FA on GitHub and Razorpay

### Production

1. **Use environment variables**:
   - Store secrets in hosting platform (Vercel/Netlify)
   - Never expose in client-side code
   - Use backend API for sensitive operations

2. **Implement proper authentication**:
   - Add admin login system
   - Use JWT tokens
   - Implement role-based access

3. **Monitor and audit**:
   - Enable logging
   - Monitor API usage
   - Review commit history
   - Set up alerts for unusual activity

---

## Next Steps

After completing setup:

1. **Customize Design**: Update colors, fonts, and branding
2. **Add Products**: Use admin panel to populate catalog
3. **Upload Images**: Add product photos to `/public/products/`
4. **Configure Backend**: Set up backend API for production
5. **Test Thoroughly**: Test all features before going live
6. **Deploy**: Deploy to production hosting
7. **Monitor**: Set up analytics and error tracking

---

## Additional Resources

### Documentation

- [Razorpay Integration Guide](https://razorpay.com/docs/payments/payment-gateway/web-integration/)
- [GitHub API Documentation](https://docs.github.com/en/rest/repos/contents)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)

### Support

- **Razorpay Support**: https://razorpay.com/support/
- **GitHub Support**: https://support.github.com/
- **Project Issues**: Check repository issues page

### Security

- **Razorpay Security**: https://razorpay.com/security/
- **GitHub Security**: https://github.com/security
- **Best Practices**: Read ADMIN_GUIDE.md

---

## FAQ

### Q: Can I use other payment gateways?

A: Yes, but you'll need to modify the checkout integration. Razorpay is currently implemented. To add Stripe, PayPal, etc., update `CheckoutPage.jsx`.

### Q: Do I need a backend for the admin panel?

A: For development, no. For production, yes. Current implementation uses frontend GitHub integration, which is not secure for production. See ADMIN_GUIDE.md for backend migration guide.

### Q: How do I backup my products?

A: Products are stored in `src/data/products.json` and committed to GitHub. Your Git history serves as backup. Regularly pull from GitHub or export products.json.

### Q: Can multiple admins use the panel?

A: Currently, anyone with the GitHub token can commit. For multi-admin support, implement backend API with individual user authentication.

### Q: How do I update product prices?

A: Currently, you need to manually edit `products.json`. Future enhancement: add edit functionality to admin panel.

### Q: Is this production-ready?

A: The frontend is production-ready. For production payments and admin, implement backend API. See security considerations in ADMIN_GUIDE.md.

---

**Last Updated**: 2026-02-08
**Version**: 1.0.0
**Status**: ✅ Complete Setup Guide

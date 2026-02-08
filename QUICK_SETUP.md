# 🚀 Quick Setup (5 Minutes)

Get your Sahumario store running with payment and admin features in minutes!

---

## ⚡ Fast Track Setup

### 1️⃣ Install & Run (2 min)

```bash
# Clone and install
git clone https://github.com/your-username/sahumario.git
cd sahumario
npm install

# Start development server
npm start
```

App opens at `http://localhost:3000` ✅

---

### 2️⃣ Payment Setup (2 min)

#### Get Razorpay Test Key:

1. Sign up: https://razorpay.com/
2. Go to Dashboard → Settings → API Keys
3. Enable **Test Mode** (toggle top-left)
4. Click "Generate Test Key"
5. Copy the **Key ID** (starts with `rzp_test_`)

#### Add to .env:

```bash
# Create .env file
cp .env.example .env

# Add your key
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
```

#### Restart server:
```bash
# Stop (Ctrl+C) and restart
npm start
```

**Test Payment:**
- Add product to cart
- Checkout → Fill form → Pay Now
- Use test card: `4111 1111 1111 1111`
- CVV: `123`, Expiry: `12/25`

✅ Payment working!

---

### 3️⃣ Admin Panel Setup (1 min)

#### Get GitHub Token:

1. Visit: https://github.com/settings/tokens
2. "Generate new token (classic)"
3. Name: `Sahumario Admin`
4. Check: ✅ **repo** scope
5. Generate → **Copy token** (shown once!)

#### Add to .env:

```env
REACT_APP_GITHUB_TOKEN=ghp_your_token_here
REACT_APP_GITHUB_OWNER=your_username
REACT_APP_GITHUB_REPO=sahumario
REACT_APP_GITHUB_BRANCH=main
```

#### Restart server & test:
```bash
npm start
```

- Click **Admin** in navbar
- Fill form → Click "Save & Commit to GitHub"
- Check your GitHub repo for new commit

✅ Admin working!

---

## 📋 Complete .env Template

```env
# Payment (Required)
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key

# Admin Panel (Optional)
REACT_APP_GITHUB_TOKEN=ghp_your_token
REACT_APP_GITHUB_OWNER=your_username
REACT_APP_GITHUB_REPO=sahumario
REACT_APP_GITHUB_BRANCH=main
```

---

## 🎯 What You Can Do Now

### ✅ Customer Features:
- Browse perfumes
- Add to cart (persists on refresh)
- Checkout with shipping form
- Test payment with Razorpay

### ✅ Admin Features:
- Add new products
- Auto-commit to GitHub
- View product list
- Auto-generate product IDs

---

## 🔒 Security Checklist

- [ ] Created `.env` file
- [ ] Never commit `.env` to Git
- [ ] Added `.env` to `.gitignore`
- [ ] Using test keys (not live keys)
- [ ] Stored GitHub token securely

---

## 🆘 Quick Troubleshooting

### Payment not working?
```bash
# 1. Check .env file exists
ls -la .env

# 2. Restart server
npm start

# 3. Check browser console for errors
```

### Admin not saving?
```bash
# 1. Verify GitHub token hasn't expired
# Visit: https://github.com/settings/tokens

# 2. Check token has 'repo' scope

# 3. Verify repo name and owner are correct
```

### App not starting?
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## 📚 Need More Help?

| For | Read |
|-----|------|
| **Detailed setup** | [SETUP_GUIDE.md](SETUP_GUIDE.md) (655 lines) |
| **Admin features** | [ADMIN_GUIDE.md](ADMIN_GUIDE.md) (358 lines) |
| **State management** | [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md) |
| **Quick reference** | [QUICK_START.md](QUICK_START.md) |

---

## 🚀 Next Steps

1. **Customize Products**: Use admin panel to add your perfumes
2. **Upload Images**: Add photos to `/public/products/`
3. **Test Everything**: Try full checkout flow
4. **Deploy**: Use Vercel or Netlify (see [SETUP_GUIDE.md](SETUP_GUIDE.md))
5. **Go Live**: Switch to live Razorpay keys

---

## 🎉 You're Ready!

Your store is now running with:
- ✅ Payment processing (Razorpay)
- ✅ Admin panel (GitHub integration)
- ✅ Cart management (localStorage)
- ✅ Responsive design
- ✅ Dark mode support

**Happy selling! 🛍️**

---

**Setup Time**: ~5 minutes
**Version**: 1.0.0
**Last Updated**: 2026-02-08

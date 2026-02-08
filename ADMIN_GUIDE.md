# Admin Panel Guide

## Overview

The Admin Panel allows authorized users to manage the product catalog and automatically commit changes to the GitHub repository.

## Features

- **Add New Products**: Form-based product creation
- **Auto ID Generation**: Automatically generates unique product IDs
- **GitHub Integration**: Direct commits to repository
- **Visual Feedback**: Loading states, success/error alerts
- **Product Preview**: View all existing products with images
- **Validation**: Form validation for all required fields

---

## Setup Instructions

### 1. Create GitHub Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a descriptive name: "Sahumario Admin Panel"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **IMPORTANT**: Copy the token immediately (you won't see it again)

### 2. Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
# GitHub Integration
REACT_APP_GITHUB_TOKEN=ghp_your_token_here
REACT_APP_GITHUB_OWNER=your_github_username
REACT_APP_GITHUB_REPO=your_repository_name
REACT_APP_GITHUB_BRANCH=main
```

**Security Notes:**
- Never commit the `.env` file to version control
- Add `.env` to `.gitignore`
- Keep your token secret and secure
- Use minimal necessary permissions

### 3. Verify Setup

1. Start the development server:
   ```bash
   npm start
   ```

2. Navigate to the Admin page from the navbar

3. You should see the setup instructions if environment variables are missing

---

## Using the Admin Panel

### Adding a Product

1. **Navigate to Admin**: Click "Admin" in the navigation menu

2. **Fill in Product Details**:
   - **Product Name** (required): e.g., "Rose Garden"
   - **Description** (required): Brief description of the fragrance
   - **Price** (required): Price in INR (e.g., 749)
   - **Image Path** (required): Path to product image (e.g., `/products/rose_garden.jpg`)
   - **Alt Text** (optional): Accessibility description (auto-generated if empty)

3. **Click "Save & Commit to GitHub"**: Button will show loading state

4. **Wait for Confirmation**: Success message will appear when product is added

5. **Verify**:
   - Product appears in the "Current Products" list
   - Check your GitHub repository for the commit
   - Refresh the Perfumes page to see the new product

### Product Data Structure

```json
{
  "id": 6,
  "name": "Rose Garden",
  "description": "Delicate rose petals with subtle vanilla notes",
  "price": 749,
  "image": "/products/rose_garden.jpg",
  "alt": "Rose Garden perfume bottle with delicate rose fragrance"
}
```

### Image Management

**Before adding a product**, ensure the product image exists:

1. Add the image to `public/products/` directory
2. Use the path format: `/products/filename.jpg`
3. Supported formats: JPG, PNG, WebP
4. Recommended size: 800x1000px or similar aspect ratio

---

## How It Works

### GitHub API Integration

The admin panel uses GitHub's Contents API to update `src/data/products.json`:

1. **Fetch Current File**: Gets the current SHA (required for updates)
2. **Prepare Content**: Formats JSON with new product added
3. **Commit Changes**: Creates a commit with descriptive message
4. **Update State**: Refreshes local product list

### Commit Message Format

```
Add product: [Product Name]
```

Example: `Add product: Rose Garden`

### Error Handling

Common errors and solutions:

| Error | Solution |
|-------|----------|
| "GitHub configuration missing" | Add environment variables to `.env` |
| "Failed to commit to GitHub" | Check token permissions and validity |
| "Failed to fetch current file SHA" | Verify repository and file path |
| "Product name is required" | Fill in all required fields |

---

## Security Considerations

### Frontend GitHub Commits (Current Implementation)

**Pros:**
- Simple setup
- No backend required
- Direct integration

**Cons:**
- Token exposed in frontend (even in env variables)
- Not suitable for production
- Anyone with dev tools access can see the token
- Limited control over who can commit

### Production Recommendations

For production environments, implement a backend API:

```
Frontend → Backend API → GitHub
```

**Backend Implementation:**
1. Create a Node.js/Express backend
2. Store GitHub token server-side
3. Add authentication (admin login)
4. Validate all requests
5. Rate limiting
6. Audit logging

**Example Backend Endpoint:**
```javascript
// POST /api/products
app.post('/api/products', authenticate, async (req, res) => {
  // Validate admin permissions
  // Validate product data
  // Commit to GitHub
  // Return success/error
});
```

---

## Troubleshooting

### Token Authentication Fails

**Check:**
1. Token is correctly copied (no extra spaces)
2. Token has `repo` scope enabled
3. Token hasn't expired
4. Repository name and owner are correct

**Fix:**
- Regenerate token with correct permissions
- Update `.env` file
- Restart development server

### Products Not Appearing After Save

**Check:**
1. GitHub commit was successful (check repository)
2. Product ID is unique
3. Image path is correct
4. Browser cache (hard refresh: Ctrl+F5)

**Fix:**
- Clear browser cache
- Reload products.json directly
- Check console for errors

### Image Not Displaying

**Check:**
1. Image file exists in `public/products/`
2. File name matches path in JSON
3. File extension is correct
4. Image is not corrupted

**Fix:**
- Verify image path
- Check file permissions
- Use correct format (JPG/PNG/WebP)

---

## API Reference

### GitHub Contents API

**Get File Contents:**
```
GET /repos/{owner}/{repo}/contents/{path}
```

**Update File:**
```
PUT /repos/{owner}/{repo}/contents/{path}
```

**Required Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/vnd.github.v3+json",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "message": "Commit message",
  "content": "base64_encoded_content",
  "sha": "file_sha_for_updates",
  "branch": "main"
}
```

---

## Best Practices

### Product Management

1. **Use descriptive names**: Clear, concise product names
2. **Write detailed descriptions**: Help customers understand the fragrance
3. **Consistent pricing**: Maintain price consistency
4. **Quality images**: Use high-resolution product photos
5. **Accessibility**: Always provide alt text

### Image Guidelines

- **Format**: JPG or PNG (WebP for modern browsers)
- **Size**: 800-1000px width recommended
- **Aspect Ratio**: 4:5 (portrait) works best
- **File Size**: Keep under 200KB for performance
- **Naming**: Use lowercase, hyphens for spaces (e.g., `rose-garden.jpg`)

### GitHub Best Practices

- **Commit Messages**: Use descriptive commit messages
- **Token Security**: Never share or commit tokens
- **Regular Reviews**: Regularly review commit history
- **Backup**: Keep local backup of products.json
- **Testing**: Test in development before production

---

## Future Enhancements

Potential improvements for the admin panel:

1. **Edit Products**: Ability to modify existing products
2. **Delete Products**: Remove products from catalog
3. **Image Upload**: Direct image upload to repository
4. **Bulk Operations**: Add/edit multiple products at once
5. **Product Categories**: Organize products by category
6. **Inventory Management**: Track stock levels
7. **Order Management**: View and manage customer orders
8. **Analytics Dashboard**: Sales and visitor statistics
9. **Multi-user Support**: Different admin permission levels
10. **Audit Logs**: Track all admin actions

---

## Migration to Backend API

When ready to move to production:

### 1. Create Backend Service

```javascript
// server.js
const express = require('express');
const { Octokit } = require('@octokit/rest');

const app = express();
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

app.post('/api/admin/products', authenticate, async (req, res) => {
  // Product creation logic
});
```

### 2. Update Frontend

```javascript
// Replace direct GitHub calls with API calls
const response = await fetch('/api/admin/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify(productData)
});
```

### 3. Add Authentication

- Implement admin login
- Use JWT tokens
- Store sessions securely
- Add role-based access control

---

## Support

For issues or questions:
- Check the troubleshooting section above
- Review GitHub API documentation
- Contact development team

---

**Last Updated**: 2026-02-08
**Version**: 1.0.0

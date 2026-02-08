import React, { useState, useCallback } from "react";
import { Card, Input, Textarea, Button } from "../components/ui";
import { Plus, Save, AlertCircle, CheckCircle2, Github, Package } from "lucide-react";
import productsData from "../data/products.json";

/**
 * AdminPage Component - Product Management with GitHub Integration
 *
 * Features:
 * - Add new products to catalog
 * - Auto-generate product IDs
 * - Commit changes directly to GitHub repository
 * - Visual feedback for all operations
 *
 * Security Notes:
 * - GitHub token must be stored in environment variables
 * - Never expose tokens in frontend code
 * - Use GitHub Personal Access Token with minimal scopes
 */
export default function AdminPage() {
  const [products, setProducts] = useState(productsData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state for new product
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    alt: ""
  });

  // Handle form field changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccess(null);
  }, []);

  // Validate product data
  const validateProduct = useCallback(() => {
    if (!newProduct.name.trim()) {
      setError("Product name is required");
      return false;
    }
    if (!newProduct.description.trim()) {
      setError("Product description is required");
      return false;
    }
    if (!newProduct.price || isNaN(newProduct.price) || Number(newProduct.price) <= 0) {
      setError("Valid product price is required");
      return false;
    }
    if (!newProduct.image.trim()) {
      setError("Product image path is required");
      return false;
    }
    return true;
  }, [newProduct]);

  // Add product to list and commit to GitHub
  const handleSaveProduct = useCallback(async () => {
    if (!validateProduct()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Generate new ID (max existing ID + 1)
      const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
      const productToAdd = {
        id: maxId + 1,
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: Number(newProduct.price),
        image: newProduct.image.trim(),
        alt: newProduct.alt.trim() || `${newProduct.name.trim()} perfume bottle`
      };

      // Update products list
      const updatedProducts = [...products, productToAdd];

      // Commit to GitHub
      await commitToGitHub(updatedProducts);

      // Update local state
      setProducts(updatedProducts);

      // Reset form
      setNewProduct({
        name: "",
        description: "",
        price: "",
        image: "",
        alt: ""
      });

      setSuccess(`Product "${productToAdd.name}" added successfully and committed to GitHub!`);
    } catch (err) {
      setError(err.message || "Failed to save product. Please try again.");
      console.error("Admin save error:", err);
    } finally {
      setLoading(false);
    }
  }, [newProduct, products, validateProduct]);

  // Commit changes to GitHub
  const commitToGitHub = async (updatedProducts) => {
    // Get GitHub configuration from environment variables
    const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
    const GITHUB_OWNER = process.env.REACT_APP_GITHUB_OWNER;
    const GITHUB_REPO = process.env.REACT_APP_GITHUB_REPO;
    const GITHUB_BRANCH = process.env.REACT_APP_GITHUB_BRANCH || "main";

    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      throw new Error(
        "GitHub configuration missing. Please set REACT_APP_GITHUB_TOKEN, REACT_APP_GITHUB_OWNER, and REACT_APP_GITHUB_REPO in your .env file."
      );
    }

    const filePath = "src/data/products.json";
    const fileContent = JSON.stringify(updatedProducts, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));

    // Get current file SHA (required for updates)
    const getFileUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`;

    let currentSha = null;
    try {
      const getResponse = await fetch(getFileUrl, {
        headers: {
          "Authorization": `Bearer ${GITHUB_TOKEN}`,
          "Accept": "application/vnd.github.v3+json"
        }
      });

      if (getResponse.ok) {
        const fileData = await getResponse.json();
        currentSha = fileData.sha;
      }
    } catch (err) {
      console.warn("Could not fetch current file SHA:", err);
    }

    // Commit the file
    const commitUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

    const commitPayload = {
      message: `Add product: ${updatedProducts[updatedProducts.length - 1].name}`,
      content: encodedContent,
      branch: GITHUB_BRANCH
    };

    if (currentSha) {
      commitPayload.sha = currentSha;
    }

    const commitResponse = await fetch(commitUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(commitPayload)
    });

    if (!commitResponse.ok) {
      const errorData = await commitResponse.json();
      throw new Error(errorData.message || "Failed to commit to GitHub");
    }

    return await commitResponse.json();
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Add new products and sync with GitHub repository
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 animate-in fade-in"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">Error</h3>
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div
          className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3 animate-in fade-in"
          role="alert"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">Success</h3>
            <p className="text-sm text-green-700 dark:text-green-200">{success}</p>
          </div>
          <button
            onClick={() => setSuccess(null)}
            className="text-green-600 hover:text-green-800"
            aria-label="Dismiss success"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Product Form */}
        <Card className="p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-semibold">Add New Product</h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Product Name"
              name="name"
              required
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="e.g., Rose Garden"
              disabled={loading}
            />

            <Textarea
              label="Description"
              name="description"
              required
              value={newProduct.description}
              onChange={handleInputChange}
              placeholder="e.g., Delicate rose petals with subtle vanilla notes"
              rows={3}
              disabled={loading}
            />

            <Input
              label="Price (₹)"
              name="price"
              type="number"
              required
              value={newProduct.price}
              onChange={handleInputChange}
              placeholder="e.g., 749"
              disabled={loading}
            />

            <Input
              label="Image Path"
              name="image"
              required
              value={newProduct.image}
              onChange={handleInputChange}
              placeholder="e.g., /products/rose_garden.jpg"
              disabled={loading}
            />

            <Input
              label="Alt Text (Optional)"
              name="alt"
              value={newProduct.alt}
              onChange={handleInputChange}
              placeholder="Descriptive text for accessibility"
              disabled={loading}
            />

            <Button
              onClick={handleSaveProduct}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving & Committing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  Save & Commit to GitHub
                </span>
              )}
            </Button>
          </div>

          {/* GitHub Info */}
          <div className="mt-6 p-4 bg-[var(--color-surface-muted)] rounded-lg">
            <div className="flex items-start gap-2">
              <Github className="w-4 h-4 text-[var(--color-muted)] mt-0.5" />
              <div className="text-xs text-[var(--color-muted)]">
                <p className="font-medium mb-1">GitHub Integration</p>
                <p>Changes will be automatically committed to your repository's products.json file.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Current Products List */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6">
            Current Products ({products.length})
          </h2>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-4 border border-[var(--color-border)] rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{product.name}</h3>
                    <p className="text-sm text-[var(--color-muted)] mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-muted)]">
                      <span className="font-medium text-amber-600">
                        ₹{product.price}
                      </span>
                      <span>ID: {product.id}</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-[var(--color-surface-muted)] flex-shrink-0 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          Setup Instructions
        </h3>
        <div className="text-sm text-[var(--color-text)] space-y-2">
          <p>To enable GitHub commits, add these environment variables to your <code className="px-2 py-1 bg-[var(--color-surface)] rounded">.env</code> file:</p>
          <pre className="mt-2 p-3 bg-[var(--color-surface)] rounded-lg overflow-x-auto text-xs">
{`REACT_APP_GITHUB_TOKEN=your_github_personal_access_token
REACT_APP_GITHUB_OWNER=your_github_username
REACT_APP_GITHUB_REPO=your_repository_name
REACT_APP_GITHUB_BRANCH=main`}
          </pre>
          <p className="text-xs text-[var(--color-muted)] mt-2">
            <strong>Security Note:</strong> Never commit your .env file or expose tokens in code.
            For production, use a backend API instead of direct GitHub commits from frontend.
          </p>
        </div>
      </Card>
    </section>
  );
}

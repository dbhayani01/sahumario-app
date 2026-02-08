import React, { useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card } from "../components/ui";
import initialProducts from "../data/products.json";
import { getGitHubFile, commitGitHubFile } from "../lib/github";

// Path inside the repository — must match where products.json lives
const PRODUCTS_REPO_PATH = "src/data/products.json";

const EMPTY_FORM = { name: "", description: "", price: "", image: "", alt: "" };

function validateProduct(form) {
  const errs = {};
  if (!form.name?.trim()) errs.name = "Name is required";
  if (!form.description?.trim()) errs.description = "Description is required";
  if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
    errs.price = "Enter a valid price greater than 0";
  if (!form.image?.trim())
    errs.image = "Image path required (e.g. /products/bloom.jpg)";
  if (!form.alt?.trim()) errs.alt = "Alt text required for accessibility";
  return errs;
}

// Reusable labelled input row used inside the product form
function FormField({ label, name, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-[var(--color-text)]">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:ring-2 focus:ring-amber-600 outline-none transition-colors ${
          error ? "border-red-500" : "border-[var(--color-border)]"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function AdminPage() {
  // Local product state — seeded from products.json at mount
  const [products, setProducts] = useState(initialProducts);

  // Form state: null = closed, -1 = adding new, n = editing product with id n
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  // Tracks whether local products differ from last committed state
  const [dirty, setDirty] = useState(false);

  // GitHub commit status: "idle" | "loading" | "success" | "error"
  const [commitState, setCommitState] = useState("idle");
  const [commitMsg, setCommitMsg] = useState("");

  const openAdd = useCallback(() => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setEditingId(-1);
  }, []);

  const openEdit = useCallback((product) => {
    setForm({ ...product, price: String(product.price) });
    setFormErrors({});
    setEditingId(product.id);
  }, []);

  const closeForm = useCallback(() => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  }, []);

  const handleFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the individual field error as the user types
    setFormErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const handleSaveProduct = useCallback(() => {
    const errs = validateProduct(form);
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }

    const product = {
      // Auto-increment ID for new products
      id: editingId === -1 ? Math.max(0, ...products.map((p) => p.id)) + 1 : editingId,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      image: form.image.trim(),
      alt: form.alt.trim(),
    };

    setProducts((prev) =>
      editingId === -1 ? [...prev, product] : prev.map((p) => (p.id === editingId ? product : p))
    );
    setDirty(true);
    setCommitState("idle"); // reset any previous commit status
    closeForm();
  }, [form, editingId, products, closeForm]);

  const handleDelete = useCallback(
    (id) => {
      if (!window.confirm("Delete this product?")) return;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDirty(true);
      setCommitState("idle");
    },
    []
  );

  /**
   * Commits the current products array to GitHub as src/data/products.json.
   * Requires REACT_APP_GITHUB_TOKEN, REACT_APP_GITHUB_OWNER, REACT_APP_GITHUB_REPO in .env
   */
  const handleCommit = useCallback(async () => {
    const token = process.env.REACT_APP_GITHUB_TOKEN;
    const owner = process.env.REACT_APP_GITHUB_OWNER;
    const repo = process.env.REACT_APP_GITHUB_REPO;
    const branch = process.env.REACT_APP_GITHUB_BRANCH || "main";

    if (!token || !owner || !repo) {
      setCommitState("error");
      setCommitMsg(
        "GitHub credentials missing. Add REACT_APP_GITHUB_TOKEN, REACT_APP_GITHUB_OWNER, and REACT_APP_GITHUB_REPO to your .env file."
      );
      return;
    }

    try {
      setCommitState("loading");
      setCommitMsg("");

      // 1. Fetch current file SHA (required by the GitHub API to update a file)
      const fileData = await getGitHubFile({
        token, owner, repo, path: PRODUCTS_REPO_PATH, branch,
      });

      // 2. Commit updated JSON
      const result = await commitGitHubFile({
        token, owner, repo, path: PRODUCTS_REPO_PATH, branch,
        content: JSON.stringify(products, null, 2),
        sha: fileData.sha,
        message: "chore: update products catalogue via admin panel",
      });

      setCommitState("success");
      setCommitMsg(`Committed successfully! SHA: ${result.commit.sha.slice(0, 7)}`);
      setDirty(false);
    } catch (err) {
      setCommitState("error");
      setCommitMsg(err.message || "Commit failed. Check console for details.");
      console.error("[Admin] GitHub commit error:", err);
    }
  }, [products]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Product Catalogue</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Add, edit, or remove products. Click <strong>Commit to GitHub</strong> to publish.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Product
        </button>
      </div>

      {/* Inline add / edit form */}
      {editingId !== null && (
        <Card className="mb-6 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">
              {editingId === -1 ? "New Product" : "Edit Product"}
            </h2>
            <button
              onClick={closeForm}
              aria-label="Close form"
              className="rounded-lg p-1 hover:bg-[var(--color-surface-muted)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleFieldChange}
              error={formErrors.name}
              placeholder="Bloom"
            />
            <FormField
              label="Price (₹)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleFieldChange}
              error={formErrors.price}
              placeholder="749"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm text-[var(--color-text)]">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleFieldChange}
              rows={2}
              placeholder="Warm, resinous amber with smoky oud base."
              className={`mt-1 w-full resize-none rounded-lg border px-3 py-2 text-sm bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:ring-2 focus:ring-amber-600 outline-none transition-colors ${
                formErrors.description ? "border-red-500" : "border-[var(--color-border)]"
              }`}
            />
            {formErrors.description && (
              <p className="mt-1 text-xs text-red-500">{formErrors.description}</p>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Image Path"
              name="image"
              value={form.image}
              onChange={handleFieldChange}
              error={formErrors.image}
              placeholder="/products/bloom.jpg"
            />
            <FormField
              label="Alt Text"
              name="alt"
              value={form.alt}
              onChange={handleFieldChange}
              error={formErrors.alt}
              placeholder="Bottle of Bloom perfume"
            />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handleSaveProduct}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              Save Product
            </button>
            <button
              onClick={closeForm}
              className="px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* Product cards grid */}
      {products.length === 0 ? (
        <p className="py-12 text-center text-[var(--color-muted)]">
          No products yet. Click "Add Product" to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <Card key={p.id}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{p.name}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-muted)] line-clamp-2">
                    {p.description}
                  </p>
                  <p className="mt-2 text-sm font-medium text-amber-600">₹{p.price}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-muted)] truncate">{p.image}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => openEdit(p)}
                    aria-label={`Edit ${p.name}`}
                    className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-amber-600 hover:bg-[var(--color-surface-muted)] transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    aria-label={`Delete ${p.name}`}
                    className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* GitHub publish section */}
      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 font-semibold">
              <GitCommit className="h-4 w-4 text-[var(--color-muted)]" aria-hidden="true" />
              Publish to GitHub
            </h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Commits{" "}
              <code className="rounded bg-[var(--color-surface-muted)] px-1 py-0.5 text-xs">
                src/data/products.json
              </code>{" "}
              to the{" "}
              <code className="rounded bg-[var(--color-surface-muted)] px-1 py-0.5 text-xs">
                main
              </code>{" "}
              branch of your repository.
            </p>
          </div>

          <button
            onClick={handleCommit}
            disabled={commitState === "loading" || !dirty}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-text)] px-4 py-2.5 text-sm font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {commitState === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Committing…
              </>
            ) : (
              <>
                <GitCommit className="h-4 w-4" aria-hidden="true" />
                Commit to GitHub
              </>
            )}
          </button>
        </div>

        {/* Status feedback */}
        {commitState === "success" && (
          <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {commitMsg}
          </div>
        )}
        {commitState === "error" && (
          <div className="mt-3 flex items-start gap-2 text-sm text-red-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{commitMsg}</span>
          </div>
        )}
        {dirty && commitState === "idle" && (
          <p className="mt-2 text-xs text-amber-600">
            ● Unsaved local changes — commit to publish them.
          </p>
        )}
      </div>

      {/* Security notice */}
      <p className="mt-4 text-xs text-[var(--color-muted)]">
        ⚠ Admin only. Requires a GitHub Fine-grained PAT with <em>Contents: Read &amp; write</em>{" "}
        scope set in <code>.env</code> as <code>REACT_APP_GITHUB_TOKEN</code>. Never deploy with
        this token in a public bundle.
      </p>
    </section>
  );
}

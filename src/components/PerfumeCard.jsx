// src/components/PerfumeCard.jsx
import SafeImage from "./SafeImage";
// import { useState } from "react";

export default function PerfumeCard({
  name,
  description,
  price,
  image,
  alt,
  qty,
  onAdd,
  onUpdateQty,
  onClick,
}) {
  // const [showDetails, setShowDetails] = useState(false);

  // const toggleDetails = () => {
  //   setShowDetails((prev) => !prev);
  // };

  return (
    <article
      className="rounded-lg border border-[var(--color-border)] shadow-sm overflow-hidden bg-[var(--color-surface)] cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] bg-[var(--color-surface-muted)]">
        <SafeImage
          src={image}
          alt={alt || name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <h4 className="font-semibold text-lg line-clamp-1">{name}</h4>
        <p className="mt-1 text-sm text-[var(--color-muted)] line-clamp-2 hidden sm:block">
          {description}
        </p>
        <div className="mt-3 font-medium hidden sm:block">
          {/* ₹{Number(price).toLocaleString("en-IN")} */}
          ₹{price ? Number(price).toLocaleString("en-IN") : "0"}
        </div>
        {qty > 0 && (
          <div className="mt-4 flex items-center space-x-2 hidden sm:flex">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateQty(qty - 1);
              }}
              className="px-3 py-1 bg-[var(--color-surface-muted)] rounded hover:bg-amber-600 hover:text-white transition-colors"
            >
              -
            </button>
            <span>{qty}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateQty(qty + 1);
              }}
              className="px-3 py-1 bg-[var(--color-surface-muted)] rounded hover:bg-amber-600 hover:text-white transition-colors"
            >
              +
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

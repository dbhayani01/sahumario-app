// src/components/SafeImage.jsx
import React, { useState, useCallback } from "react";

// Inline SVG used as fallback when the product image fails to load
const FALLBACK_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E";

const SafeImage = React.memo(({ src, alt, className, ...rest }) => {
  const [err, setErr] = useState(false);

  const handleError = useCallback(() => {
    setErr(true);
  }, []);

  return (
    <img
      src={err ? FALLBACK_SRC : src}
      alt={alt}
      onError={handleError}
      loading="lazy"
      decoding="async"
      className={className}
      {...rest}
    />
  );
});

SafeImage.displayName = 'SafeImage';

export default SafeImage;
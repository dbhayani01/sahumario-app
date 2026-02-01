// src/components/SafeImage.jsx
import React, { useState, useCallback } from "react";

const SafeImage = React.memo(({ src, alt, className, ...rest }) => {
  const [err, setErr] = useState(false);
  const fallback = "/products/placeholder.jpg";

  const handleError = useCallback(() => {
    setErr(true);
  }, []);

  return (
    <img
      src={err ? fallback : src}
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
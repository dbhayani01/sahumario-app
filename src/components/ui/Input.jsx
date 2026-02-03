import React from 'react';

const Input = React.memo(React.forwardRef(({ 
  label, 
  error, 
  required = false, 
  className = '', 
  type = 'text',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="text-sm text-[var(--color-text)]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-2 focus:ring-2 focus:ring-amber-600 outline-none transition-colors placeholder:text-[var(--color-muted)] ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}));

Input.displayName = 'Input';

export default Input;

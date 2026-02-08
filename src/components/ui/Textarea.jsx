import React from 'react';

const Textarea = React.memo(React.forwardRef(({
  label,
  error,
  required = false,
  className = '',
  rows = 3,
  id,
  name,
  ...props
}, ref) => {
  // Generate id from name if not provided, for label association
  const textareaId = id || `textarea-${name}`;
  const errorId = `${textareaId}-error`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="text-sm text-[var(--color-text)]">
          {label} {required && <span className="text-red-500" aria-label="required">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        name={name}
        rows={rows}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        aria-required={required}
        className={`mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-2 focus:ring-2 focus:ring-amber-600 outline-none transition-colors resize-none placeholder:text-[var(--color-muted)] ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p id={errorId} className="mt-1 text-sm text-red-500" role="alert">{error}</p>}
    </div>
  );
}));

Textarea.displayName = 'Textarea';

export default Textarea;

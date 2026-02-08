import React from 'react';

const Select = React.memo(React.forwardRef(({
  label,
  options = [],
  error,
  required = false,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  // Generate id from name if not provided, for label association
  const selectId = id || `select-${name}`;
  const errorId = `${selectId}-error`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="text-sm text-[var(--color-text)]">
          {label} {required && <span className="text-red-500" aria-label="required">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        name={name}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        aria-required={required}
        className={`mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-2 focus:ring-2 focus:ring-amber-600 outline-none transition-colors ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p id={errorId} className="mt-1 text-sm text-red-500" role="alert">{error}</p>}
    </div>
  );
}));

Select.displayName = 'Select';

export default Select;

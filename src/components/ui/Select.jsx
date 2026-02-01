import React from 'react';

const Select = React.memo(React.forwardRef(({ 
  label, 
  options = [], 
  error, 
  required = false, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="text-sm text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-amber-600 outline-none transition-colors bg-white ${
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
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}));

Select.displayName = 'Select';

export default Select;

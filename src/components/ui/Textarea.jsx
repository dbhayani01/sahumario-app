import React from 'react';

const Textarea = React.memo(React.forwardRef(({ 
  label, 
  error, 
  required = false, 
  className = '', 
  rows = 3,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="text-sm text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-amber-600 outline-none transition-colors resize-none ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}));

Textarea.displayName = 'Textarea';

export default Textarea;

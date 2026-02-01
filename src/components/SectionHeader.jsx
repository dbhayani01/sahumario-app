import React from 'react';

const SectionHeader = React.memo(({ title, subtitle, className = '' }) => {
  return (
    <div className={className}>
      <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-gray-600">{subtitle}</p>
      )}
    </div>
  );
});

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;

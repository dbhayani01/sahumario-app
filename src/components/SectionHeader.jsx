import React from 'react';

const SectionHeader = React.memo(({ title, subtitle, className = '' }) => {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-[var(--color-muted)] text-sm sm:text-base">{subtitle}</p>
      )}
    </div>
  );
});

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;

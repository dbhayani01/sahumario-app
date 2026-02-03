import React from 'react';

const Card = React.memo(({ children, className = '', ...props }) => {
  return (
    <div 
      className={`rounded-xl border border-[var(--color-border)] p-4 bg-[var(--color-surface)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;

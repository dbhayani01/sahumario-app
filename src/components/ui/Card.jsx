import React from 'react';

const Card = React.memo(({ children, className = '', ...props }) => {
  return (
    <div 
      className={`rounded-xl border border-gray-200 p-4 bg-white ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;

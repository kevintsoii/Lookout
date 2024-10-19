import React from 'react';
import clsx from 'clsx'; // For conditional classnames

export function Button({ children, className, ...props }) {
  return (
    <button
      className={clsx(
        'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

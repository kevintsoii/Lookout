import React from 'react';

export function Card({ className, children }) {
  return (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ className, children }) {
    return (
      <div className={`p-4 ${className}`}>
        {children}
      </div>
    );
}

  export function CardHeader({ className, children }) {
    return (
      <div className={`border-b p-4 ${className}`}>
        {children}
      </div>
    );
}

export function CardTitle({ className, children }) {
    return (
      <h2 className={`text-lg font-semibold ${className}`}>
        {children}
      </h2>
    );
  }
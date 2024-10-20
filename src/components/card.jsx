import React from "react";

export function Card({ className, children }) {
  return (
    <div
      className={`bg-slate-200 shadow-md rounded-lg border border-gray-700 overflow-hidden ${className}`}
    >
      {children}
      <div className="absolute inset-0 rounded-xl border-[1px] border-transparent bg-gradient-to-br from-white/10 to-transparent opacity-10 blur-md pointer-events-none"></div>
    </div>
  );
}

export function CardContent({ className, children }) {
  return (
    <div className={`bg-gray-400/80 text-lg p-2 ${className}`}>{children}</div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={`border-b p-4 ${className}`}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return (
    <h2 className={`text-2xl text-center font-bold ${className}`}>
      {children}
    </h2>
  );
}

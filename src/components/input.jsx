import React from "react";
import clsx from "clsx";

export function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        "px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400",
        className
      )}
      {...props}
    />
  );
}

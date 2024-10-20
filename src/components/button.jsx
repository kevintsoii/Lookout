import React from "react";
import clsx from "clsx"; // For conditional classnames

export function Button({ children, className, ...props }) {
  return (
    <button
      className={clsx(
        "px-4 py-2 bg-black text-white rounded text-center text-sm hover:bg-black focus:outline-none ",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

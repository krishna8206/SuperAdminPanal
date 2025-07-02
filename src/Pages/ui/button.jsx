import React from "react"

export const Button = ({ children, className = "", ...props }) => (
  <button className={`px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500 ${className}`} {...props}>
    {children}
  </button>
)

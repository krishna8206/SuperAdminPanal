import React from "react"

export const Label = ({ children, className = "", ...props }) => (
  <label className={`block text-sm font-medium ${className}`} {...props}>
    {children}
  </label>
)

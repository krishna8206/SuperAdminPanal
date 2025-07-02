import React from "react"

export const Input = ({ className = "", ...props }) => (
  <input
    className={`px-3 py-2 rounded border border-gray-700 bg-gray-800 text-white focus:border-green-400 focus:ring-green-400 ${className}`}
    {...props}
  />
)

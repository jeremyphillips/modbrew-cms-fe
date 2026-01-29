import React from 'react'

interface TextProps {
  id?: string
  label: string
  value: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  isReadOnly?: boolean
  isRequired?: boolean
}

const Text = ({ 
  id,
  label,
  isReadOnly = false,
  value, 
  onChange, 
  placeholder, 
  isRequired
}: TextProps) => {
  return (
    <label htmlFor={id}>
      <span>{label}{isRequired && '*'}</span>
      <input
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        type="text"
        id={id}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        required={isRequired}
        readOnly={isReadOnly}
      />
    </label>
  )
}

export default Text

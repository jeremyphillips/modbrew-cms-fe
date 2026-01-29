import React from 'react'

interface NumberProps {
  id?: string
  label: string
  value: number | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  isReadOnly?: boolean
  isRequired?: boolean
  min?: number
}

const Number = ({ 
  id,
  label,
  isReadOnly = false,
  // min,
  value, 
  onChange, 
  placeholder, 
  isRequired
}: NumberProps) => {
  return (
    <label htmlFor={id}>
      <span>{label}{isRequired ? '*' : ''}</span>
      <input
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        type="number"
        id={id}
        value={value || null}
        onChange={onChange}
        placeholder={placeholder}
        required={isRequired}
        readOnly={isReadOnly}
      />
    </label>
  )
}

export default Number

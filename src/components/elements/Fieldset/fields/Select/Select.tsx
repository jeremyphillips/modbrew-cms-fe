import React from "react";

interface SelectFieldProps {
  id: string
  label: string
  options: { label: string; value: string | number }[]
  value?: string | number
  onChange: (value: string | number) => void
  isRequired?: boolean
  allowEmpty?: boolean  // Allows empty selection
  emptyOptionLabel?: string // Custom label for empty option
}

const Select = ({
  id,
  label,
  options = [],
  value = "",
  onChange,
  isRequired = false,
  allowEmpty = false,
  emptyOptionLabel = "Select an option"
}: SelectFieldProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);  // This should correctly pass the selected value
  }

  return (
    <div className="select-field">
      <label htmlFor={id}>{label}{isRequired ? '*' : ''}</label>
      <select
        className="block w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-gray-700"
        id={id}
        value={value}
        onChange={handleChange}
        required={isRequired}
      >
        {allowEmpty && (
          <option value="" disabled={isRequired}>
            {emptyOptionLabel}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select

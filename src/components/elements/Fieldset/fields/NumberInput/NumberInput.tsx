import React from 'react'

interface NumberInputProps {
  label: string
  value: number | null
  onChange: (value: number | null) => void
  min?: number
  max?: number
  placeholder?: string
  isReadOnly?: boolean
}

const NumberInput = ({ label, value, onChange, max, min, placeholder, isReadOnly }: NumberInputProps) => {
  return (
    <label>
      <span>{label}</span>
      <input
        type="number"
        value={value ?? ''}
        min={min}
        max={max}
        readOnly={isReadOnly}
        placeholder={placeholder}
        onChange={e => {
          const val = e.target.value
          onChange(val === '' ? null : Number(val))
        }}
      />
    </label>
  )
}

export default NumberInput

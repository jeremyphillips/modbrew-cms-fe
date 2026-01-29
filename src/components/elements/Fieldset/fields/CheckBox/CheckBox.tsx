interface CheckBoxProps {
  id: string
  isRequired?: boolean
  label: string
  value?: 0 | 1
  onChange: (value: 0 | 1) => void
}

const CheckBox = ({
  id,
  // isRequired = false,
  label,
  value = 0,
  onChange
}: CheckBoxProps) => {
  const handleChange = () => {
    onChange(value === 1 ? 0 : 1)
  }

  return (
    <div className="checkbox-group">
      {/* <label htmlFor={id}>{label}{isRequired ? '*' : ''}</label> */}
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          type="checkbox"
          id={id}
          checked={value === 1}
          onChange={handleChange}
        />
        {label}
      </label>
    </div>
  )
}

export default CheckBox

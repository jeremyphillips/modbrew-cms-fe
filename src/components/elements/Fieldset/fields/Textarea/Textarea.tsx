interface TextareaProps {
  id?: string
  label: string
  onChange: (value: string) => void
  placeholder?: string
  maxChars?: number
  value?: string
  isRequired?: boolean
}

const Textarea = ({
  id,
  label,
  // maxChars = 99999,
  onChange,
  placeholder,
  value = '',
  isRequired = false,
}: TextareaProps) => {
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   onChange(e.target.value)
  // }

  return (
    <label htmlFor={id}>
      <span>
        {label}
        {isRequired ? '*' : ''}
      </span>
      <textarea
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        id={id}
        name={id}
        // onChange={onChange}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        required={isRequired}
        value={value || ''}
      />
    </label>
  )
}

export default Textarea

interface FieldsetProps {
  legend?: string
  className?: string
  children: React.ReactNode
}

const Fieldset = ({ legend, className = '', children }: FieldsetProps) => {
  return (
    <fieldset className={`fieldset ${className}`}>
      {legend && (
        <legend className="fieldset__legend mb-2 font-semibold">
          {legend}
        </legend>
      )}

      <div className="space-y-4x flex gap-4 flex-col">
        {children}
      </div>
    </fieldset>
  )
}

export default Fieldset

interface RepeaterProps {
  id: string
  // max?: number
  // min?: number
  // required?: boolean
  // sub_fields?: any
}

const Repeater = ({
  id,
  // max = 9999,
  // min = 0,
  // required = false,
  // sub_fields = []
}: RepeaterProps) => {
  return (
    <>
      <input
        type="text" 
        id={id} 
        name={id}
      />
    </>
  )
}

export default Repeater

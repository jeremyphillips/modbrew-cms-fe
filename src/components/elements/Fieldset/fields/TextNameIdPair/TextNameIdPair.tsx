import { sanitizeToCase } from '~utils'

interface TextNameIdPairProps {
  name: string 
  id: string 
  idModified?: boolean 
  idLabel?: string | 'ID'
  nameLabel?: string | 'Name'
  onNameChange: (val: string) => void 
  onIdChange: (val: string) => void 
  onIdFocus?: () => void 
  pascalCase: boolean
}

const TextNameIdPair = ({ 
  name = '', 
  id = '', 
  idModified = false, 
  idLabel = 'ID', 
  nameLabel = 'Name', 
  onNameChange, 
  onIdChange, 
  onIdFocus, 
  pascalCase = false 
}: TextNameIdPairProps) => {
  const handleNameChange = (e) => {
    const newName = e.target.value
    onNameChange(newName)
    if (!idModified) {
      onIdChange(sanitizeToCase(newName, pascalCase))
    }
  }

  const handleIdChange = (e) => {
    onIdChange(e.target.value)
  }

  return (
    <>
      <label>
        <span>{nameLabel} *</span>
        <input
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          type="text"
          placeholder="Name"
          value={name}
          onChange={handleNameChange}
          required
        />
      </label>
      <label>
        <span>{idLabel} *</span>
        <input
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          type="text"
          placeholder="ID"
          value={id}
          onChange={handleIdChange}
          onFocus={onIdFocus}
          required
        />
      </label>  
    </>
  )
}

export default TextNameIdPair

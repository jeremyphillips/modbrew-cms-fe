type MimeType = 'jpg' | 'jpeg' | 'png' | 'mp4' | 'webp'

interface FileProps {
  dimensions?: {
    height?: number
    max_height?: number
    min_height?: number
    width?: number
    max_width?: number
    min_width?: number
  },
  id: string
  isRequired: boolean
  label: string
  mime_types: MimeType[]
}

const File = ({
  // dimensions = {},
  id,
  label = '',
  mime_types: mimeTypes = ['jpg', 'jpeg', 'png', 'webp'],
  isRequired = false,
}: FileProps) => {
  return (
    mimeTypes && (
      <>
        <label htmlFor={id}>{label}{isRequired ? '*' : ''}</label>
        <input type="file" id={id} name={id} />
      </>
    )
  )
}

export default File

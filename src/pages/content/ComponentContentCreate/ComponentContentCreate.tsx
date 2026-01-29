import { useParams } from 'react-router-dom'
import { ComponentContentForm } from '~modules/content'

const ComponentContentCreate = () => {
  const { schemaId } = useParams()
  // console.log('schemaId',schemaId)
  return (
    <>
      <h1>Create new component content</h1>

      <ComponentContentForm
        action="CREATE"
        resourceId={schemaId}
      />
    </>
  )
}

export default ComponentContentCreate

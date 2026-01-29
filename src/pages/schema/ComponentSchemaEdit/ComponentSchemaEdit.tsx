import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { fetchComponentSchemaById } from '~api/componentSchema'
import type { ComponentSchemaPayload } from '~api/componentSchema'
import { ComponentSchemaForm } from '~modules/schema'
import { AlertBar } from '~elements'

function ComponentEdit() {
  const { _id } = useParams()
  const [component, setComponent] = useState<ComponentSchemaPayload | null>(null)
  const location = useLocation()
  const message = location.state?.message

  useEffect(() => {
    const fetchData = async () => {
      if (_id) {
        const data: ComponentSchemaPayload = await fetchComponentSchemaById(_id)
        setComponent(data)
      }
    }
    fetchData()
  }, [_id])

  if (!component) return <p>Loading...</p>

  return (
    <>
      {message && <AlertBar message={message} />}
      <h1>Edit {component?.id} schema</h1>

      <ComponentSchemaForm
        action="PUT"
        initialValues={component}
        resourceId={_id}
      />
    </>
  )
}

export default ComponentEdit

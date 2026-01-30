import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ComponentContentForm } from '~modules/content'
import { fetchComponentContentById } from '~api/componentContent'
import type { ComponentContentApiPayloadItem } from '~api/componentContent'

const ComponentContentEdit = () => {
  const { _id } = useParams()
  const [component, setComponent] = useState<ComponentContentApiPayloadItem | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (_id) {
        const data = await fetchComponentContentById(_id)
        setComponent(data)
      }
    }
    fetchData()
  }, [_id])

  if (!component) return <p>Loading...</p>

  return (
    <>
      <small>
        Component content |<Link to={`/component-content/${component.schemaId}/list`}>{component.componentName}</Link> |
        {component.title}
      </small>

      <h1>Edit {component.title} component</h1>
      <ComponentContentForm
        action="PUT"
        initialValues={{ ...component, props: component.props || {} }}
        resourceId={_id ?? null}
      />
    </>
  )
}

export default ComponentContentEdit

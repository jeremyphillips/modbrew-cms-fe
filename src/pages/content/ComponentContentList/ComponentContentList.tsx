import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '~elements'
import { deleteComponentContent } from '~api/componentContent'
import { fetchSchemaWithContent } from '~api/componentSchema'
import type { ComponentSchemaApiPayload, ComponentSchemaApiPayloadItem } from '~api/componentSchema'
import type { ComponentContentApiPayload, ComponentContentApiPayloadItem } from '~api/componentContent'

const ComponentContentList = () => {
  const { _id } = useParams()
  const [componentSchema, setComponentSchema] = useState<ComponentSchemaApiPayloadItem| null>(null)
  const [entries, setEntries] = useState<ComponentSchemaApiPayload>([])

useEffect(() => {
  const getSchemaData = async () => {
    try {
      const { schema, entries } = await fetchSchemaWithContent(_id)
      setComponentSchema(schema)
      setEntries(entries || [])
    } catch (err) {
      console.error('Failed to fetch schema with content', err)
      setEntries([])
    }
  }

  getSchemaData()
}, [_id])

  if (!componentSchema) {
    return <h1>Loading...</h1>
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteComponentContent(id)
      setEntries((prevComponents: ComponentContentApiPayload) => 
        prevComponents.filter((component: ComponentContentApiPayloadItem) => component._id !== id))
    } catch (error) {
      console.error('Error deleting component schema:', error)
    }
  }

  return (
    <div>
      <h1>All {componentSchema.name} Components</h1>
      <Link to={`/component-content/${_id}/create`}>Create a new {componentSchema.name} component</Link> 
      {entries.length === 0 ? (
        <p>No {componentSchema.name} components yet.</p>
      ) : (
        <ul>
          {entries && entries.map((entry: ComponentSchemaApiPayloadItem) => (
            <li key={entry._id}>
              <Link to={`/component-content/${entry._id}/edit`}>
                {entry.title}
              </Link>
              <Button 
                onClick={() => handleDelete(entry._id)}
                text="Delete"
                size="sm"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ComponentContentList

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllComponentSchemas} from '~api/componentSchema'
import type { ComponentSchema } from '~api/componentSchema'

const ComponentContentTypesList = () => {
  const [components, setComponents] = useState<ComponentSchema[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getComponents = async () => {
      try {
        const data = await fetchAllComponentSchemas({ sortBy: 'name', sortOrder: 'ASC' })
        setComponents(data as ComponentSchema[])
      } catch (err) {
        console.error('Failed to fetch component schemas', err)
        setComponents([])
      } finally {
        setLoading(false)
      }
    }

    getComponents()
  }, [])

  if (loading) {
    return <p>Loading component types...</p>
  }

  return (
    <>
      <h1>Component Types</h1>
      {components.length === 0 ? (
        <div>
          <p>No component schemas have been created.</p>
          <Link to="/component-schemas/create">Create component schema</Link>
        </div>
      ) : (
        <ul>
          {components.map((component) => (
            <li key={component._id} className="mb-4">
              <h3 className="font-semibold">{component.name}</h3>
              {component.description && <p className="text-sm text-gray-700">{component.description}</p>}
              <Link
                className="text-blue-500 hover:underline"
                to={`/component-content/create/${component._id}`}
              >
                Create {component.name} entry
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default ComponentContentTypesList

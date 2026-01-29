import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllComponentSchemas } from '~api/componentSchema'
import type { ComponentSchemaApiPayload, ComponentSchemaApiPayloadItem } from '~api/componentSchema'

const Aside = () => {
  const [componentTypes, setComponentTypes] = useState<ComponentSchemaApiPayload>([])

  useEffect(() => {
    const getComponentTypes = async () => {
      try {
        // Fetch all component schemas sorted by `title`
        const schemas = await fetchAllComponentSchemas({ sortBy: 'title', sortOrder: 'ASC' })
        setComponentTypes(schemas as ComponentSchemaApiPayload)
      } catch (err) {
        console.error('Failed to fetch component schemas', err)
      }
    }

    getComponentTypes()
  }, [])

  return (
    <aside className="bg-gray-700 text-white p-4">
      {/* Schema Section */}
      <h3 className="font-bold text-1xl mb-1">Schema</h3>
      <nav>
        <ul>
          <li>
            <Link to="/component-schemas">All Component Schemas</Link>
          </li>
          <li>
            <Link to="/component-schemas/create">Create Component Schema</Link>
          </li>
        </ul>
      </nav>  
      
      {/* Content Section */}
      <h3 className="font-bold text-1xl mt-3 mb-1">Content</h3>
      <nav>
        <ul>
          <li>
            <span>Component Types</span>
            <ul className="pl-5">
              {componentTypes.map((component: ComponentSchemaApiPayloadItem) => (
                <li key={component._id}>
                  <Link to={`/component-content/${component._id}/list`}>{component.name}</Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <Link to="/page-content">All Pages</Link>
          </li>
          <li>
            <Link to="/page-content/create">Create New Page</Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Aside

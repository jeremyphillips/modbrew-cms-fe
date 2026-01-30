import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '~elements'
import { fetchAllComponentSchemas, deleteComponentSchema } from '~api/componentSchema'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid'
import type { ComponentSchemaApiPayloadItem } from '~api/componentSchema'

const ComponentSchemaList = () => {
  const [components, setComponents] = useState<ComponentSchemaApiPayloadItem[]>([])

  useEffect(() => {
    const getComponents = async () => {
      try {
        // Type assertion ensures TS knows this is always an array of objects
        const data = (await fetchAllComponentSchemas({
          sortBy: 'name',
          sortOrder: 'DESC',
        })) as ComponentSchemaApiPayloadItem[]
        setComponents(data)
      } catch (error) {
        console.error('Error fetching component schemas:', error)
        setComponents([])
      }
    }

    getComponents()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteComponentSchema(id)
      setComponents(prev => prev.filter(component => component._id !== id))
    } catch (error) {
      console.error('Error deleting component schema:', error)
    }
  }

  return (
    <>
      <h1>All Component Schemas</h1>

      <div className="flex justify-end gap-2">
        <Button
          href="/component-schemas/create"
          text="Create New Component"
          icon={<PlusIcon className="size-5" />}
          size="sm"
          theme="secondary"
        />
      </div>

      {components.length === 0 ? (
        <p className="mt-5">No component schemas have been created.</p>
      ) : (
        <ul className="mt-5 flex flex-col gap-2">
          {components.map(component => (
            <li key={component._id} className="flex items-center justify-between gap-4 p-2 border rounded">
              <div>
                <strong>
                  <Link to={`/component-schemas/${component._id}`}>{component.name}</Link>
                </strong>
                {component.description && <small className="ml-2 text-gray-500">{component.description}</small>}
              </div>

              <Button
                text="Delete"
                onClick={() => handleDelete(component._id)}
                hideTitle
                icon={<TrashIcon className="size-4" />}
                size="sm"
                theme="danger"
              />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default ComponentSchemaList

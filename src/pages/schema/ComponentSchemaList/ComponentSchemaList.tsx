import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '~elements'
import { fetchAllComponentSchemas, deleteComponentSchema } from '~api/componentSchema'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid'
import type { ComponentContentApiPayloadItem } from '~api/componentContent'
import type { ComponentSchema } from '~api/componentSchema'

const ComponentList = () => {
  const [components, setComponents] = useState<ComponentSchema[] | []>([])

  useEffect(() => {
    const getComponents = async () => {
      const data: ComponentSchema[] = 
        await fetchAllComponentSchemas({ sortBy: 'name', sortOrder: 'DESC' })
      // console.log('data =>',data)
      setComponents(data)
    }

    getComponents()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteComponentSchema(id)
      setComponents(prevComponents => prevComponents.filter(component => component._id !== id))
    } catch (error) {
      console.error('Error deleting component schema:', error)
    }
  }

  return (
    <>
      <h1>All Component Schemas</h1>
      <div className="flex justify-end gap-2">
        <Button
          href='/component-schemas/create'
          text='Create New Component'
          icon={<PlusIcon className='size-5' />}
          size='sm'
          theme='secondary'
        />
      </div>  
      {components.length === 0 ? (
        <p>No Component schema has been created.</p>
      ):(
        <ul className='mt-5'>
          {components.map((component: ComponentContentApiPayloadItem) => (
            <li key={component._id} className='flex gap-4'>
              <strong>
                <Link to={`/component-schemas/${component._id}`}>{component?.name}</Link>
              </strong> <small>{component?.description}</small>
              <Button
                text='Delete'
                onClick={() => handleDelete(component._id)}
                hideTitle
                icon={<TrashIcon className='size-4' />}
                size='sm'
              />
            </li>  
          ))}
        </ul>
      )}
    </>
  )
}

export default ComponentList

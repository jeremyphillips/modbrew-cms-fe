import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createComponentSchema, updateComponentSchema } from '~api/componentSchema'
import { createComponentContent, updateComponentContent } from '~api/componentContent'
import { createPage, updatePage } from '~api/pageContent'
import type { AlertBarProps } from 'components/elements/AlertBar/AlertBar'
import type { EndpointType, FormActionType } from '~api/base'
import type { ComponentSchemaApiPayloadItem } from '~api/componentSchema'
import type { ComponentContentApiPayloadItem } from '~api/componentContent'
import type { PageContent } from '~api/pageContent'

type ResourceMap = {
  'component-schemas': ComponentSchemaApiPayloadItem
  'component-content': ComponentContentApiPayloadItem
  'page-content': PageContent
}

type CreateFn<T extends EndpointType> = (data: Record<string, unknown>) => Promise<ResourceMap[T]>
type UpdateFn<T extends EndpointType> = (id: string, data: Record<string, unknown>) => Promise<ResourceMap[T]>

const useResourceActions = () => {
  const navigate = useNavigate()
  const [alert, setAlert] = useState<AlertBarProps | null>(null)

  const createFunctions: {
    [K in EndpointType]: CreateFn<K>
  } = {
    'component-schemas': createComponentSchema,
    'component-content': createComponentContent,
    'page-content': createPage,
  }

  const updateFunctions: {
    [K in EndpointType]: UpdateFn<K>
  } = {
    'component-schemas': updateComponentSchema,
    'component-content': updateComponentContent,
    'page-content': updatePage,
  }

  const handleAction = async <T extends EndpointType>(
    endpoint: T,
    action: FormActionType,
    newResource: Record<string, unknown>,
    resourceId?: string
  ) => {
    try {
      let result: ResourceMap[T]

      if (action === 'CREATE') {
        result = await createFunctions[endpoint](newResource)

        if (endpoint === 'component-schemas') {
          const res = result as ComponentSchemaApiPayloadItem
          setAlert({
            id: Date.now().toString(),
            message: `${res.name} created successfully.`,
            status: 'success',
          })
          navigate(`/${endpoint}/${res._id}/edit`)
          // page-content endpoint not ready yet
          //
          // } else if (endpoint === 'page-content') {
          //   const res = result as PageContent;
          //   setAlert({
          //     id: Date.now().toString(),
          //     message: `${res.name} created successfully.`,
          //     status: 'success'
          //   });
        } else {
          // component-content
          setAlert({
            id: Date.now().toString(),
            message: `Content created successfully.`,
            status: 'success',
          })
        }
      } else if (action === 'PUT' && resourceId) {
        result = await updateFunctions[endpoint](resourceId, newResource)

        if (endpoint === 'component-schemas') {
          const res = result as ComponentSchemaApiPayloadItem
          setAlert({
            id: Date.now().toString(),
            message: `${res.id} updated successfully.`,
            status: 'success',
          })
          // page-content endpoint not ready yet
          //
          // } else if (endpoint === 'page-content') {
          //   const res = result as PageContent
          //   setAlert({
          //     id: Date.now().toString(),
          //     message: `${res.id} updated successfully.`,
          //     status: 'success'
          //   })
        } else {
          // component-content
          setAlert({
            id: Date.now().toString(),
            message: `Content updated successfully.`,
            status: 'success',
          })
        }
      }
    } catch (error) {
      console.error(`Error with ${action} on ${endpoint}:`, error)
      setAlert({
        id: Date.now().toString(),
        message: `There was an error ${action === 'CREATE' ? 'creating' : 'updating'} ${endpoint}.`,
        status: 'error',
      })
    }
  }

  const clearAlert = () => setAlert(null)

  return { handleAction, alert, clearAlert }
}

export default useResourceActions

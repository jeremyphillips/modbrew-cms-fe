import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createComponentSchema, updateComponentSchema } from '~api/componentSchema'
import { createComponentContent, updateComponentContent } from '~api/componentContent'
import { createPage, updatePage } from '~api/pageContent'
import type { AlertProps } from 'components/AlertBar/AlertBar'
import type { ApiPayloadItem, EndpointType, FormActionType } from '~api/base'

type Resource = Pick<ApiPayloadItem, '_id' | 'id' | 'name'>

interface UseResourceActionsReturn {
  handleAction: (
    endpoint: EndpointType, 
    action: FormActionType, 
    newResource: Record<string, unknown>,
    resourceId?: string
  ) => void
  alert: AlertProps
  clearAlert: () => void
}

type CreateFn = (data: Record<string, unknown>) => Promise<Resource>
type UpdateFn = (id: string, data: Record<string, unknown>) => Promise<Resource>

export const useResourceActions = (): UseResourceActionsReturn => {
  const navigate = useNavigate()
  const [alert, setAlert] = useState<AlertProps | null>(null)

  const createFunctions: Record<EndpointType, CreateFn> = {
    'component-schemas': createComponentSchema,
    'component-content': createComponentContent,
    'page-content': createPage
  }

  const updateFunctions: Record<EndpointType, UpdateFn> = {
    'component-schemas': updateComponentSchema,
    'component-content': updateComponentContent,
    'page-content': updatePage
  }

  const handleAction = async (
    endpoint: EndpointType,
    action: FormActionType,
    newResource: Record<string, unknown>,
    resourceId?: string
  ) => {
    try {
      let result: Resource
      if (action === 'CREATE') {
        const createFn = createFunctions[endpoint]
        result = await createFn(newResource)
        setAlert({
          id: Date.now(),
          message: `${result.name} component schema has been published.`,
          status: 'success'
        })
        navigate(`/${endpoint}/${result._id}/edit`)
      } else if (action === 'PUT' && resourceId) {
        const updateFn = updateFunctions[endpoint]
        result = await updateFn(resourceId, newResource)
        setAlert({
          id: Date.now(),
          message: `${result.id} has been updated successfully.`,
          status: 'success'
        })
      }
    } catch (error) {
      console.error(`Error with ${action} on ${endpoint}:`, error)
      setAlert({
        id: Date.now(),
        message: `There was an error ${action === 'CREATE' ? 'creating' : 'updating'} ${endpoint}.`,
        status: 'error'
      })
    }
  }

  const clearAlert = () => setAlert(null)

  return { handleAction, alert, clearAlert }
}
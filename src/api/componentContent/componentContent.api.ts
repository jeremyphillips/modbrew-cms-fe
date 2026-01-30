import { apiFetch } from '~api/base'
import type { ComponentContentApiPayload, ComponentContentApiPayloadItem } from '~api/componentContent'

export const fetchAllComponentContent = async (filters?: {
  schemaId?: string
}): Promise<ComponentContentApiPayload> => {
  let url = '/component-content'
  if (filters?.schemaId) url += `?schemaId=${filters.schemaId}`
  return apiFetch(url)
}

export const fetchComponentContentById = async (id: string): Promise<ComponentContentApiPayloadItem> =>
  apiFetch(`/component-content/${id}`)

export const createComponentContent = async (
  data: Partial<ComponentContentApiPayloadItem>
): Promise<ComponentContentApiPayloadItem> =>
  apiFetch('/component-content', { method: 'POST', body: JSON.stringify(data) })

export const updateComponentContent = async (
  id: string,
  data: Partial<ComponentContentApiPayloadItem>
): Promise<ComponentContentApiPayloadItem> =>
  apiFetch(`/component-content/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const deleteComponentContent = async (id: string): Promise<void> =>
  apiFetch(`/component-content/${id}`, { method: 'DELETE' })

export const bulkUpdateComponentContent = async (updates: Partial<ComponentContentApiPayloadItem>[]): Promise<void> =>
  apiFetch('/component-content/bulk-update', { method: 'PUT', body: JSON.stringify(updates) })

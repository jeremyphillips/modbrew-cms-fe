import { apiFetch } from '~api/base'
import type { SortByType, SortOrderType } from '~api/base'
import type {
  ComponentSchemaApiPayload,
  ComponentSchemaApiPayloadItem,
  ComponentSchemaFormPayload,
  FetchAllComponentSchemasOptions,
  NormalizedComponentSchemaPayload,
  SchemaWithContent
} from '~api/componentSchema'
import type { ComponentContentApiPayload } from '~api/componentContent'

export const fetchAllComponentSchemas = async (
  options: FetchAllComponentSchemasOptions = {}
): Promise<ComponentSchemaApiPayload | string[]> => {
  const { sortBy, sortOrder, property } = options

  const params = new URLSearchParams()
  if (sortBy) params.append('sortBy', sortBy)
  if (sortOrder) params.append('sortOrder', sortOrder)

  const url = `/component-schemas${params.toString() ? '?' + params.toString() : ''}`
  const data = await apiFetch<ComponentSchemaApiPayload>(url)
  if (property) {
    // Return array of values for the requested property
    return data.map((item: ComponentSchemaApiPayloadItem) => item[property]).filter(Boolean) as string[]
  }

  return data
}

export const fetchComponentSchemaById = async (id: string): Promise<ComponentSchemaApiPayload> =>
  apiFetch(`/component-schemas/${id}`)

export const fetchAllComponentSchemaIds = async (
  sortBy: SortByType = 'title',
  sortOrder: SortOrderType = 'ASC'
): Promise<string[]> => {
  const url = `/component-schemas?sortBy=${sortBy}&sortOrder=${sortOrder}`
  const data = await apiFetch<any[]>(url)

  // Map only existing ids
  return data
    .map((item: ComponentSchemaApiPayloadItem) => item.id)
    .filter(Boolean) as string[]
}

/**
 * Fetch a component schema and all its associated content entries
 */
export const fetchSchemaWithContent = async (_id: string): Promise<SchemaWithContent> => {
  // fetch schema
  const schema = await apiFetch<ComponentSchemaApiPayload>(`/component-schemas/${_id}`)

  // fetch all component content for this schema
  const entries = await apiFetch<ComponentContentApiPayload>(`/component-content?schemaId=${_id}`)

  return { schema, entries }
}

/**
 * Create a new component schema
 * @param data - Partial form payload from UI
 * @returns The created component schema from API
 */
export const createComponentSchema = async (
  data: Partial<ComponentSchemaFormPayload>
): Promise<ComponentSchemaApiPayloadItem> => {
  return apiFetch<ComponentSchemaApiPayloadItem>('/component-schemas', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Update an existing component schema by ID
 * @param id - The schema's MongoDB _id
 * @param data - Partial form payload from UI
 * @returns The updated component schema from API
 */
export const updateComponentSchema = async (
  id: string,
  data: Partial<NormalizedComponentSchemaPayload>
): Promise<ComponentSchemaApiPayloadItem> => {
  return apiFetch<ComponentSchemaApiPayloadItem>(`/component-schemas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

/**
 * Delete a component schema by ID
 * @param id - The schema's MongoDB _id
 */
export const deleteComponentSchema = async (id: string): Promise<void> => {
  return apiFetch<void>(`/component-schemas/${id}`, { method: 'DELETE' })
}
import type { ComponentSchemaApiPayloadItem } from '~api/contentSchema'
import type { ComponentContentApiPayloadItem } from '~api/componentContent'
import type { PageContent } from '~api/pageContent'

export type SortByType = 'title' | 'name' | 'createdAt' | 'updatedAt'
export type SortOrderType = 'ASC' | 'DESC'

export type EndpointType = 'component-schemas' | 'component-content' | 'page-content'

export type ApiActionType = 'CREATE' | 'PUT' | 'DELETE'
export type FormActionType = Extract<ApiActionType, 'CREATE' | 'PUT'>

export type ApiPayload = ComponentSchemaApiPayloadItem[] | ComponentContentApiPayloadItem[] | PageContent[]
export type ApiPayloadItem = ComponentSchemaApiPayloadItem | ComponentContentApiPayloadItem | PageContent
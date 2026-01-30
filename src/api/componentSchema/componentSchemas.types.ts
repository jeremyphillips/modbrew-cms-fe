import type { SortByType, SortOrderType } from '~api/base'
import type { ComponentContentApiPayloadItem } from '../componentContent/componentContent.types'

export type FieldType = 'CheckBox' | 'File' | 'Number' | 'Repeater' | 'Select' | 'Text' | 'Textarea' | 'TextNameIdPair'

export interface ComponentSchemaFieldOption {
  label: string
  value: string
}

export interface ComponentSchemaFieldValidation {
  minLength: number | null
  maxLength: number | null
}

export interface ComponentSchemaField {
  name: string // display name
  _id: string
  id: string // stable ID used in props
  description?: string
  fieldType: FieldType
  uiType?: boolean
  required: boolean
  defaultValue?: string
  validation: ComponentSchemaFieldValidation
  options?: ComponentSchemaFieldOption[]
}

export interface ComponentSchemaBase {
  id: string
  name: string
  description?: string
  category?: string
  schema: ComponentSchemaField[]
}

export interface ComponentSchemaFormPayload extends ComponentSchemaBase {
  allowedChildren?: string[]
  maxInstances?: number | string | null
}

export interface NormalizedComponentSchemaPayload extends ComponentSchemaBase {
  allowedChildren: string[]
  maxInstances: number | null
}

export interface ComponentSchemaApiPayloadItem extends ComponentSchemaBase {
  _id: string
  allowedChildren?: string[]
  maxInstances?: number
  createdAt: string
  updatedAt: string
}

export type ComponentSchemaApiPayload = ComponentSchemaApiPayloadItem[] | []

export interface FetchAllComponentSchemasOptions {
  sortBy?: SortByType
  sortOrder?: SortOrderType
  property?: keyof ComponentSchemaApiPayloadItem
}

export interface SchemaWithContent {
  schema: ComponentSchemaApiPayloadItem
  entries: ComponentContentApiPayloadItem[]
}

export interface ComponentSchemaFieldForm extends ComponentSchemaField {
  idModified: boolean
}

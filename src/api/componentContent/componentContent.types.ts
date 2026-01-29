import { ComponentSchemaField } from '~api/componentSchema'

export type ComponentContentPrimitive =
  | string
  | boolean
  | number
  | null

export type ComponentContentValue =
  | ComponentContentPrimitive
  | ComponentContentRepeaterValue

export type ComponentContentRepeaterValue =
  Array<Record<string, ComponentContentValue>>

export type ComponentContentProps = Record<string, ComponentContentValue>

export interface ComponentContentBase {
  componentName: string
  title: string
  props: ComponentContentProps
  schemaId: string
}

export interface NormalizedComponentContent
  extends ComponentContentBase {
  id?: string
}

export interface ComponentContentApiPayloadItem
  extends ComponentContentBase {
  _id: string
  createdAt?: string
  updatedAt?: string
}

export type ComponentContentApiPayload =
  ComponentContentApiPayloadItem[]

export interface ComponentContentFormPayload
  extends ComponentContentBase {
  id?: string
}

export interface ComponentContentFormState {
  schema: ComponentSchemaField[]
  id?: string
}

import type { ChangeEvent } from 'react'
import { useDirtySnapshot, useNormalizedSubmit, useResourceActions } from '~hooks/shared'
import { useComponentContentForm } from '~hooks/content'
import { Button, Fieldset, ResourceAlert } from '~elements'
import * as Fields from '~elements/Fieldset/fields'
import type { FormActionType } from '~api/base'
import type { NormalizedComponentContent, ComponentContentProps, ComponentContentValue } from '~api/componentContent'
import type { FieldType } from '~api/componentSchema'

interface ComponentContentFormProps {
  initialValues?: NormalizedComponentContent
  action: FormActionType
  resourceId: string | null
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const FieldsMap: Partial<Record<FieldType, React.ComponentType<any>>> = {
  Text: Fields.Text,
  Textarea: Fields.Textarea,
  Select: Fields.Select,
  CheckBox: Fields.CheckBox,
  File: Fields.File,
  Repeater: Fields.Repeater,
  Number: Fields.NumberInput, // optional
  TextNameIdPair: Fields.TextNameIdPair, // optional
}

const ComponentContentForm = ({ action, initialValues, resourceId = null }: ComponentContentFormProps) => {
  const { handleAction, alert } = useResourceActions()

  const { schema, title, props, setProps } = useComponentContentForm({
    initialValues,
    defaultSchemaId: resourceId,
  })

  const buildContentPayload = () => ({
    componentName: schema?.id ?? '',
    title,
    props,
    schemaId: schema?._id ?? '',
  })

  const normalizeContentPayload = (payload: { props: ComponentContentProps } & Record<string, unknown>) => ({
    ...payload,
    props: Object.keys(payload.props)
      .sort()
      .reduce<Record<string, ComponentContentValue>>((acc, key) => {
        acc[key] = payload.props[key]
        return acc
      }, {}),
  })

  const { isDirty, resetDirty } = useDirtySnapshot({
    buildPayload: buildContentPayload,
    normalize: normalizeContentPayload,
    deps: [title, props, schema],
  })

  const { submit } = useNormalizedSubmit({
    resource: 'component-content',
    action,
    resourceId: action === 'PUT' && resourceId ? resourceId : undefined,
    buildPayload: buildContentPayload,
    normalize: normalizeContentPayload,
    onAfterSubmit: resetDirty,
    handleAction,
  })

  const handlePropsChange = (id: string, value: ComponentContentValue) => {
    setProps(prev => ({ ...prev, [id]: value }))
  }

  return (
    <form onSubmit={submit}>
      <ResourceAlert alert={alert} />

      {schema?.schema?.length ? (
        <Fieldset>
          {schema.schema.map(field => {
            const FieldComponent = FieldsMap[field.fieldType]
            if (!FieldComponent) return null

            // Determine the correct type for the onChange event/value
            const handleChange = (
              e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | string | number | boolean
            ) => {
              // Extract value from DOM event
              const value = typeof e === 'object' && 'target' in e && e.target ? e.target.value : e // already a value for custom components
              handlePropsChange(field.id, value as ComponentContentValue)
            }

            return (
              <fieldset key={field._id || field.id}>
                <label>{field.name || field.id}</label>
                <FieldComponent value={props[field.id] ?? ''} onChange={handleChange} {...field.validation} />
              </fieldset>
            )
          })}
        </Fieldset>
      ) : (
        <p>Loading schema…</p>
      )}

      <Button
        type="submit"
        text={action === 'CREATE' ? 'Create component' : 'Save component'}
        theme="primary"
        disabled={!isDirty || !schema}
      />
    </form>
  )
}

export default ComponentContentForm

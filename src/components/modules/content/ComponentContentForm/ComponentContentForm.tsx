import { useDirtySnapshot, useNormalizedSubmit, useResourceActions } from '~hooks/shared'
import { useComponentContentForm } from '~hooks/content'
import { Button, Fieldset, ResourceAlert } from '~elements'
import * as Fields from '~fieldset/fields'
import type { FormActionType } from '~api/base'
import type { NormalizedComponentContent, ComponentContentProps, ComponentContentValue } from '~api/componentContent'
import type { ComponentSchemaField, FieldType } from '~api/componentSchema'

interface ComponentContentFormProps {
  initialValues?: NormalizedComponentContent
  action: FormActionType
  resourceId: string | null
}

const FieldsMap: Record<FieldType, React.ComponentType<any>> = {
  Text: Fields.Text,
  Textarea: Fields.Textarea,
  Select: Fields.Select,
  CheckBox: Fields.CheckBox,
  File: Fields.File,
  Repeater: Fields.Text, // or placeholder
}

const ComponentContentForm = ({
  action,
  initialValues = {},
  resourceId = null
}: ComponentContentFormProps) => {
  const { handleAction, alert } = useResourceActions()

  const {
    componentSchemas,
    title, 
    // setTitle,
    props, setProps
  } = useComponentContentForm(initialValues, resourceId)

  const buildContentPayload = () => ({
    componentName: componentSchemas.id || componentSchemas._id,
    title,
    props,
    schemaId: componentSchemas._id
  })

  const normalizeContentPayload = (
    payload: { props: ComponentContentProps } & Record<string, unknown>
  ) => ({
    ...payload,
    props: Object.keys(payload.props)
      .sort()
      .reduce<Record<string, ComponentContentValue>>((acc, key) => {
        acc[key] = payload.props[key]
        return acc
      }, {})
  })

  const { isDirty, resetDirty } = useDirtySnapshot({
    buildPayload: buildContentPayload,
    normalize: normalizeContentPayload,
    deps: [title, props, componentSchemas]
  })

  const submitBtnText = 
    action === 'CREATE' ? 'Create new component' :
    action === 'PUT' ? 'Save component' : ''

  const handlePropsChange = (fieldId: string, value: ComponentContentValue) => {
    setProps((prev: ComponentContentProps) => ({ ...prev, [fieldId]: value }))
  }

  const { submit } = useNormalizedSubmit({
    resource: 'component-content',
    action,
    resourceId: action === 'PUT' ? resourceId : null,
    buildPayload: buildContentPayload,
    normalize: normalizeContentPayload,
    onAfterSubmit: resetDirty,
    handleAction 
  })

  return (
    <form onSubmit={submit}>
      <ResourceAlert alert={alert} />

      {componentSchemas?.schema?.length ? (
        <Fieldset>
          {componentSchemas.schema.map((field: ComponentSchemaField) => {
            const FieldComponent = FieldsMap[field.fieldType]

            return (
              <fieldset key={field._id || field.id}>
                <label htmlFor={field.name}>{field.name || field.id}</label>
                <FieldComponent
                  value={props[field.id] ?? ''}
                  onChange={(e) => handlePropsChange(field.id, e.target.value)}
                  {...field.validation}
                />
              </fieldset>
            )
          })}
        </Fieldset>
      ) : (
        <p>Loading schema fields...</p>
      )}

      <Button
        type='submit'
        text={submitBtnText}
        theme='primary'
        disabled={!isDirty || !componentSchemas}
      />
    </form>
  )
}

export default ComponentContentForm

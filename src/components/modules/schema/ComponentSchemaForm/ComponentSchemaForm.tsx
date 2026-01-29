import { Button, Fieldset, Modal, ResourceAlert } from '~elements'
import { CheckBox, Number, Select, Textarea, TextNameIdPair } from '~fieldset/fields'
import { ComponentSchemaPropsRepeater } from '~modules/schema'
import {
  useComponentSchemaForm,
  useComponentSchemaPropsRepeater,
  useSyncComponentSchema
} from '~hooks/schema'
import { useDirtySnapshot, useModal, useNormalizedSubmit, useResourceActions } from '~hooks/shared'
import { sanitizeToCase } from '~utils'
import { PlusIcon } from '@heroicons/react/24/solid'
import type { FormActionType } from '~api/base'
import type {
  ComponentSchemaFormPayload,
  NormalizedComponentSchemaPayload,
  ComponentSchemaFieldForm
} from '~api/componentSchema'

interface ComponentSchemaFormProps {
  initialValues: ComponentSchemaFormPayload
  action: FormActionType
  resourceId: string | null
}

const ComponentSchemaForm = ({ 
  action,
  initialValues = {},
  resourceId = null
}: ComponentSchemaFormProps) => {
  // const [existingComponentSchemas, setExistingComponentSchemas] = useState<any[]>([])
  // const [initialSnapshot, setInitialSnapshot] = useState<string | null>(null)

  const fieldTypes = ['CheckBox', 'File', 'Repeater', 'Select', 'Text', 'Textarea']
  const categoryOptions = ['Basic Elements', 'Advanced Elements', 'Layout', 'Media']
  const { handleAction, alert } = useResourceActions()
  const { isModalOpen, openModal, closeModal } = useModal()
  const { syncSchema } = useSyncComponentSchema()

  // useEffect(() => {
  //   const fetchSchemas = async () => {
  //     const schemas = await fetchAllComponentSchemas()
  //     setExistingComponentSchemas(schemas)
  //   };

  //   fetchSchemas()
  // }, [])

  const {
    componentName, setComponentName,
    componentId, setComponentId,
    componentDescription, setComponentDescription,
    category, setCategory,
    // schema, setSchema,
    allowedChildren,
    // setAllowedChildren,
    maxInstances, setMaxInstances,
    componentIdModified, setComponentIdModified,
    allowedChildrenOptions, toggleAllowedChildren
  } = useComponentSchemaForm(initialValues)

  const { 
    schemaFields, addSchemaField, 
    updateSchemaField, addSelectOption, removeSelectOption 
  } = useComponentSchemaPropsRepeater(initialValues.schema)

  const buildComponentPayload = () => ({
    allowedChildren: allowedChildren || [],
    category,
    description: componentDescription,
    id: componentId,
    name: componentName,
    maxInstances,
    schema: schemaFields.map((field: any) => ({
      name: field.name,
      id: field.id,
      description: field.description,
      fieldType: field.fieldType,
      options: field.options,
      uiType: field.uiType,
      required: field.required,
      defaultValue: field.defaultValue,
      validation: {
        minLength: field.minLength,
        maxLength: field.maxLength
      }
    }))
  })

  const normalizePayload = (
    payload: ComponentSchemaFormPayload
  ): NormalizedComponentSchemaPayload => ({
    ...payload,
    maxInstances: payload.maxInstances
      ? Number(payload.maxInstances)
      : null,
    allowedChildren: [...(payload.allowedChildren || [])].sort(),
    schema: payload.schema.map((field: ComponentSchemaFieldForm) => ({
      name: field.name,
      id: field.id,
      description: field.description,
      fieldType: field.fieldType,
      uiType: field.uiType,
      required: field.required,
      defaultValue: field.defaultValue,
      validation: {
        minLength: field.validation?.minLength ?? null,
        maxLength: field.validation?.maxLength ?? null
      },
      options: field.options
        ? field.options.map((o: { label: string; value: string }) => ({
            label: o.label,
            value: o.value
          }))
        : undefined
    }))
  })


  const { isDirty, resetDirty } = useDirtySnapshot({
    buildPayload: buildComponentPayload,
    normalize: normalizePayload,
    deps: [
      componentName,
      componentId,
      componentDescription,
      category,
      allowedChildren,
      maxInstances,
      schemaFields
    ]
  })

  const { submit } = useNormalizedSubmit({
    resource: 'component-schemas',
    action,
    resourceId,
    buildPayload: buildComponentPayload,
    normalize: normalizePayload,
    onBeforeSubmit: action === 'PUT'
      ? async () => {
          await syncSchema({
            schemaId: resourceId,
            prevSchema: initialValues.schema || [],
            nextSchema: schemaFields || []
          })
        }
      : undefined,
    onAfterSubmit: resetDirty,
    handleAction
  })

  const submitBtnText = 
    action === 'CREATE' ? 'Create new component schema' :
    action === 'PUT' ? 'Update component schema' : ''

  return (
    <form onSubmit={submit}>
      <ResourceAlert alert={alert} />

      <Fieldset legend="Component Details">
        <TextNameIdPair
          name={componentName}
          id={componentId}
          idModified={componentIdModified}
          idLabel="Component ID"
          nameLabel="Component Name"
          pascalCase={true}
          onNameChange={(value: string) => {
            setComponentName(value)
            if (!componentIdModified) {
              setComponentId(sanitizeToCase(value, true))
            }
          }}
          onIdChange={(value: string) => setComponentId(value)}
          onIdFocus={() => setComponentIdModified(true)}
        />

        <Textarea
          label="Description"
          value={componentDescription}
          onChange={setComponentDescription}
          placeholder="Description"
        />

        <Select
          id="categorySelect"
          label="Category"
          options={categoryOptions.map(opt => ({ label: opt, value: opt }))}
          value={category || ''}
          onChange={(e) => setCategory(e)}
          allowEmpty={true}
          emptyOptionLabel="Select Category"
        />

        <div>
          <legend>Allowed Children Components</legend>

          <div className="space-y-2">
            {allowedChildrenOptions.map((child: string) =>
              typeof child === 'string' ? (
                <CheckBox
                  key={child}
                  id={`child-${child}`}
                  label={child}
                  value={allowedChildren.includes(child) ? 1 : 0}
                  onChange={() => toggleAllowedChildren(child)}
                />
              ) : null
            )}
          </div>
        </div>

        <Number
          label="Max Instances"
          value={maxInstances}
          onChange={(e) => setMaxInstances(e.target.value)}
          min={1}
        />
      </Fieldset>

      <h3>Props</h3>
      <ComponentSchemaPropsRepeater
        componentSchemaId={resourceId}
        fields={schemaFields}
        onUpdateField={updateSchemaField}
        onAddOption={addSelectOption}
        onRemoveOption={removeSelectOption} 
      />

      <div className="flex justify-end gap-2">
        <Button 
          type="button"
          onClick={() => openModal()} 
          size="sm"
          text="Add new prop"
          theme='primary'
          icon={<PlusIcon className="size-5" />}
        />
      </div>  

      <Modal
        headline="Select Field Type"
        isOpen={isModalOpen}
        buttons={[
          {
            text: 'Cancel',
            onClick: closeModal,
            variant: 'secondary'
          }
        ]}
      >
        <div className='flex flex-wrap gap-2'>
          {fieldTypes.map((type) => (
            <Button 
              key={type} 
              onClick={() => {
                addSchemaField(type)
                closeModal()
              }} 
              text={type}
              theme='primary'
            />
          ))}
        </div>  
      </Modal>

      <hr className='mt-4 mb-4' />

      <Button 
        type="submit" 
        // onClick={handleOnSubmit}
        text={submitBtnText}
        theme='primary'
        disabled={!isDirty}
      />
    </form>
  )  
}

export default ComponentSchemaForm
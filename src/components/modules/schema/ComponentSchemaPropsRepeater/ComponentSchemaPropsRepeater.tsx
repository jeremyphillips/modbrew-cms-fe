import { useState } from 'react'
import { Button, Fieldset, Modal } from '~elements'
import { CheckBox, NumberInput, Text, Textarea, TextNameIdPair } from '~elements/Fieldset/fields'
import { useModal } from '~hooks/shared'
import { fetchAllComponentContent, bulkUpdateComponentContent } from '~api/componentContent'
import { TrashIcon } from '@heroicons/react/24/solid'
import type { ComponentContentValue } from '~api/componentContent'
import type { ComponentSchemaFieldForm, ComponentSchemaFieldOption } from '~api/componentSchema'

type FieldManagerProps = {
  componentSchemaId: string
  fields: ComponentSchemaFieldForm[]
  onUpdateField: <K extends keyof ComponentSchemaFieldForm>(
    index: number,
    key: K,
    value: ComponentSchemaFieldForm[K]
  ) => void
  onRemoveField: (index: number) => void
  onAddOption: (index: number) => void
  onRemoveOption: (fieldIndex: number, optionIndex: number) => void
}

const ComponentSchemaPropsRepeater = ({
  componentSchemaId,
  fields,
  onUpdateField,
  onRemoveField,
  onAddOption,
  onRemoveOption,
}: FieldManagerProps) => {
  const { isModalOpen, openModal, closeModal } = useModal()
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null)

  /** Remove field from all component content, then trigger onRemoveField */
  const removePropFromAllInstances = async (fieldId: string, index: number) => {
    try {
      const instances = await fetchAllComponentContent({ schemaId: componentSchemaId })

      const updates = instances
        .filter(instance => instance.props?.[fieldId] !== undefined)
        .map(instance => ({
          id: instance._id,
          props: Object.fromEntries(
            Object.entries(instance.props)
              .filter(([key]) => key !== fieldId)
              .map(([key, val]) => [key, val as ComponentContentValue])
          ),
        }))

      if (updates.length) {
        await bulkUpdateComponentContent(updates)
      }

      onRemoveField(index)
    } catch (err) {
      console.error('Failed to delete schema prop:', err)
    } finally {
      setPendingDeleteIndex(null)
    }
  }

  /** Update normal field values (not validation) */
  const updateFieldValue = <K extends Exclude<keyof ComponentSchemaFieldForm, 'validation'>>(
    index: number,
    key: K,
    value: ComponentSchemaFieldForm[K]
  ) => {
    onUpdateField(index, key, value)
  }

  /** Dedicated updater for validation object */
  const updateValidation = (index: number, value: Partial<ComponentSchemaFieldForm['validation']>) => {
    const merged = {
      minLength: fields[index].validation?.minLength ?? null,
      maxLength: fields[index].validation?.maxLength ?? null,
      ...value,
    }
    onUpdateField(index, 'validation', merged)
  }

  /** Update a select/check option */
  const updateOption = (fieldIndex: number, optIndex: number, key: keyof ComponentSchemaFieldOption, value: string) => {
    const field = fields[fieldIndex]
    if (!field.options) return

    const updatedOptions = field.options.map((o, i) => (i === optIndex ? { ...o, [key]: value } : o))

    onUpdateField(fieldIndex, 'options', updatedOptions)
  }

  return (
    <>
      {fields.map((field, index) => (
        <Fieldset className="schema" key={field.id || index}>
          <Button
            className="absolute right-4 top-3"
            hideTitle
            icon={<TrashIcon className="size-5" />}
            text="Remove schema prop"
            size="sm"
            theme="secondary"
            onClick={() => {
              setPendingDeleteIndex(index)
              openModal()
            }}
          />

          <Text label="Field Type" value={field.fieldType} isReadOnly />

          <TextNameIdPair
            name={field.name}
            id={field.id}
            idModified={field.idModified}
            pascalCase={false}
            onNameChange={val => updateFieldValue(index, 'name', val)}
            onIdChange={val => updateFieldValue(index, 'id', val)}
          />

          <CheckBox
            id={`required-${index}`}
            isRequired
            label="Is Required?"
            value={field.required ? 1 : 0}
            onChange={(val: 0 | 1) => updateFieldValue(index, 'required', val === 1)}
          />

          <Textarea
            label="Description"
            value={field.description}
            onChange={val => updateFieldValue(index, 'description', val)}
          />

          <Text
            label="Default Value"
            value={field.defaultValue || ''}
            onChange={e => updateFieldValue(index, 'defaultValue', e.target.value)}
          />

          {(field.fieldType === 'Select' || field.fieldType === 'CheckBox') && field.options && (
            <>
              <label>Options</label>
              {field.options.map((option, optIndex) => (
                <div key={optIndex} className="select-option">
                  <Text
                    label="Label"
                    value={option.label}
                    onChange={e => updateOption(index, optIndex, 'label', e.target.value)}
                  />
                  <Text
                    label="Value"
                    value={option.value}
                    onChange={e => updateOption(index, optIndex, 'value', e.target.value)}
                  />
                  <Button type="button" text="Remove" onClick={() => onRemoveOption(index, optIndex)} />
                </div>
              ))}

              <Button type="button" text="Add Option" onClick={() => onAddOption(index)} />
            </>
          )}

          {(field.fieldType === 'Text' || field.fieldType === 'Textarea') && (
            <>
              <NumberInput
                label="Min Length"
                value={field.validation?.minLength ?? null}
                min={1}
                onChange={(value: number | null) => updateValidation(index, { minLength: value })}
              />

              <NumberInput
                label="Max Length"
                value={field.validation?.maxLength ?? null}
                min={1}
                onChange={(value: number | null) => updateValidation(index, { maxLength: value })}
              />
            </>
          )}
        </Fieldset>
      ))}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        width="md"
        headline="Delete component schema?"
        description="This action cannot be undone."
        buttons={[
          { id: 'cancel', text: 'Cancel', theme: 'secondary', onClick: closeModal },
          {
            id: 'confirm',
            text: 'Delete',
            theme: 'danger',
            onClick: () => {
              if (pendingDeleteIndex !== null) {
                removePropFromAllInstances(fields[pendingDeleteIndex].id, pendingDeleteIndex)
              }
              closeModal()
            },
          },
        ]}
      >
        <div className="text-sm text-gray-700">
          <p>This will:</p>
          <ul className="list-disc ml-5 mt-2">
            <li>Immediately remove this prop from all component content</li>
            <li>Mark the schema as changed</li>
          </ul>
          <strong className="block mt-2">You must save the schema to persist this change.</strong>
        </div>
      </Modal>
    </>
  )
}

export default ComponentSchemaPropsRepeater

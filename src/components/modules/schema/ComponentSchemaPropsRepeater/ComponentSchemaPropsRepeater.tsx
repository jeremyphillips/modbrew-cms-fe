import { useState } from 'react'
import { Button, Fieldset, Modal } from '~elements'
import { CheckBox, Number, Text, Textarea, TextNameIdPair } from '~fieldset/fields'
import { useModal } from '~hooks/shared'
import { fetchAllComponentContent, bulkUpdateComponentContent } from '~api/componentContent'
import { TrashIcon } from '@heroicons/react/24/solid'
import type { ComponentContentApiPayloadItem } from '~api/componentContent'
import type { ComponentSchemaFieldForm, ComponentSchemaFieldOption } from '~api/componentSchema'

type ComponentSchemaFieldFormKey = keyof ComponentSchemaFieldForm

type FieldManagerProps = {
  componentSchemaId: string
  fields: ComponentSchemaFieldForm[]
  onUpdateField: <K extends ComponentSchemaFieldFormKey>(
    index: number,
    key: K,
    value: ComponentSchemaFieldForm[K]
  ) => void
  onAddOption: (index: number) => void
  onRemoveOption: (fieldIndex: number, optionIndex: number) => void
}

const ComponentSchemaPropsRepeater = ({
  componentSchemaId,
  fields,
  onUpdateField,
  onAddOption,
  onRemoveOption
}: FieldManagerProps) => {
  const { isModalOpen, openModal, closeModal } = useModal()
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null)

  // Removes property from all component content instances
  const removePropFromAllInstances = async (fieldId: string) => {
    try {
      const instances = await fetchAllComponentContent({ schemaId: componentSchemaId })

      if (instances.length) {
        const updates = instances
          .filter((instance: ComponentContentApiPayloadItem) => instance.props?.[fieldId] !== undefined)
          .map((instance: ComponentContentApiPayloadItem) => ({
            id: instance._id,
            props: Object.fromEntries(
              Object.entries(instance.props).filter(([key]) => key !== fieldId)
            )
          }))

        if (updates.length) {
          await bulkUpdateComponentContent(updates)
        }
      }

      // Remove field locally
      if (pendingDeleteIndex !== null) {
        onUpdateField(pendingDeleteIndex, '__REMOVE__', null)
      }
    } catch (err) {
      console.error('Failed to delete schema prop:', err)
    } finally {
      setPendingDeleteIndex(null)
    }
  }

  return (
    <>
      {fields.map((field, index) => {
        const handleChange =
          <K extends keyof ComponentSchemaFieldForm>(key: K) =>
          (value: ComponentSchemaFieldForm[K]) => {
            if (key === 'validation') {
              onUpdateField(index, key, {
                ...field.validation,
                ...(value as ComponentSchemaFieldForm['validation'])
              })
            } else {
              onUpdateField(index, key, value)
            }
          }

        return (
          <Fieldset className="schema" key={field.id || index}>
            <Button
              className="absolute right-4 top-3"
              hideTitle
              icon={<TrashIcon className="size-5" />}
              text="Remove schema prop"
              onClick={() => {
                setPendingDeleteIndex(index)
                openModal()
              }}
              size="sm"
              theme="secondary"
            />

            <Text label="Field Type" value={field.fieldType} isReadOnly />
            <TextNameIdPair
              name={field.name}
              id={field.id}
              idModified={field.idModified}
              pascalCase={false}
              onNameChange={handleChange('name')}
              onIdChange={handleChange('id')}
            />

            <CheckBox
              id={`required-${index}`}
              isRequired
              label="Is Required?"
              value={field.required ? 1 : 0}
              onChange={(val: 0 | 1) => handleChange('required')(val === 1)}
            />

            <Textarea
              label="Description"
              value={field.description}
              onChange={handleChange('description')}
            />

            <Text
              label="Default Value"
              value={field.defaultValue}
              onChange={(e) => handleChange('defaultValue')(e.target.value)}
            />

            {(field.fieldType === 'Select' || field.fieldType === 'CheckBox') && field.options && (
              <>
                <label>Options</label>
                {field.options.map((option: ComponentSchemaFieldOption, optIndex: number) => (
                  <div key={optIndex} className="select-option">
                    <Text
                      label="Label"
                      value={option.label}
                      onChange={(e) =>
                        handleChange('options')(
                          field.options!.map((o, i) => (i === optIndex ? { ...o, label: e.target.value } : o))
                        )
                      }
                    />
                    <Text
                      label="Value"
                      value={option.value}
                      onChange={(e) =>
                        handleChange('options')(
                          field.options!.map((o, i) => (i === optIndex ? { ...o, value: e.target.value } : o))
                        )
                      }
                    />
                    <Button type="button" text="Remove" onClick={() => onRemoveOption(index, optIndex)} />
                  </div>
                ))}
                <Button type="button" text="Add Option" onClick={() => onAddOption(index)} />
              </>
            )}

            {(field.fieldType === 'Text' || field.fieldType === 'Textarea') && (
              <>
                <Number
                  label="Min Length"
                  value={field.validation?.minLength || null}
                  onChange={(e) => handleChange('validation')({ minLength: e.target.value })}
                  min={1}
                />
                <Number
                  label="Max Length"
                  value={field.validation?.maxLength || null}
                  onChange={(e) => handleChange('validation')({ maxLength: e.target.value })}
                  min={1}
                />
              </>
            )}
          </Fieldset>
        )
      })}

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
                removePropFromAllInstances(fields[pendingDeleteIndex].id)
              }
              closeModal()
            }
          }
        ]}
      >
        <div className="text-sm text-gray-700">
          <p>This will:</p>
          <ul className="list-disc ml-5 mt-2">
            <li>Immediately remove this prop from all component content</li>
            <li>Mark the schema as changed</li>
          </ul>
          <p>
            <strong className="block mt-2">You must save the schema to persist this change.</strong>
          </p>
        </div>
      </Modal>
    </>
  )
}

export default ComponentSchemaPropsRepeater

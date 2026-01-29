import { useState } from 'react'
import { sanitizeToCase } from '~utils'
import type { FieldType, ComponentSchemaFieldForm, ComponentSchemaFieldOption } from '~api/componentSchema'
import type { ComponentContentValue } from '~api/componentContent'

type UpdateKey = keyof ComponentSchemaFieldForm | '__REMOVE__'

export const useComponentSchemaPropsRepeater = (
  initialFields: ComponentSchemaFieldForm[] = []
) => {
  const [schemaFields, setSchemaFields] =
    useState<ComponentSchemaFieldForm[]>(initialFields)

  const addSchemaField = (fieldType: FieldType) => {
    const newField: ComponentSchemaFieldForm = {
      id: '',
      name: '',
      description: '',
      fieldType,
      uiType: false,
      required: false,
      defaultValue: '',
      options:
        fieldType === 'Select' || fieldType === 'CheckBox'
          ? []
          : undefined,
      idModified: false,
      validation: {
        minLength: null,
        maxLength: null
      }
    }

    setSchemaFields(prev => [...prev, newField])
  }

  const updateSchemaField = (
    index: number,
    key: UpdateKey,
    value: ComponentContentValue
  ) => {
    if (key === '__REMOVE__') {
      setSchemaFields(prev => prev.filter((_, i) => i !== index))
      return
    }

    setSchemaFields(prev =>
      prev.map((field, i) => {
        if (i !== index) return field

        const updatedField: ComponentSchemaFieldForm = {
          ...field,
          [key]: value
        }

        // Auto-generate ID from name unless manually modified
        if (key === 'name' && !field.idModified) {
          updatedField.id = sanitizeToCase(value, false)
        }

        // Mark ID as manually modified
        if (key === 'id') {
          updatedField.idModified = true
        }

        return updatedField
      })
    )
  }

  const addSelectOption = (index: number) => {
    setSchemaFields(prev =>
      prev.map((field, i) => {
        if (i !== index || !field.options) return field

        return {
          ...field,
          options: [...field.options, { label: '', value: '' }]
        }
      })
    )
  }

  const removeSelectOption = (fieldIndex: number, optionIndex: number) => {
    setSchemaFields(prev =>
      prev.map((field, i) => {
        if (i !== fieldIndex || !field.options) return field
        return {
          ...field,
          options: field.options.filter(({ _, idx }: ComponentSchemaFieldOption) => idx !== optionIndex)
        }
      })
    )
  }

  return {
    schemaFields,
    setSchemaFields,
    addSchemaField,
    updateSchemaField,
    addSelectOption,
    removeSelectOption
  }
}

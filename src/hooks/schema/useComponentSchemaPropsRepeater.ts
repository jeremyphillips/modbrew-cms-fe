import { useState } from 'react'
import { sanitizeToCase } from '~utils'
import type { FieldType, ComponentSchemaFieldForm } from '~api/componentSchema'

const useComponentSchemaPropsRepeater = (initialFields: ComponentSchemaFieldForm[] = []) => {
  const [schemaFields, setSchemaFields] = useState<ComponentSchemaFieldForm[]>(initialFields)

  const addSchemaField = (fieldType: FieldType) => {
    const newField: ComponentSchemaFieldForm = {
      _id: `temp-${Math.random().toString(36).substr(2, 9)}`, // temporary unique ID for key
      id: '',
      name: '',
      description: '',
      fieldType,
      uiType: false,
      required: false,
      defaultValue: '',
      options: fieldType === 'Select' || fieldType === 'CheckBox' ? [] : undefined,
      idModified: false,
      validation: {
        minLength: null,
        maxLength: null,
      },
    }

    setSchemaFields(prev => [...prev, newField])
  }

  function updateSchemaField<K extends keyof ComponentSchemaFieldForm>(
    index: number,
    key: K,
    value: ComponentSchemaFieldForm[K]
  ) {
    setSchemaFields(prev =>
      prev.map((field, i) => {
        if (i !== index) return field

        const updatedField: ComponentSchemaFieldForm = {
          ...field,
          [key]: value,
        }

        // Auto-generate ID from name unless manually modified
        if (key === 'name' && !field.idModified) {
          updatedField.id = sanitizeToCase(value as string, false)
        }

        // Mark ID as manually modified
        if (key === 'id') {
          updatedField.idModified = true
        }

        return updatedField
      })
    )
  }

  const removeSchemaField = (index: number) => {
    setSchemaFields(prev => prev.filter((_, i) => i !== index))
  }

  const addSelectOption = (index: number) => {
    setSchemaFields(prev =>
      prev.map((field, i) => {
        if (i !== index || !field.options) return field

        return {
          ...field,
          options: [...field.options, { label: '', value: '' }],
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
          options: field.options.filter((_, idx) => idx !== optionIndex),
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
    removeSchemaField,
    removeSelectOption,
  }
}

export default useComponentSchemaPropsRepeater

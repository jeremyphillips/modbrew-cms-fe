import type { ComponentSchemaField } from '~api/componentSchema'

interface RenamedField {
  fieldId: string
  from: string
  to: string
}

const getRenamedFields = (prevSchema: ComponentSchemaField[], nextSchema: ComponentSchemaField[]): RenamedField[] => {
  const renames: RenamedField[] = []

  prevSchema.forEach(prevField => {
    const nextField = nextSchema.find(f => f.id === prevField.id)

    if (nextField && prevField.name !== nextField.name) {
      renames.push({
        fieldId: prevField.id,
        from: prevField.name,
        to: nextField.name,
      })
    }
  })

  return renames
}

export default getRenamedFields

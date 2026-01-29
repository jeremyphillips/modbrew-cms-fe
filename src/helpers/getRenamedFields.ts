const getRenamedFields = (prevSchema, nextSchema) => {
  const renames = []

  prevSchema.forEach(prevField => {
    const nextField = nextSchema.find(f => f.id === prevField.id)

    if (
      nextField &&
      prevField.name !== nextField.name
    ) {
      renames.push({
        fieldId: prevField.id,
        from: prevField.name,
        to: nextField.name
      })
    }
  })

  return renames
}

export default getRenamedFields 

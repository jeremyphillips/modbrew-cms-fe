import { ComponentSchemaForm } from '~modules/schema'

const ComponentSchemaCreate = () => {
  // const fieldTypes = ['CheckBox', 'File', 'Repeater', 'Select', 'Text', 'Textarea']

  return (
    <>
      <h1>Create New Component Schema</h1>
      <ComponentSchemaForm action="CREATE" />
    </>
  )
}

export default ComponentSchemaCreate

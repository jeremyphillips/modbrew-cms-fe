import { ComponentSchemaForm } from '~modules/schema'
import type { ComponentSchemaFormPayload } from '~api/componentSchema'

const ComponentSchemaCreate = () => {
  const emptyInitialValues: ComponentSchemaFormPayload = {
    id: '',
    name: '',
    description: '',
    category: '',
    allowedChildren: [],
    maxInstances: null,
    schema: [],
  }

  return (
    <>
      <h1>Create New Component Schema</h1>
      <ComponentSchemaForm initialValues={emptyInitialValues} resourceId={null} action="CREATE" />
    </>
  )
}

export default ComponentSchemaCreate
